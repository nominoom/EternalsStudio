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

async function checkRequests() {
  console.log('Fetching project requests from Supabase...');
  const { data, error } = await supabase.from('project_requests').select('*');
  if (error) {
    console.error('Error querying project_requests:', error);
  } else {
    console.log(`Found ${data.length} project requests:`);
    console.log(JSON.stringify(data, null, 2));
  }
}

checkRequests();
