import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

if (typeof window !== 'undefined') {
  console.log('[Supabase Client] Initializing in browser:', {
    url: supabaseUrl,
    anonKeyLength: supabaseAnonKey?.length,
    isPlaceholderKey: supabaseAnonKey === 'placeholder-anon-key'
  });
}

// Client for standard public/auth operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client with service role bypass for backend functions (Stripe webhooks, contact logging, admin queries)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
