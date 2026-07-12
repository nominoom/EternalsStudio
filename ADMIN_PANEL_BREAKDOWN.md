# EternalsStudio Admin Dashboard Breakdown

This document provides a technical breakdown of the Admin Panel implementation in the EternalsStudio application. It explains routing, access controls, database operations, and layout systems.

---

## 🔒 1. Access Control & Authorization

The admin panel implements a two-layer security validation system:

### Layer A: Route Shielding (Middleware)
Paths matching `/admin/*` are blocked from unauthorized browser requests using the Clerk Server middleware defined in [src/middleware.ts](file:///C:/Users/stnoo/Downloads/EternalsStudio/src/middleware.ts):
* The middleware defines route matchers using `createRouteMatcher(['/admin(.*)'])`.
* If a request matches, `auth.protect()` triggers, forcing Clerk to redirect unauthenticated requests to the Sign-In page.

### Layer B: Role Checking (Frontend Client)
Even if logged in, only administrators can view the panel contents. This is checked inside the React component [src/app/admin/page.tsx](file:///C:/Users/stnoo/Downloads/EternalsStudio/src/app/admin/page.tsx):
* Resolves `user.publicMetadata?.role` dynamically using Clerk's `useUser()` hook.
* Checks: `const isAdmin = user?.publicMetadata?.role === 'admin';`
* If `isAdmin` evaluates to false, the dashboard aborts rendering and returns a styled `<ShieldAlert>` "Access Denied" screen, locking out normal clients.

---

## 💾 2. Database & Data Fetching

Once authorized, the page loads statistics and records from two separate Supabase tables.

### Supabase Connection
The application queries database layers via the Supabase Admin instance imported from [src/lib/supabase.ts](file:///C:/Users/stnoo/Downloads/EternalsStudio/src/lib/supabase.ts).

### Fetch Logic
In [src/app/admin/page.tsx](file:///C:/Users/stnoo/Downloads/EternalsStudio/src/app/admin/page.tsx#L56-L73), the dashboard queries data inside a `useEffect` hook:
* **Orders Query**: Fetches order items from the `orders` database table sorted by creation dates:
  ```typescript
  supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false })
  ```
* **Support Query**: Fetches form submissions from the `contact_messages` table:
  ```typescript
  supabaseAdmin.from('contact_messages').select('*').order('created_at', { ascending: false })
  ```

### Development Simulation Fallbacks
To support offline development and testing, the client catches database exceptions or empty queries and feeds structured mock records (`mockOrders` and `mockMessages`) into the state arrays. This ensures layout systems display statistics even without network connection to the database.

---

## 📊 3. Dashboard Interface & Features

The dashboard layout (built on React + Tailwind CSS) features three key components:

### A. Stats Metrics Row
Aggregates summary totals from loaded datasets to display:
1. **Total Revenue**: Sum of transaction volumes, calculated dynamically on render:
   ```typescript
   orders.reduce((sum, o) => sum + Number(o.total_amount), 0)
   ```
2. **Total Orders Count**: The length of the orders array.
3. **Client Messages Count**: The length of support form messages.

### B. Order Entries View
Renders a responsive table outlining:
* Order ID (formatted in monospace fonts for alignment)
* Customer Email
* Payment Totals (formatted to two decimal points)
* Order Status Badge (`completed` / `pending`)
* Date formatting logic: `new Date(ord.created_at).toLocaleDateString()`

### C. Client Support Inbox
Renders message boxes showing details of messages submitted through contact pages, including:
* Subject line header
* Date timestamp
* Sender Name and Email
* Raw body message rendered inside a styled inner card.
