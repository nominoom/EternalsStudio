import { currentUser, type User } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; response: NextResponse<{ error: string }> };

/**
 * Requires an authenticated user session via Clerk.
 * Returns { ok: true, user } if signed in, or { ok: false, response: 401 } if not.
 */
export async function requireUser(): Promise<AuthResult> {
  const user = await currentUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  return { ok: true, user };
}

/**
 * Requires an authenticated user session with administrator role (publicMetadata.role === 'admin').
 * Returns { ok: true, user } if authorized, or { ok: false, response: 401 | 403 } if not.
 */
export async function requireAdmin(): Promise<AuthResult> {
  const auth = await requireUser();
  if (!auth.ok) {
    return auth;
  }

  const isAdmin = auth.user.publicMetadata?.role === 'admin';
  if (!isAdmin) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Access denied: Administrator privileges required' },
        { status: 403 }
      ),
    };
  }

  return { ok: true, user: auth.user };
}
