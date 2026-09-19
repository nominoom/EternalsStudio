# Eternals Studio — System Communication & Visual Architecture Guidebook

> **Audience**: Core Developers, Systems Architects, and Technical Maintainers  
> **Repository**: `nominoom/EternalsStudio`  
> **Framework**: Next.js 16 (Turbopack, App Router, React 19)

---

## 1. High-Level System Architecture & Global Communication Hub

Eternals Studio combines a client-facing digital marketplace, bespoke custom design request portal, collaborative team operations board, and administrator control panel. The system interfaces with **six primary external third-party services** alongside a centralized **Supabase PostgreSQL** database.

### 🌐 Global Communication Topology

```mermaid
flowchart TB
    subgraph Clients["Browser & Client Surfaces"]
        Visitor["Public Visitor\n(Home, Store, Portfolio, Contact)"]
        ClientUser["Authenticated Client\n(Client Dashboard, Orders)"]
        TeamUser["Team Member\n(Team Portal, Task Board)"]
        AdminUser["Studio Administrator\n(Admin Command Center)"]
        ChatWidget["Tawk.to Floating Widget\n(Live Chat Support)"]
    end

    subgraph AppServer["Next.js 16 Application Server (App Router)"]
        Proxy["Proxy / Middleware\n(Route Shielding)"]
        AuthLib["Auth Guard Helper\n(requireUser / requireAdmin)"]
        APIRoutes["Route Handlers\n(/api/*)"]
        ContextProviders["React Context Engine\n(Admin, Cart, SiteContent)"]
        LoggerLib["Audit Logger\n(logEvent & Fallback)"]
        QBLib["QuickBooks Core\n(OAuth & Token Manager)"]
    end

    subgraph ThirdParties["Third-Party Service Providers"]
        Clerk["Clerk Auth\n(Identity, Session, Roles)"]
        Stripe["Stripe Payments\n(Checkout, Invoices, Webhooks)"]
        Resend["Resend Mail API\n(Transactional Emails)"]
        QuickBooks["Intuit QuickBooks Online\n(Accounting, Invoices, Payments)"]
        HostingerHook["Hostinger Git Auto-Deploy Hook\n(Deploy Webhooks)"]
        TawkCloud["Tawk.to Servers\n(Live Operator Routing)"]
    end

    subgraph DatabaseLayer["Data Persistence"]
        SupabaseDB[("Supabase PostgreSQL\n(Tables, Tokens, Audit Logs)")]
    end

    %% Client Interactions
    Visitor --> Proxy
    ClientUser --> Proxy
    TeamUser --> Proxy
    AdminUser --> Proxy
    ChatWidget <--> TawkCloud

    %% Proxy & Middleware
    Proxy --> Clerk
    Proxy --> APIRoutes
    Proxy --> ContextProviders

    %% Route Handlers to Auth & Libs
    APIRoutes --> AuthLib
    AuthLib --> Clerk
    APIRoutes --> LoggerLib
    APIRoutes --> QBLib

    %% App Server to Third Parties
    APIRoutes <--> Stripe
    APIRoutes --> Resend
    APIRoutes --> HostingerHook
    QBLib <--> QuickBooks

    %% Data Layer
    APIRoutes <--> SupabaseDB
    LoggerLib --> SupabaseDB
    QBLib <--> SupabaseDB
    ContextProviders <--> SupabaseDB

    %% External Webhooks Inbound
    Stripe -.->|"POST /api/webhooks/stripe"| APIRoutes
    QuickBooks -.->|"POST /api/webhooks/quickbooks"| APIRoutes
```

---

## 2. Third-Party Integration Matrix

| Third Party | Purpose | Inbound Touchpoints | Outbound Touchpoints | Auth / Credentials Required | Fallback / Bypass Behavior |
|---|---|---|---|---|---|
| **Clerk** | User Authentication, Session Management, Role RBAC (`admin`, `team`) | Session Tokens, Client JWTs, `<SignIn />` / `<SignUp />` | `currentUser()` server lookup, user role verification via `publicMetadata` | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | None (hard dependency for protected routes; 401/403 returned if invalid) |
| **Supabase** | Primary relational PostgreSQL data store, audit logs, file attachments | Real-time queries, REST/PostgREST data fetching | Table Inserts, Updates, Soft-deletes, Upserts | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | In-memory mock arrays, local storage fallbacks, console warning logs |
| **Stripe** | Payment gateway, checkout sessions, custom quote invoices | Inbound webhooks (`checkout.session.completed`) | Checkout session creation, line item queries | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Non-production mock payment verification (`/api/checkout/verify-mock`) |
| **Resend** | Transactional email delivery for quotes, receipts, contact inquiries | None | Client invoice notifications, quote confirmations, admin direct replies | `RESEND_API_KEY`, `ADMIN_EMAIL` | Console logging bypass; transaction execution continues without throwing |
| **Intuit QuickBooks** | Cloud bookkeeping, invoice synchronizing, payment reconciliation | Inbound CDC Webhook notifications (`/api/webhooks/quickbooks`) | OAuth 2.0 code exchange, proactive token refresh, invoice/payment queries | `QUICKBOOKS_CLIENT_ID`, `QUICKBOOKS_CLIENT_SECRET`, `QUICKBOOKS_ENVIRONMENT`, `QUICKBOOKS_WEBHOOK_VERIFIER` | Database storage of refresh tokens in `quickbooks_tokens`; graceful failure logging |
| **Hostinger** | VPS / Cloud Web Hosting, Git Auto-Deployment Webhooks | Inbound webhooks (`/api/webhooks/stripe`, `/api/webhooks/quickbooks`) | HTTP POST to Hostinger Auto-Deploy Webhook (`HOSTINGER_DEPLOY_HOOK_URL`) | `HOSTINGER_DEPLOY_HOOK_URL` | Audit event written to `system_events` with Hostinger deployment status |
| **Tawk.to** | Real-time customer support live chat | Client-side WebSocket to Tawk edge | Client-side script injection | Embed script ID (`s1.src = '...'`) | Collapsed floating widget with manual open/close and draggable state |

---

## 3. Core Authentication & Authorization Architecture

Authentication is centralized in [`src/lib/auth.ts`](file:///c:/Users/stnoo/Downloads/EternalsStudio/src/lib/auth.ts) and evaluated before any business logic executes in route handlers.

### 🔐 Route Protection & Role Verification Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client as User / Frontend Client
    participant Proxy as Next.js Middleware / Route Handler
    participant Auth as requireUser() / requireAdmin() (src/lib/auth.ts)
    participant Clerk as Clerk Identity Provider
    participant Route as API Route Business Logic

    Client->>Proxy: HTTP Request (GET/POST/PATCH/DELETE)
    Proxy->>Auth: Invoke requireUser() or requireAdmin()
    Auth->>Clerk: currentUser() [Inspect Session & Token]

    alt No Active Session / Expired
        Clerk-->>Auth: null
        Auth-->>Proxy: { ok: false, response: 401 Unauthorized }
        Proxy-->>Client: 401 {"error": "Authentication required"}
    else Session Valid
        Clerk-->>Auth: User Object (id, email, publicMetadata)
        
        opt requireAdmin() Check
            Auth->>Auth: Check user.publicMetadata?.role === 'admin'
            alt Role is not 'admin'
                Auth-->>Proxy: { ok: false, response: 403 Forbidden }
                Proxy-->>Client: 403 {"error": "Access denied: Administrator privileges required"}
            end
        end

        Auth-->>Proxy: { ok: true, user: User }
        Proxy->>Route: Proceed with Authenticated User Context
        Route-->>Client: 200/201 Success Response
    end
```

### Role Matrix & Access Hierarchy

```mermaid
graph TD
    subgraph Roles["Role Hierarchy"]
        Guest["Public / Guest"]
        ClientRole["Authenticated Client\n(Default Role)"]
        TeamRole["Team Member\n(publicMetadata.role = 'team')"]
        AdminRole["Studio Administrator\n(publicMetadata.role = 'admin')"]
    end

    Guest -->|"Browse Store, Portfolio, Contact, Submit Request"| PublicRoutes["/api/requests [POST]\n/api/contact [POST]\n/api/checkout [POST]"]
    ClientRole -->|"Manage Own Requests, Upload Files, Delete Own Projects"| ClientRoutes["/api/requests/cancel\n/api/requests/delete\n/api/upload\n/api/checkout/verify-mock"]
    TeamRole -->|"View Tasks, Claim Tasks, Join Collaboration, Mark Complete"| TeamRoutes["/api/team/tasks\n/api/team/tasks/claim\n/api/team/tasks/collaborate\n/api/team/tasks/complete"]
    AdminRole -->|"Full Access: Data Metrics, Deploy, Messages, Invoicing, Overrides"| AdminRoutes["/api/admin/*\n/api/team/tasks/approve\nDelete/Purge Any Request\nSite Content CMS"]
```

---

## 4. Subsystem Architectures & Function Life-Cycles

---

### Subsystem A: Client Project Request Lifecycle

Handles custom client specifications from initial submission through approval, team delegation, and delivery.

#### 1. Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> pending : Client Submits (/api/requests)
    pending --> awaiting_payment : Admin Generates Quote (/api/admin/requests/invoice)
    pending --> cancelled : Client Cancels (/api/requests/cancel)
    pending --> soft_deleted : Client/Admin Deletes (/api/requests/delete)
    
    awaiting_payment --> approved : Stripe Payment Confirmed (Webhook or /api/checkout/verify)
    awaiting_payment --> cancelled : Client Cancels
    
    approved --> claimed : Team Member Claims Task (/api/team/tasks/claim)
    claimed --> in_collaboration : Team Member Joins (/api/team/tasks/collaborate)
    in_collaboration --> completed : Owner Marks Complete + Deliverable URL (/api/team/tasks/complete)
    claimed --> completed : Owner Marks Complete + Deliverable URL
    
    completed --> [*]
    cancelled --> [*]
    soft_deleted --> [*]
```

#### 2. Detailed Communication Flow: Project Request Creation

```mermaid
sequenceDiagram
    autonumber
    actor Client as Client Browser
    participant API as POST /api/requests
    participant DB as Supabase (project_requests)
    participant Log as Logger (logEvent)

    Client->>API: JSON: { clientName, clientEmail, subject, description, scopeType, orgName }
    API->>API: Validate mandatory fields (name, email, subject)
    
    API->>DB: INSERT into project_requests (status: 'pending')
    alt DB Available
        DB-->>API: Created record with UUID
    else DB Down / Offline
        API->>API: Fallback: Generate mock object (id: mock-req-*)
    end

    API->>Log: logEvent('evt_request_received', 'contact', 'success')
    Log->>DB: INSERT into system_events
    API-->>Client: 200 { success: true, request }
```

#### 3. Detailed Communication Flow: Request Cancellation & Deletion

```mermaid
sequenceDiagram
    autonumber
    actor User as Client / Admin
    participant DelAPI as POST /api/requests/delete
    participant Auth as requireUser()
    participant DB as Supabase (project_requests)
    participant Log as Logger (logEvent)

    User->>DelAPI: JSON: { requestId }
    DelAPI->>Auth: Authenticate
    Auth-->>DelAPI: Authenticated User

    DelAPI->>DB: SELECT * FROM project_requests WHERE id = requestId
    DB-->>DelAPI: Request Data (client_email, user_id)

    DelAPI->>DelAPI: Verify Authorization: (user.email === request.client_email) OR (role === 'admin')
    alt Unauthorized
        DelAPI-->>User: 403 Forbidden
    else Authorized
        DelAPI->>DB: UPDATE project_requests SET deleted_at = NOW()
        DelAPI->>Log: logEvent('evt_client_request_deleted', 'client', 'info')
        DelAPI-->>User: 200 { success: true }
    end
```

---

### Subsystem B: Admin Operations & Delegation

The Admin command center gives administrators real-time visibility, automated invoice quotation, and CI/CD deployment capabilities.

#### 1. Admin Data Metrics Aggregation (`/api/admin/data`)

```mermaid
flowchart TD
    Admin[Admin Browser] -->|GET /api/admin/data| RouteHandler[Route Handler]
    RouteHandler -->|1. Validate| AuthGuard{requireAdmin}
    AuthGuard -->|Rejected| Denied[401/403 Response]
    AuthGuard -->|Approved| ParallelFetch[Parallel Data Aggregation]

    subgraph ParallelFetch["Supabase Queries (Promise.all)"]
        Q1["orders.select(*).order(created_at)"]
        Q2["project_requests.select(*).order(created_at)"]
        Q3["contact_messages.select(*).order(created_at)"]
        Q4["system_events.select(*).order(created_at)"]
    end

    ParallelFetch --> StatsEngine[Metrics Engine]
    
    subgraph StatsEngine["Computed Analytics"]
        S1["Total Revenue = SUM(orders.total_amount)"]
        S2["Active Orders Count"]
        S3["Pending Requests Count"]
        S4["Unread Contact Messages Count"]
    end

    StatsEngine --> Response[Return JSON: { stats, orders, requests, messages, auditLogs }]
    Response --> Admin
```

#### 2. Invoice Quote Generation & Email Pipeline (`/api/admin/requests/invoice`)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant InvoiceAPI as POST /api/admin/requests/invoice
    participant Auth as requireAdmin()
    participant DB as Supabase
    participant Stripe as Stripe API
    participant Resend as Resend Mail API
    participant Log as Logger (logEvent)
    actor Client as Customer

    Admin->>InvoiceAPI: JSON: { requestId, amount: 850.00 }
    InvoiceAPI->>Auth: Check admin role
    Auth-->>InvoiceAPI: Admin Verified

    InvoiceAPI->>DB: Fetch project request details (subject, email, name)
    DB-->>InvoiceAPI: Request Record

    InvoiceAPI->>Stripe: checkout.sessions.create({ line_items: [{ amount: 85000 }], metadata: { type: 'project_invoice', request_id } })
    Stripe-->>InvoiceAPI: Stripe Session (url, id)

    InvoiceAPI->>DB: UPDATE project_requests SET invoice_url = session.url, invoice_amount = 850.00, status = 'awaiting_payment'
    
    InvoiceAPI->>Resend: emails.send({ to: client_email, subject: "Quote Prepared", html: PayButtonWithSessionUrl })
    Resend-->>Client: Deliver Branded Invoice Email

    InvoiceAPI->>Log: logEvent('evt_invoice_created', 'stripe', 'info')
    InvoiceAPI-->>Admin: 200 { success: true, request: updatedRequest }
```

#### 3. Production Deployment Pipeline (`/api/admin/deploy`)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant DeployAPI as POST /api/admin/deploy
    participant Auth as requireAdmin()
    participant Log as Logger (logEvent)
    participant Vercel as Vercel Deploy Hook

    Admin->>DeployAPI: JSON: { step: 'initiated' | 'building' | 'success' | 'failed' }
    DeployAPI->>Auth: Check admin role
    Auth-->>DeployAPI: Admin Verified

    alt Step is 'initiated'
        DeployAPI->>Vercel: Optional HTTP POST to VERCEL_DEPLOY_HOOK_URL
        DeployAPI->>Log: logEvent('evt_deploy_initiated', 'deployment', 'info')
    else Step is 'success'
        DeployAPI->>Log: logEvent('evt_deploy_success', 'deployment', 'success')
    else Step is 'failed'
        DeployAPI->>Log: logEvent('evt_deploy_failed', 'deployment', 'error')
    end

    DeployAPI-->>Admin: 200 { success: true, event }
```

---

### Subsystem C: Team Collaboration Portal

Allows designated team members (`publicMetadata.role === 'team' | 'admin'`) to claim tasks, collaborate across multiple designers, and mark completed jobs for automatic customer delivery.

#### Collaborative Workflow Architecture

```mermaid
flowchart TD
    subgraph TaskDiscovery["1. Task Discovery"]
        ApprovedReq["Request marked 'approved' (Paid)"] --> TeamBoard["GET /api/team/tasks\n(Merges requests + request_collaborators)"]
    end

    subgraph TaskClaiming["2. Task Assignment"]
        TeamBoard --> ClaimAction["POST /api/team/tasks/claim"]
        ClaimAction --> DBClaim["Supabase: UPDATE project_requests\nstatus = 'claimed'\nassigned_to_id = user.id\nassigned_to_name = userName"]
    end

    subgraph MultiStaff["3. Collaboration"]
        DBClaim --> CollabAction["POST /api/team/tasks/collaborate"]
        CollabAction --> DBCollab["Supabase: INSERT INTO request_collaborators\n(request_id, user_id, user_name)"]
    end

    subgraph Completion["4. Delivery & Payout"]
        DBCollab --> CompleteAction["POST /api/team/tasks/complete"]
        CompleteAction --> DBComplete["Supabase: UPDATE project_requests\nstatus = 'completed'\ndownload_url = deliverableUrl"]
        DBComplete --> ClientDeliverable["Client Dashboard: Download File Active"]
        DBComplete --> PayoutEngine["Team Dashboard: 70% Cut Calculated for Weekly Pay"]
    end
```

---

### Subsystem D: E-Commerce Store, Cart & Stripe Payments

Handles digital store items, exclusive 1-of-1 assets, cart persistence, checkout generation, and payment webhooks.

#### 1. E-Commerce Purchase Flow

```mermaid
sequenceDiagram
    autonumber
    actor Buyer as Customer
    participant Cart as CartContext (localStorage)
    participant CheckoutAPI as POST /api/checkout
    participant Auth as requireUser()
    participant Stripe as Stripe Checkout
    participant Webhook as POST /api/webhooks/stripe
    participant DB as Supabase (orders, order_items)
    participant Resend as Resend Mail

    Buyer->>Cart: Add Item to Cart (Personal or Org Scope)
    Buyer->>CheckoutAPI: POST items, scopeType, organizationName
    CheckoutAPI->>Auth: Validate Authenticated User
    Auth-->>CheckoutAPI: User Verified
    
    CheckoutAPI->>Stripe: checkout.sessions.create({ line_items, customer_email, metadata })
    Stripe-->>CheckoutAPI: Session URL
    CheckoutAPI-->>Buyer: Redirect URL to Stripe Checkout

    Buyer->>Stripe: Enter Card Details & Submit Payment
    Stripe-->>Webhook: Event: checkout.session.completed (signed payload)
    
    Webhook->>Webhook: stripe.webhooks.constructEvent(body, signature, secret)
    
    alt Project Invoice Checkout
        Webhook->>DB: UPDATE project_requests SET status = 'approved'
        Webhook->>Resend: Send Payment Confirmation & Project Start Email
    else Store Products Checkout
        Webhook->>DB: INSERT INTO orders (user_id, total_amount, stripe_session_id)
        Webhook->>DB: INSERT INTO order_items (order_id, product_name, price)
    end

    Webhook-->>Stripe: 200 { received: true }
```

#### 2. Mock Payment Sandbox Guard (`/api/checkout/verify-mock`)

To protect production accounting while allowing frictionless local offline testing, mock verifications are strictly fenced:

```mermaid
flowchart TD
    Req[POST /api/checkout/verify-mock] --> AuthCheck{requireUser}
    AuthCheck -->|No| R401[401 Unauthorized]
    AuthCheck -->|Yes| EnvCheck{"NODE_ENV === 'production' AND\nValid STRIPE_SECRET_KEY?"}
    EnvCheck -->|True: Production with Live Stripe| BlockMock["403 Forbidden\n(Mock Verification Disabled in Live Production)"]
    EnvCheck -->|False: Local Dev / Placeholder Keys| OwnerCheck{"User is Request Owner OR\nAdmin?"}
    OwnerCheck -->|No| R403[403 Forbidden: Access Denied]
    OwnerCheck -->|Yes| UpdateDB["Supabase: UPDATE project_requests\nSET status = 'approved'"]
    UpdateDB --> LogEvent["Logger: logEvent('evt_mock_payment_verified', 'stripe', 'warning')"]
    LogEvent --> Success["200 { success: true, request }"]
```

---

### Subsystem E: Intuit QuickBooks Accounting Synchronization

Provides automated synchronization between Eternals Studio orders and Intuit QuickBooks Online chart of accounts.

#### 1. OAuth 2.0 Authorization & Refresh Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant QBRoute as GET /api/auth/quickbooks
    participant IntuitAuth as Intuit OAuth Gateway
    participant QBCallback as GET /api/auth/quickbooks/callback
    participant DB as Supabase (quickbooks_tokens)
    participant QBCore as getValidQBToken() (src/lib/quickbooks.ts)

    Admin->>QBRoute: Connect QuickBooks
    QBRoute-->>IntuitAuth: Redirect to Intuit OAuth Login (Scopes: accounting, payment)
    IntuitAuth-->>Admin: Consent Screen
    Admin->>IntuitAuth: Grant Permission
    IntuitAuth-->>QBCallback: Redirect with authorization_code & realmId

    QBCallback->>IntuitAuth: POST /oauth2/v1/tokens/bearer (code exchange)
    IntuitAuth-->>QBCallback: access_token, refresh_token, expires_in
    QBCallback->>DB: UPSERT into quickbooks_tokens (id: 1, access_token, refresh_token, realm_id)
    QBCallback-->>Admin: Render HTML Success Page

    Note over QBCore,DB: Periodic Background Check During API Calls:
    QBCore->>DB: SELECT * FROM quickbooks_tokens WHERE id = 1
    alt Token Expired (Date.now() >= expires_at - 1 min)
        QBCore->>IntuitAuth: POST /oauth2/v1/tokens/bearer (grant_type: refresh_token)
        IntuitAuth-->>QBCore: New access_token, refresh_token
        QBCore->>DB: UPDATE quickbooks_tokens
    end
```

#### 2. Inbound QuickBooks Webhook Listener (`/api/webhooks/quickbooks`)

```mermaid
sequenceDiagram
    autonumber
    participant Intuit as Intuit Webhooks Gateway
    participant QBWebhook as POST /api/webhooks/quickbooks
    participant Crypto as HMAC SHA-256 Verifier
    participant QBLib as quickbooksRequest()
    participant DB as Supabase (orders)

    Intuit->>QBWebhook: POST Payload with header 'intuit-signature'
    QBWebhook->>Crypto: Verify HMAC with QUICKBOOKS_WEBHOOK_VERIFIER
    
    loop For Each Notification Entity
        alt Entity is 'Invoice'
            QBWebhook->>QBLib: Fetch Invoice: /v3/company/{realmId}/invoice/{entityId}
            QBLib-->>QBWebhook: { Invoice: { Balance: 0.00, TotalAmt: 850.00 } }
            opt Balance == 0 (Paid in QuickBooks)
                QBWebhook->>DB: UPDATE orders SET status = 'completed' WHERE stripe_session_id = entityId
            end
        else Entity is 'Payment'
            QBWebhook->>QBLib: Fetch Payment: /v3/company/{realmId}/payment/{entityId}
            QBLib-->>QBWebhook: { Payment: { LinkedTxn: [{ TxnId: invoiceId }] } }
            QBWebhook->>DB: UPDATE orders SET status = 'completed' WHERE stripe_session_id = invoiceId
        end
    end

    QBWebhook-->>Intuit: 200 { received: true }
```

---

### Subsystem F: Contact Inquiries & Live Support

Connects prospective customers with the studio through asynchronous contact forms and real-time live chat.

#### Communication Flow: Public Contact Inquiries

```mermaid
flowchart LR
    Visitor[Website Visitor] -->|1. Submit Form| ContactAPI["POST /api/contact"]
    
    subgraph ContactAPI["Contact Route Handler"]
        DBStore["2. Save to Supabase\n(contact_messages, status: 'unread')"]
        EmailDispatch["3. Dispatch via Resend\n(To: ADMIN_EMAIL)"]
        AuditLog["4. Log System Event\n('evt_contact_message_received')"]
    end

    ContactAPI --> DBStore
    ContactAPI --> EmailDispatch
    ContactAPI --> AuditLog
    
    DBStore --> Supabase[("Supabase DB")]
    EmailDispatch --> Resend["Resend Mail Server"]
    Resend --> AdminInbox["Admin Mailbox"]
```

---

### Subsystem G: Centralized Audit Logging Engine (`src/lib/logger.ts`)

Every state-altering event (payments, uploads, deletes, quotes, claims, deployments) passes through a fault-tolerant logging pipeline.

#### Fault-Tolerant Event Dispatcher

```mermaid
flowchart TD
    Caller[Calling Function / API Route] -->|logEvent(key, category, status, message, meta)| Engine[Logger Core]
    Engine --> TryDB[Attempt Write to Supabase: system_events]
    
    TryDB -->|Success| DBWritten[Record Persisted to PostgreSQL]
    DBWritten --> ReturnEvent[Return SystemEvent]
    
    TryDB -->|DB Error / Table Missing / Timeout| Fallback[Console Interceptor fallbackLog]
    
    subgraph Fallback["Console Interceptor"]
        CheckStatus{status}
        CheckStatus -->|'error'| CError["console.error([EVENT][CAT][ERR] ...)"]
        CheckStatus -->|'warning'| CWarn["console.warn([EVENT][CAT][WARN] ...)"]
        CheckStatus -->|'info' / 'success'| CLog["console.log([EVENT][CAT][INFO] ...)"]
    end

    Fallback --> ReturnEvent
```

---

## 5. Master System Communication & Timing Matrix

This master reference catalog specifies **where**, **when**, and **how** every API route and functional module interacts with third parties and database layers.

| Subsystem | Function / Route | Trigger ("When") | Destination ("Where") | Protocol / Payload | Output / State Change |
|---|---|---|---|---|---|
| **Auth** | `requireUser()` | Top of any protected route | Clerk API / Session JWT | Internal function call | User object or 401 response |
| **Auth** | `requireAdmin()` | Top of any admin-restricted route | Clerk User Public Metadata | Internal function call | Admin User object or 403 response |
| **Admin** | `GET /api/admin/data` | Admin dashboard initial page load | Supabase Database | PostgREST Parallel SELECT | Summary analytics and recent orders/requests |
| **Admin** | `POST /api/admin/deploy` | Admin clicks "Trigger Deployment" | Vercel Deploy Hook & Supabase | HTTP POST + `system_events` insert | Builds triggered, audit events created |
| **Admin** | `PATCH /api/admin/messages` | Admin marks message read/replied | Supabase `contact_messages` | PostgREST UPDATE | Message status updated |
| **Admin** | `POST /api/admin/messages` | Admin sends reply to contact message | Resend API & Supabase | HTTP POST (Resend) + UPDATE | Email sent to customer, marked 'replied' |
| **Admin** | `POST /api/admin/products` | Admin creates product or 1-of-1 item | Supabase `products` | PostgREST INSERT | New catalog product visible in store |
| **Admin** | `DELETE /api/admin/products` | Admin removes product | Supabase `products` | PostgREST DELETE | Product removed from catalog |
| **Admin** | `POST /api/admin/portfolio` | Admin uploads portfolio showcase | Supabase `portfolio_items` | PostgREST INSERT | Project appears on `/portfolio` |
| **Admin** | `DELETE /api/admin/portfolio`| Admin deletes showcase item | Supabase `portfolio_items` | PostgREST DELETE | Project removed from portfolio |
| **Admin** | `DELETE /api/admin/requests` | Admin soft-deletes or purges project | Supabase `project_requests` | PostgREST UPDATE/DELETE | `deleted_at` set or row permanently removed |
| **Admin** | `PATCH /api/admin/requests` | Admin restores soft-deleted project | Supabase `project_requests` | PostgREST UPDATE | `deleted_at` set to `null` |
| **Admin** | `POST /api/admin/requests/invoice` | Admin sends quote to client | Stripe & Resend & Supabase | Stripe Checkout + Resend Mail | Status: `awaiting_payment`, email dispatched |
| **Admin** | `POST /api/admin/site-content` | Admin saves live CMS edits | Supabase `site_content` | PostgREST UPSERT (id: 1) | Live site text updated across the platform |
| **Team** | `GET /api/team/tasks` | Team dashboard load | Supabase `project_requests` & `request_collaborators` | PostgREST Parallel SELECT | Open/claimed tasks merged with co-workers |
| **Team** | `POST /api/team/tasks/approve` | Admin approves spec for team work | Supabase `project_requests` | PostgREST UPDATE | Status: `approved`, visible on Team Board |
| **Team** | `POST /api/team/tasks/claim` | Team member claims task | Supabase `project_requests` | PostgREST UPDATE | Status: `claimed`, assigned to user |
| **Team** | `POST /api/team/tasks/collaborate` | Team member joins existing task | Supabase `request_collaborators` | PostgREST INSERT | Added as co-worker to project |
| **Team** | `POST /api/team/tasks/complete` | Task owner marks project done | Supabase `project_requests` | PostgREST UPDATE | Status: `completed`, download URL active |
| **Requests** | `POST /api/requests` | Client submits custom project spec | Supabase `project_requests` | PostgREST INSERT | New project request (status: `pending`) |
| **Requests** | `POST /api/requests/cancel` | Client cancels pending request | Supabase `project_requests` | PostgREST UPDATE | Status: `cancelled`, soft-deleted |
| **Requests** | `POST /api/requests/delete` | Client deletes own project from list | Supabase `project_requests` | PostgREST UPDATE | `deleted_at` set to timestamp |
| **Uploads** | `POST /api/upload` | Client/Admin attaches asset file | Supabase `project_requests` attachments | PostgREST UPDATE (array append) | Metadata and download URL stored |
| **Checkout** | `POST /api/checkout` | Customer initiates store purchase | Stripe API | Stripe Checkout Session Create | Customer redirected to Stripe Checkout |
| **Checkout** | `POST /api/checkout/verify` | Customer redirects back after payment | Stripe API & Resend & Supabase | Stripe Session Retrieve + DB Update | Status: `approved`, confirmation email sent |
| **Checkout** | `POST /api/checkout/verify-mock` | Sandbox/Offline payment simulation | Supabase `project_requests` | PostgREST UPDATE (guarded) | Status: `approved` without Stripe keys |
| **Webhooks** | `POST /api/webhooks/stripe` | Stripe completes checkout transaction | Stripe Webhook Verifier & Supabase | Signed HMAC SHA-256 Event | Orders inserted, invoices marked `approved` |
| **Webhooks** | `POST /api/webhooks/quickbooks` | QuickBooks invoice/payment change | Intuit Webhook Verifier & Supabase | Signed HMAC SHA-256 Event | Orders updated to `completed` |
| **QuickBooks**| `GET /api/auth/quickbooks` | Admin initiates QB integration | Intuit OAuth 2.0 | HTTP 302 Redirect | Browser redirected to Intuit consent |
| **QuickBooks**| `GET /api/auth/quickbooks/callback`| Intuit redirects with auth code | Intuit Token Endpoint & Supabase | HTTP POST + PostgREST UPSERT | OAuth tokens stored in `quickbooks_tokens` |
| **Contact** | `POST /api/contact` | Visitor submits general inquiry | Supabase & Resend API | PostgREST INSERT + Resend Email | Message stored, admin notified via email |

---

## 6. Guidelines for Developers Extending the Platform

When authoring new endpoints or integrating additional third parties, adhere to the following architecture patterns:

### 1. Guarding Routes with the Shared Auth Helper
Always use the discriminated union pattern from `@/lib/auth`:
- Call `requireUser()` for customer-facing or team-facing endpoints.
- Call `requireAdmin()` for administrative functions.
- Short-circuit immediately if `!auth.ok` by returning `auth.response`.

### 2. Standardized Audit Logging
For any database insert, update, delete, or financial transaction:
- Import `logEvent` from `@/lib/logger`.
- Assign a precise `event_key` (e.g. `evt_item_created`) and category (`'database'`, `'stripe'`, `'auth'`, `'client'`, `'deployment'`).
- Always pass metadata containing the actor email and primary identifier.

### 3. Graceful Third-Party Degradation
All third-party outbound requests (Stripe, Resend, QuickBooks, Hostinger) must be wrapped in `try/catch` blocks:
- If a service is down or API credentials are unset in local development, catch the error, log a descriptive warning, and provide a non-blocking fallback so user workflows do not crash.
- Never expose raw secret keys or third-party exception stacks directly to client responses.

---

## 7. Hostinger Deployment & Live Update Architecture

When deploying Eternals Studio to Hostinger (VPS with Node.js/PM2 or Cloud/Git Hosting), live events flow through three distinct channels:

```mermaid
flowchart TD
    subgraph HostingerPlatform["Hostinger Infrastructure"]
        Nginx["Hostinger Reverse Proxy\n(Nginx / LiteSpeed Cache)"]
        NodeApp["Next.js Application Runtime\n(Node.js / PM2 :3000)"]
        GitDeploy["Hostinger Git Auto-Deploy Engine\n(hPanel Advanced > Git)"]
    end

    subgraph ExternalSources["External Event Triggers"]
        AdminDashboard["Admin Dashboard\n('Redeploy CDN' / 'Trigger Deploy')"]
        StripeServer["Stripe Webhook Dispatcher\n(checkout.session.completed)"]
        SupabaseCloud[("Supabase PostgreSQL\n(system_events table)")]
    end

    %% Flow 1: Live Deploy Trigger
    AdminDashboard -->|"POST /api/admin/deploy"| NodeApp
    NodeApp -->|"Outbound POST (HOSTINGER_DEPLOY_HOOK_URL)"| GitDeploy
    GitDeploy -->|"Git Pull & Rebuild (pm2 reload)"| NodeApp

    %% Flow 2: Live Inbound Webhooks
    StripeServer -->|"POST /api/webhooks/stripe"| Nginx
    Nginx -->|"Bypasses Clerk Proxy"| NodeApp
    NodeApp -->|"Write Order & Event"| SupabaseCloud

    %% Flow 3: Cache Busting
    NodeApp -->|"Cache-Control: no-store\nforce-dynamic"| Nginx
```

### Key Deployment Requirements on Hostinger:
1. **Auto-Deploy Webhook (`HOSTINGER_DEPLOY_HOOK_URL`)**:
   In Hostinger hPanel > Advanced > Git, copy the Auto-Deployment Webhook URL and add it to your environment variables as `HOSTINGER_DEPLOY_HOOK_URL`. When triggered in the Admin panel, the server pings Hostinger to pull the repository and rebuild.
2. **Reverse Proxy & Trailing Slashes**:
   Ensure Hostinger's Nginx/LiteSpeed does not issue `301/302` redirects for `/api/webhooks/*` (which drops POST body payloads). Inbound webhooks bypass Clerk middleware in [`src/proxy.ts`](file:///c:/Users/stnoo/Downloads/EternalsStudio/src/proxy.ts).
3. **Cache Busting**:
   All live data routes (`/api/admin/data`, `/api/admin/site-content`, `/api/webhooks/*`) export `dynamic = 'force-dynamic'` and `revalidate = 0` with `Cache-Control: no-store` headers to prevent Hostinger reverse proxies from serving stale responses.
4. **Database Connectivity**:
   Ensure `NEXT_PUBLIC_SUPABASE_URL` resolves to an active Supabase project. If the Supabase project is paused or deleted, event logs cannot be persisted to the database and will fall back to local server logs.

