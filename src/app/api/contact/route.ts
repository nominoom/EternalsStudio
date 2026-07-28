import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '../../../lib/supabase';
import { logEvent } from '../../../lib/logger';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key');

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const firstName = body.firstName || body.first_name || (body.name || body.client_name ? (body.name || body.client_name).split(' ')[0] : '');
    const lastName = body.lastName || body.last_name || (body.name || body.client_name ? (body.name || body.client_name).split(' ').slice(1).join(' ') || 'Client' : 'Client');
    const email = body.email || body.clientEmail || body.client_email || '';
    const company = body.company || body.organizationName || body.organization_name || '';
    const subject = body.subject || body.title || 'New Inquiry';
    const message = body.message || body.description || body.desc || subject;

    if (!email || !message) {
      return NextResponse.json({ error: 'Missing required fields: email and message (or description)' }, { status: 400 }) as unknown as Response;
    }

    const fullName = `${firstName} ${lastName}`;
    const mailSubject = subject || `New Contact Submission from ${fullName}`;
    const companyStr = company ? ` (Company: ${company})` : '';

    // 1. Insert message into Supabase contact_messages table
    const { data: dbData, error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name: fullName,
        email: email,
        subject: mailSubject,
        message: message,
        status: 'unread',
      });

    if (dbError) {
      console.warn('Database insert failed, proceeding to send email:', dbError.message);
    }

    // 2. Send email notification using Resend API
    try {
      const emailResponse = await resend.emails.send({
        from: 'Eternals Studio <onboarding@resend.dev>', // Resend sandbox default address
        to: process.env.ADMIN_EMAIL || 'admin@eternals.gg',
        subject: mailSubject,
        html: `
          <h3>New Message from Eternals Studio Contact Form</h3>
          <p><strong>Name:</strong> ${fullName}${companyStr}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${mailSubject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });

      if (emailResponse.error) {
        console.warn('Resend mail delivery error:', emailResponse.error.message);
      }
    } catch (mailErr: any) {
      console.warn('Email transmission failed:', mailErr.message);
    }

    // Log the successful contact submission event
    await logEvent(
      'evt_contact_message_received',
      'contact',
      'success',
      `Contact message received from ${fullName} <${email}>.`,
      { name: fullName, email, subject: mailSubject, company: company || 'N/A' }
    );

    return NextResponse.json({ success: true, message: 'Message sent successfully' }) as unknown as Response;
  } catch (error: any) {
    console.error('Contact Submission Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}


