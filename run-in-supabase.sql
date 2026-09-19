-- =====================================================================
-- ETERNALS STUDIO: COMPLETE DATABASE SETUP & MIGRATION
-- Run this script in your Supabase SQL Editor (supabase.com/dashboard)
-- =====================================================================

-- 1. Create Site Content Table (Powers Visual Site Builder & Live Editor)
CREATE TABLE IF NOT EXISTS public.site_content (
    id INT PRIMARY KEY DEFAULT 1,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT single_row_site_content CHECK (id = 1)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select site_content" ON public.site_content;
CREATE POLICY "Allow public select site_content" ON public.site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role update site_content" ON public.site_content;
CREATE POLICY "Allow service role update site_content" ON public.site_content FOR ALL USING (true);


-- 2. Add New Feature Columns to Project Requests
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS download_url TEXT DEFAULT NULL;
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS scope_type TEXT DEFAULT 'personal';
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS organization_name TEXT DEFAULT NULL;
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::JSONB;
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS payout_cut_percentage NUMERIC DEFAULT 70.0;


-- 3. Add New Feature Columns to Orders (Personal vs Org & Deliverables)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS scope_type TEXT DEFAULT 'personal';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS organization_name TEXT DEFAULT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::JSONB;


-- 4. Ensure System Events Table Exists
CREATE TABLE IF NOT EXISTS public.system_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_key TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read system_events" ON public.system_events;
CREATE POLICY "Allow public read system_events" ON public.system_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role insert system_events" ON public.system_events;
CREATE POLICY "Allow service role insert system_events" ON public.system_events FOR ALL USING (true);

-- Done!
SELECT 'Eternals Studio database migration successfully applied!' as status;
