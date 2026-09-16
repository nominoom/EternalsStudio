import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { logEvent } from '../../../../lib/logger';

export async function POST(req: Request): Promise<Response> {
  try {
    // 1. Authenticate with Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ) as unknown as Response;
    }

    // 2. Strict Environment & Configuration Guard
    // Only allow mock payment approvals if we're in non-production OR Stripe keys are genuinely unset/placeholder
    const isNonProduction = process.env.NODE_ENV !== 'production';
    const isStripeUnset = 
      !process.env.STRIPE_SECRET_KEY || 
      process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder_key' || 
      process.env.STRIPE_SECRET_KEY.includes('placeholder');

    if (!isNonProduction && !isStripeUnset) {
      return NextResponse.json(
        { error: 'Mock payment verification is disabled in production environments with active Stripe configuration.' },
        { status: 403 }
      ) as unknown as Response;
    }

    // 3. Parse and validate parameters
    const { requestId } = await req.json();
    if (!requestId || typeof requestId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid parameter: requestId' },
        { status: 400 }
      ) as unknown as Response;
    }

    // 4. Retrieve the target project request from database
    const { data: request, error: fetchError } = await supabaseAdmin
      .from('project_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError || !request) {
      return NextResponse.json(
        { error: 'Project request not found' },
        { status: 404 }
      ) as unknown as Response;
    }

    // 5. Verify Ownership / Authorization
    const userEmails = (user.emailAddresses || []).map((e) => e.emailAddress.toLowerCase());
    const clientEmail = (request.client_email || '').toLowerCase();
    const isOwner = 
      userEmails.includes(clientEmail) || 
      (Boolean(request.user_id) && request.user_id === user.id);
    const isAdmin = user.publicMetadata?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Access denied: You do not have permission to verify payment for this request' },
        { status: 403 }
      ) as unknown as Response;
    }

    // 6. Check if already approved to prevent redundant processing
    if (request.status === 'approved' || request.status === 'claimed' || request.status === 'completed') {
      return NextResponse.json({
        success: true,
        alreadyUpdated: true,
        message: 'Project request is already approved.',
      }) as unknown as Response;
    }

    // 7. Perform the status update securely on the server
    const { data: updatedRequest, error: updateError } = await supabaseAdmin
      .from('project_requests')
      .update({ status: 'approved' })
      .eq('id', requestId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // 8. Record audit log
    const actorEmail = userEmails[0] || user.id;
    await logEvent(
      'evt_mock_payment_verified',
      'stripe',
      'warning',
      `Mock payment approved for request "${request.subject || requestId}" by authenticated user ${actorEmail}.`,
      { actor: actorEmail, requestId, previousStatus: request.status }
    );

    return NextResponse.json({
      success: true,
      request: updatedRequest,
      message: 'Mock payment verified successfully.',
    }) as unknown as Response;
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Server error verifying mock payment';
    console.error('Mock Payment Verification Error:', errMessage);
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    ) as unknown as Response;
  }
}
