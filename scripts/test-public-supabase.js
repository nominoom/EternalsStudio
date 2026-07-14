const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envContent.match(/^NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)$/m);
  const keyMatch = envContent.match(/^NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)$/m);
  if (urlMatch && urlMatch[1]) supabaseUrl = urlMatch[1].trim();
  if (keyMatch && keyMatch[1]) anonKey = keyMatch[1].trim();
}

if (!supabaseUrl || !anonKey) {
  console.error('Error: Supabase environment variables not found.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, anonKey);

async function testFetch() {
  console.log('Fetching using public/anon client...');
  const { data, error } = await supabase
    .from('project_requests')
    .select('*')
    .eq('client_email', 'mr.spook.b@gmail.com');
    
  if (error) {
    console.error('Fetch error:', error);
  } else {
    console.log(`Successfully fetched ${data.length} records:`);
    console.log(JSON.stringify(data, null, 2));
  }
}

testFetch();
