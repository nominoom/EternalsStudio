import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactMessage, dbConnect } from '../../../lib/db';
import { logEvent } from '../../../lib/logger';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key');

export async function POST(req: Request): Promise<Response> {
  try {
    const { firstName, lastName, email, company, subject, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 }) as unknown as Response;
    }

    const fullName = `${firstName} ${lastName}`;
    const mailSubject = subject || `New Contact Submission from ${fullName}`;
    const companyStr = company ? ` (Company: ${company})` : '';

    await dbConnect();

    // 1. Insert message into MongoDB contactmessages collection
    try {
      await ContactMessage.create({
        name: fullName,
        email: email,
        subject: mailSubject,
        message: message,
        status: 'unread',
      });
    } catch (dbError: any) {
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


