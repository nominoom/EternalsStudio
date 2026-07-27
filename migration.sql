-- Database Migration: Add support for client cancellations, completion download links, and admin recycle bin
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS download_url TEXT DEFAULT NULL;
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Add Scope (Personal vs Organization), File Upload Attachments, and Team Payout Cut Percentage
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS scope_type TEXT DEFAULT 'personal';
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS organization_name TEXT DEFAULT NULL;
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS payout_cut_percentage NUMERIC DEFAULT 70.0;

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS scope_type TEXT DEFAULT 'personal';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS organization_name TEXT DEFAULT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';

