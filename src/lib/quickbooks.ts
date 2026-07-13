import { QuickBooksToken, dbConnect } from './db';

const CLIENT_ID = process.env.QUICKBOOKS_CLIENT_ID || '';
const CLIENT_SECRET = process.env.QUICKBOOKS_CLIENT_SECRET || '';
const QB_ENV = process.env.QUICKBOOKS_ENVIRONMENT || 'sandbox';

const BASE_URL = QB_ENV === 'production'
  ? 'https://quickbooks.api.intuit.com'
  : 'https://sandbox-quickbooks.api.intuit.com';

const TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';

// Get the current active token from MongoDB, refreshing it if expired
export async function getValidQBToken(): Promise<string> {
  await dbConnect();
  const tokenData = await QuickBooksToken.findOne({ customId: 'quickbooks_tokens' });

  if (!tokenData) {
    throw new Error('QuickBooks OAuth token is not configured. Please run authentication first.');
  }

  const { access_token, refresh_token, expires_at } = tokenData;

  // Check if access token is expired (add a 1-minute buffer)
  const isExpired = new Date(Date.now() + 60000) >= new Date(expires_at);

  if (!isExpired) {
    return access_token;
  }

  console.log('QuickBooks Access Token expired. Triggering refresh...');

  // Token is expired, refresh it
  try {
    const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_description || 'Failed to refresh QuickBooks token');
    }

    const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString();
    const refreshExpiresAt = new Date(Date.now() + data.x_refresh_token_expires_in * 1000).toISOString();

    // Save refreshed token to MongoDB
    await QuickBooksToken.updateOne(
      { customId: 'quickbooks_tokens' },
      {
        $set: {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: new Date(expiresAt),
          refresh_expires_at: new Date(refreshExpiresAt),
          updated_at: new Date()
        }
      }
    );

    return data.access_token;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (refreshErr: any) {
    console.error('Error refreshing QuickBooks tokens:', refreshErr.message);
    throw refreshErr;
  }
}

// Perform an API request to QuickBooks
export async function quickbooksRequest(
  endpoint: string,
  options: RequestInit = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  await dbConnect();
  const tokenData = await QuickBooksToken.findOne({ customId: 'quickbooks_tokens' }, { realm_id: 1 });

  if (!tokenData) {
    throw new Error('QuickBooks company Realm ID not found in database.');
  }

  const realmId = tokenData.realm_id;
  const accessToken = await getValidQBToken();

  const url = `${BASE_URL}/v3/company/${realmId}/${endpoint}`;
  
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { rawResponse: text };
  }

  if (!response.ok) {
    const errorDetails = data.Fault?.Error?.[0]?.Message || text;
    throw new Error(`QuickBooks API Error: ${errorDetails}`);
  }

  return data;
}
