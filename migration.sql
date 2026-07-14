-- Database Migration: Add support for client cancellations, completion download links, and admin recycle bin
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS download_url TEXT DEFAULT NULL;
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
