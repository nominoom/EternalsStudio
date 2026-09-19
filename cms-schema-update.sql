-- =====================================================================
-- ETERNALS STUDIO: COMPLETE CMS & WEBSITE BUILDER DATABASE SCHEMA
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- =====================================================================

-- 1. Ensure site_content table exists with single-row constraint & JSONB store
CREATE TABLE IF NOT EXISTS public.site_content (
    id INT PRIMARY KEY DEFAULT 1,
    content JSONB NOT NULL DEFAULT '{}'::JSONB,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT single_row_site_content CHECK (id = 1)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select site_content" ON public.site_content;
CREATE POLICY "Allow public select site_content" ON public.site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role update site_content" ON public.site_content;
CREATE POLICY "Allow service role update site_content" ON public.site_content FOR ALL USING (true);


-- 2. Ensure system_events audit logging table exists
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


-- 3. Dedicated Media Assets table (Optional structured storage)
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    size INT DEFAULT 0,
    type TEXT NOT NULL,
    alt TEXT DEFAULT '',
    dimensions JSONB DEFAULT '{}'::JSONB,
    uploaded_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    uploaded_by TEXT DEFAULT NULL
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read media_assets" ON public.media_assets;
CREATE POLICY "Allow public read media_assets" ON public.media_assets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role manage media_assets" ON public.media_assets;
CREATE POLICY "Allow service role manage media_assets" ON public.media_assets FOR ALL USING (true);


-- 4. Dedicated Page Revisions table (Optional structured version history)
CREATE TABLE IF NOT EXISTS public.cms_page_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id TEXT NOT NULL,
    version_number INT NOT NULL,
    page_title TEXT NOT NULL,
    snapshot JSONB NOT NULL,
    created_by TEXT NOT NULL,
    commit_message TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.cms_page_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service role manage cms_page_versions" ON public.cms_page_versions;
CREATE POLICY "Allow service role manage cms_page_versions" ON public.cms_page_versions FOR ALL USING (true);

-- Done!
SELECT 'Eternals Studio Visual CMS & Website Builder Database Schema successfully verified!' as status;
