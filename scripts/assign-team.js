const fs = require('fs');
const path = require('path');

// 1. Read .env.local to find the Clerk Secret Key
const envPath = path.join(__dirname, '..', '.env.local');
let secretKey = process.env.CLERK_SECRET_KEY;

if (!secretKey && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^CLERK_SECRET_KEY\s*=\s*(.*)$/m);
  if (match && match[1]) {
    secretKey = match[1].trim();
  }
}

const userId = process.argv[2];

if (!userId) {
  console.error('\nUsage: node scripts/assign-team.js <clerk_user_id>\n');
  process.exit(1);
}

if (!secretKey) {
  console.error('\nError: CLERK_SECRET_KEY not found in environment or .env.local\n');
  process.exit(1);
}

async function assignTeam() {
  console.log(`Assigning "team" role to user ${userId}...`);
  
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        public_metadata: {
          role: 'team'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('\nFailed to update metadata on Clerk:', data.errors || data);
      process.exit(1);
    }

    console.log('\nSuccess! User public metadata updated:');
    console.log(JSON.stringify(data.public_metadata, null, 2));
    console.log('\nThis user can now access the team portal.\n');
  } catch (err) {
    console.error('\nNetwork error connecting to Clerk API:', err.message);
    process.exit(1);
  }
}

assignTeam();
