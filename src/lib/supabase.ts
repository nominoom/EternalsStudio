import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for standard public/auth operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client with service role bypass for backend functions (Stripe webhooks, contact logging, admin queries)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
