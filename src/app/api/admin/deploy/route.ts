import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { logEvent } from '@/lib/logger';

export async function POST(req: Request): Promise<Response> {
  try {
    // 1. Authenticate and validate administrator privileges
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const user = auth.user;

    // 3. Parse step from payload
    const { step } = await req.json();
    if (!step || !['initiated', 'building', 'success', 'failed'].includes(step)) {
      return NextResponse.json({ error: 'Invalid or missing step payload' }, { status: 400 }) as unknown as Response;
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

    return NextResponse.json({ success: true, event: eventLog }) as unknown as Response;
  } catch (error: any) {
    console.error('Deployment API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}

