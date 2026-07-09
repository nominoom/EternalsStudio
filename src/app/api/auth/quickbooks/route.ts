import { NextResponse } from 'next/server';

const AUTH_URL = 'https://appcenter.intuit.com/connect/oauth2';
const CLIENT_ID = process.env.QUICKBOOKS_CLIENT_ID || '';
const REDIRECT_URI = process.env.QUICKBOOKS_REDIRECT_URI || '';

export async function GET(req: Request) {
  if (!CLIENT_ID || !REDIRECT_URI) {
    return NextResponse.json(
      { error: 'Missing client credentials or redirect URI in environment variables' },
      { status: 500 }
    );
  }

  // Request both Accounting (to create invoices/customers) and Payments scopes
  const scopes = 'com.intuit.quickbooks.accounting com.intuit.quickbooks.payment';
  const state = 'secure-csrf-state-token'; // In production, generate dynamically

  const redirectUrl = `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;

  return NextResponse.redirect(redirectUrl);
}
