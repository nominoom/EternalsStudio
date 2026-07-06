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
('Icon Pack Collection', '1000+ custom vector icons designed for UI designers.', 24.99, 'graphics', '')
ON CONFLICT DO NOTHING;
