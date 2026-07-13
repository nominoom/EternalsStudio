import { NextResponse } from 'next/server';
import { QuickBooksToken, dbConnect } from '../../../../../lib/db';

const TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
const CLIENT_ID = process.env.QUICKBOOKS_CLIENT_ID || '';
const CLIENT_SECRET = process.env.QUICKBOOKS_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.QUICKBOOKS_REDIRECT_URI || '';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const realmId = searchParams.get('realmId');

  if (!code || !realmId) {
    return NextResponse.json({ error: 'Missing code or realmId in redirect parameter' }, { status: 400 });
  }

  try {
    await dbConnect();
    const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_description || 'Failed to exchange QuickBooks tokens');
    }

    const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();
    const refreshExpiresAt = new Date(Date.now() + data.x_refresh_token_expires_in * 1000).toISOString();

    // Upsert the tokens into MongoDB
    await QuickBooksToken.findOneAndUpdate(
      { customId: 'quickbooks_tokens' },
      {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: new Date(expiresAt),
        refresh_expires_at: new Date(refreshExpiresAt),
        realm_id: realmId,
        updated_at: new Date(),
      },
      { upsert: true, new: true }
    );

    // Return a beautiful success page to the administrator
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QuickBooks Authorization Success</title>
          <style>
            body { font-family: sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #1e293b; padding: 2.5rem; border-radius: 1.5rem; text-align: center; max-width: 400px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); border: 1px solid #334155; }
            h1 { color: #2dd4bf; margin-top: 0; }
            p { font-size: 0.9rem; line-height: 1.6; color: #94a3b8; }
            .close-btn { background: #2dd4bf; color: #0f172a; border: none; padding: 0.75rem 1.5rem; font-weight: bold; border-radius: 0.75rem; cursor: pointer; margin-top: 1.5rem; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Authorization Successful!</h1>
            <p>Eternals Studio has successfully connected with your QuickBooks Sandbox/Production company (Realm ID: ${realmId}). You can now close this tab.</p>
            <button class="close-btn" onclick="window.close()">Close Window</button>
          </div>
        </body>
      </html>
      `,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error: any) {
    console.error('QuickBooks OAuth Callback Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
