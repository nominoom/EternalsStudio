const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envContent.match(/^NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)$/m);
  const keyMatch = envContent.match(/^SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)$/m);
  if (urlMatch && urlMatch[1]) supabaseUrl = urlMatch[1].trim();
  if (keyMatch && keyMatch[1]) serviceKey = keyMatch[1].trim();
}

if (!supabaseUrl || !serviceKey) {
  console.error('Error: Supabase environment variables not found.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function checkPolicies() {
  console.log('Fetching database policies...');
  const { data, error } = await supabase.rpc('get_policies_raw');
  
  if (error) {
    // If RPC is not available, do a raw select from pg_policies
    console.log('RPC get_policies_raw not found. Querying pg_policies...');
    const { data: policies, error: pgError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('schemaname', 'public');
      
    if (pgError) {
      // Fallback query via raw sql if possible, or just print pgError
      console.error('Error querying pg_policies:', pgError);
      
      // Let's try select from information_schema or pg_catalog via raw SQL or query pg_policies using an API call if allowed
      // In Supabase, standard tables don't expose pg_catalog via PostgREST unless exposed.
      // So let's run a query using Postgres client or similar if needed.
    } else {
      console.log('Active RLS Policies:');
      console.log(JSON.stringify(policies, null, 2));
    }
  } else {
    console.log('Policies from RPC:', JSON.stringify(data, null, 2));
  }
}

async function runRawQuery() {
  // Let's run a raw SQL query using a Postgres connection if pg_policies select failed
  // Or we can just query pg_policies since supabaseAdmin can query system tables if allowed
  const { data, error } = await supabase.from('project_requests').select('*');
  console.log('Admin client count:', data ? data.length : 0);
  
  // Let's do a raw sql query via supabase pg_catalog
  const { data: pgPolicies, error: err } = await supabase.rpc('run_sql', { 
    sql: "SELECT * FROM pg_policies WHERE tablename = 'project_requests'" 
  });
  if (err) {
    console.log('run_sql RPC failed:', err.message);
  } else {
    console.log('project_requests policies:', pgPolicies);
  }
}

runRawQuery();
