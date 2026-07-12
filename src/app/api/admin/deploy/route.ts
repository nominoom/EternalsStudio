import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { logEvent } from '../../../../lib/logger';

export async function POST(req: Request) {
  try {
    // 1. Authenticate with Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // 2. Validate administrator privileges
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Access denied: Administrator privileges required' }, { status: 403 });
    }

    // 3. Parse step from payload
    const { step } = await req.json();
    if (!step || !['initiated', 'building', 'success', 'failed'].includes(step)) {
      return NextResponse.json({ error: 'Invalid or missing step payload' }, { status: 400 });
    }

    let eventKey = '';
    let status: 'info' | 'success' | 'error' = 'info';
    let message = '';
    let metadata = {};

    switch (step) {
      case 'initiated':
        eventKey = 'evt_deploy_initiated';
        status = 'info';
        message = 'Production deployment pipeline started by administrator.';
        metadata = {
          branch: 'main',
          trigger: 'manual_dashboard',
          actor: user.emailAddresses?.[0]?.emailAddress || 'admin@eternals.gg',
        };
        break;
      case 'building':
        eventKey = 'evt_deploy_building';
        status = 'info';
        message = 'Deployment compilation in progress. Compiling Next.js routes and bundles.';
        metadata = {
          environment: 'production',
          build_target: 'esnext',
          turbopack: true,
        };
        break;
      case 'success':
        eventKey = 'evt_deploy_success';
        status = 'success';
        message = 'App compiled and deployed successfully. Live on CDN edge networks.';
        metadata = {
          url: 'https://eternals.studio',
          provider: 'Vercel',
          duration_seconds: 4.8,
        };
        break;
      case 'failed':
        eventKey = 'evt_deploy_failed';
        status = 'error';
        message = 'Deployment execution aborted due to build errors.';
        metadata = {
          exit_code: 1,
          reason: 'Next.js bundle size constraints exceeded.',
        };
        break;
    }

    // 4. Log the event to Supabase/Console
    const eventLog = await logEvent(eventKey, 'deployment', status, message, metadata);

    return NextResponse.json({ success: true, event: eventLog });
  } catch (error: any) {
    console.error('Deployment API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
