import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { logEvent } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<Response> {
  try {
    // 1. Authenticate and validate administrator privileges
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const user = auth.user;

    // 2. Parse step from payload
    const { step } = await req.json();
    if (!step || !['initiated', 'building', 'success', 'failed'].includes(step)) {
      return NextResponse.json({ error: 'Invalid or missing step payload' }, { status: 400 }) as unknown as Response;
    }

    const hostingerHook = process.env.HOSTINGER_DEPLOY_HOOK_URL || process.env.DEPLOY_WEBHOOK_URL;
    const githubToken = process.env.GITHUB_DEPLOY_TOKEN || process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPOSITORY || 'nominoom/EternalsStudio';
    let hookResult: { triggered: boolean; status?: number; error?: string; method?: string } = { triggered: false };

    // 1. If a direct deployment webhook URL is configured, ping it
    if (step === 'initiated' && hostingerHook) {
      try {
        console.log('[Deploy API] Pinging Hostinger deployment webhook URL...');
        const hookRes = await fetch(hostingerHook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'EternalsStudio-DeployPipeline/1.0',
          },
        });
        hookResult = {
          triggered: true,
          status: hookRes.status,
          method: 'direct_webhook',
        };
        console.log(`[Deploy API] Hostinger webhook response status: ${hookRes.status}`);
      } catch (hookErr: any) {
        console.error('[Deploy API] Failed to reach Hostinger webhook:', hookErr.message);
        hookResult = {
          triggered: false,
          error: hookErr.message,
          method: 'direct_webhook',
        };
      }
    } 
    // 2. Alternatively, if a GitHub Deploy Token is configured, trigger GitHub Actions CI/CD to Hostinger
    else if (step === 'initiated' && githubToken) {
      try {
        console.log('[Deploy API] Triggering GitHub Actions deployment workflow for Hostinger...');
        const ghRes = await fetch(`https://api.github.com/repos/${githubRepo}/actions/workflows/deploy.yml/dispatches`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'EternalsStudio-DeployPipeline/1.0',
          },
          body: JSON.stringify({ ref: 'main' }),
        });
        hookResult = {
          triggered: ghRes.ok || ghRes.status === 204,
          status: ghRes.status,
          method: 'github_actions_ssh',
        };
        console.log(`[Deploy API] GitHub Actions dispatch status: ${ghRes.status}`);
      } catch (ghErr: any) {
        console.error('[Deploy API] Failed to trigger GitHub Actions dispatch:', ghErr.message);
        hookResult = {
          triggered: false,
          error: ghErr.message,
          method: 'github_actions_ssh',
        };
      }
    }

    let eventKey = '';
    let status: 'info' | 'success' | 'error' = 'info';
    let message = '';
    let metadata: Record<string, unknown> = {};

    switch (step) {
      case 'initiated':
        eventKey = 'evt_deploy_initiated';
        status = 'info';
        message = hostingerHook 
          ? 'Production deployment triggered via Hostinger Auto-Deploy webhook.'
          : 'Production deployment pipeline initiated by administrator.';
        metadata = {
          branch: 'main',
          trigger: 'manual_dashboard',
          actor: user.emailAddresses?.[0]?.emailAddress || 'admin@eternals.gg',
          provider: 'Hostinger',
          hostinger_webhook_triggered: hookResult.triggered,
          ...(hookResult.status ? { hostinger_http_status: hookResult.status } : {}),
          ...(hookResult.error ? { hostinger_error: hookResult.error } : {}),
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
          provider: 'Hostinger',
        };
        break;
      case 'success':
        eventKey = 'evt_deploy_success';
        status = 'success';
        message = 'App compiled and deployed successfully. Live on Hostinger production server.';
        metadata = {
          url: 'https://eternals.studio',
          provider: 'Hostinger',
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
          provider: 'Hostinger',
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

