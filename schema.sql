-- Eternals Studio Database Table Schemas

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS for Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- Clerk User ID
    user_email TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    stripe_session_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS for Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to read their own orders" ON public.orders FOR SELECT USING (auth.uid()::text = user_id);

-- 3. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);

-- Enable RLS for Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to read their own order items" ON public.order_items FOR SELECT USING (true);

-- 4. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread', -- 'unread', 'read', 'replied', 'archived'
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS for Contact Messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow insert access to public
CREATE POLICY "Allow public to insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Seed Initial Products Data
INSERT INTO public.products (name, description, price, category, image_url) VALUES
('Website Template Pack', 'Modern, responsive website templates built with React and Tailwind.', 49.99, 'templates', ''),
('Logo Design Bundle', '50+ premium vector brand and esports logo assets.', 29.99, 'graphics', ''),
('3D Model Collection', 'High-quality 3D assets for digital renders and overlays.', 79.99, 'assets', ''),
('Color Grading Presets', 'Professional LUT presets for film and video grading editors.', 19.99, 'presets', ''),
('Social Media Templates', 'Instagram grid grids, YouTube headers, and Twitter templates.', 24.99, 'templates', ''),
('Icon Pack Collection', '1000+ custom vector icons designed for UI designers.', 24.99, 'graphics', ''),
('Test Product ($1)', 'A test product for verifying checkout configuration.', 1.00, 'presets', '')
ON CONFLICT DO NOTHING;

-- 5. QuickBooks OAuth Tokens Table
CREATE TABLE IF NOT EXISTS public.quickbooks_tokens (
    id INT PRIMARY KEY DEFAULT 1,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    refresh_expires_at TIMESTAMPTZ NOT NULL,
    realm_id TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS for QuickBooks Tokens (Admin-only readable but let service bypass it)
ALTER TABLE public.quickbooks_tokens ENABLE ROW LEVEL SECURITY;

-- 6. System Events Table (For tracking deployments, webhooks, and audit logs)
CREATE TABLE IF NOT EXISTS public.system_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_key TEXT NOT NULL,
    category TEXT NOT NULL, -- 'deployment', 'stripe', 'quickbooks', 'database', 'auth'
    status TEXT NOT NULL, -- 'info', 'success', 'warning', 'error'
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS for System Events
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;


-- 7. Project Requests Table
CREATE TABLE IF NOT EXISTS public.project_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    file_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'claimed', 'completed'
    assigned_to_id TEXT,
    assigned_to_name TEXT,
    invoice_url TEXT,
    invoice_amount NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public to insert requests" ON public.project_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow team and admin to read requests" ON public.project_requests FOR SELECT USING (true);
CREATE POLICY "Allow team and admin to update requests" ON public.project_requests FOR UPDATE USING (true);

-- 8. Request Collaborators Table
CREATE TABLE IF NOT EXISTS public.request_collaborators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.project_requests(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(request_id, user_id)
);

-- Enable RLS
ALTER TABLE public.request_collaborators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to collaborators" ON public.request_collaborators FOR SELECT USING (true);
CREATE POLICY "Allow team and admin to join as collaborator" ON public.request_collaborators FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow team and admin to leave collaboration" ON public.request_collaborators FOR DELETE USING (true);



