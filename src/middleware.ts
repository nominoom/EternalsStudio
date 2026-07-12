import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default async function middleware(req: NextRequest, event: NextFetchEvent): Promise<Response> {
  try {
    const isPlaceholder = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
                          process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder') || 
                          process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('empty');
    
    if (isPlaceholder) {
      return NextResponse.next();
    }

    const clerkHandler = clerkMiddleware(async (auth, request) => {
      if (isAdminRoute(request)) {
        await auth.protect();
      }
    });

    const response = await clerkHandler(req, event);
    return response || NextResponse.next();
  } catch (err: any) {
    console.error('Clerk Middleware Error, bypassing to prevent crash:', err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.[\\w]+$|_next/image|favicon.ico).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
