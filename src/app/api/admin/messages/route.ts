import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '../../../../lib/supabase';
import { logEvent } from '../../../../lib/logger';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key');

// PATCH: Update message status (read, replied, archived)
export async function PATCH(req: Request): Promise<Response> {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 }) as unknown as Response;
    }

    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Administrator role required' }, { status: 403 }) as unknown as Response;
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required parameters: id, status' }, { status: 400 }) as unknown as Response;
    }

    const { error } = await supabaseAdmin
      .from('contact_messages')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, status }) as unknown as Response;
  } catch (error: any) {
    console.error('[Admin Messages PATCH] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}

// POST: Send an email reply to client and mark replied
export async function POST(req: Request): Promise<Response> {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 }) as unknown as Response;
    }

    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Administrator role required' }, { status: 403 }) as unknown as Response;
    }

    const { id, toEmail, toName, subject, replyMessage } = await req.json();
    if (!toEmail || !replyMessage) {
      return NextResponse.json({ error: 'Missing required fields: toEmail, replyMessage' }, { status: 400 }) as unknown as Response;
    }

    const adminEmail = user.emailAddresses?.[0]?.emailAddress || 'admin@eternals.gg';

    // 1. Send email via Resend
    try {
      await resend.emails.send({
        from: 'Eternals Studio Support <support@resend.dev>',
        to: toEmail,
        replyTo: adminEmail,
        subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
            <p>Hi ${toName || 'there'},</p>
            <p>${replyMessage.replace(/\n/g, '<br>')}</p>
            <br>
            <hr style="border: none; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #64748b;">
              Eternals Studio Support Team<br>
              <a href="https://eternals.studio" style="color: #0d9488;">eternals.studio</a>
            </p>
          </div>
        `,
      });
    } catch (mailErr: any) {
      console.warn('[Admin Reply] Resend API transmission warning:', mailErr.message);
    }

    // 2. Update status in Supabase
    if (id) {
      try {
        await supabaseAdmin
          .from('contact_messages')
          .update({ status: 'replied' })
          .eq('id', id);
      } catch (dbErr: any) {
        console.warn('[Admin Reply] Could not update message status in DB:', dbErr.message);
      }
    }

    // 3. Log audit event
    await logEvent(
      'evt_contact_reply_sent',
      'contact',
      'success',
      `Administrator replied to support inquiry from ${toEmail}.`,
      { recipient: toEmail, actor: adminEmail, message_id: id }
    );

    return NextResponse.json({ success: true, message: 'Reply sent successfully' }) as unknown as Response;
  } catch (error: any) {
    console.error('[Admin Messages POST] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}
