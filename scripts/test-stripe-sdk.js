const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let secretKey = process.env.STRIPE_SECRET_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^STRIPE_SECRET_KEY\s*=\s*(.*)$/m);
  if (match && match[1]) {
    secretKey = match[1].trim();
  }
}

try {
  const stripe = new Stripe(secretKey || 'sk_test_placeholder_key', {
    apiVersion: '2026-06-24.dahlia',
  });
  console.log('Stripe initialized successfully.');
} catch (err) {
  console.error('Stripe initialization failed:', err.message);
}
