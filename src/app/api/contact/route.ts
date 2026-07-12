import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '../../../lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key');

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, company, subject, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error: any) {
    console.error('Contact Submission Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
