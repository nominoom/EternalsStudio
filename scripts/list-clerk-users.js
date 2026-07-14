const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let secretKey = process.env.CLERK_SECRET_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^CLERK_SECRET_KEY\s*=\s*(.*)$/m);
  if (match && match[1]) {
    secretKey = match[1].trim();
  }
}

if (!secretKey) {
  console.error('Error: CLERK_SECRET_KEY not found in environment or .env.local');
  process.exit(1);
}

async function listUsers() {
  console.log('Fetching users from Clerk API...');
  try {
    const response = await fetch('https://api.clerk.com/v1/users?limit=100', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to fetch Clerk users:', data.errors || data);
      process.exit(1);
    }

    console.log(`Found ${data.length} users in Clerk:`);
    data.forEach(user => {
      const email = user.email_addresses?.[0]?.email_address;
      console.log(`- ID: ${user.id}, Name: ${user.first_name} ${user.last_name}, Email: ${email}, Role: ${user.public_metadata?.role}`);
    });
  } catch (err) {
    console.error('Error connecting to Clerk API:', err.message);
  }
}

listUsers();
