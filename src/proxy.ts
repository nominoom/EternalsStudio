import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default function proxy(req: any, event: any) {
  const isPlaceholder = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
                        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder') || 
                        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('empty');
  
  if (isPlaceholder) {
    // Bypass Clerk authentication checks completely if keys are placeholder configurations
    return NextResponse.next();
  }

  return clerkMiddleware(async (auth, request) => {
    if (isAdminRoute(request)) {
      await auth.protect();
    }
  })(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.[\\w]+$|_next/image|favicon.ico).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
