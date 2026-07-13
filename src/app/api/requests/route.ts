import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { logEvent } from '../../../lib/logger';

export async function POST(req: Request): Promise<Response> {
  try {
    const { clientName, clientEmail, clientPhone, subject, description, fileUrl } = await req.json();

    if (!clientName || !clientEmail || !subject || !description) {
      return NextResponse.json({ error: 'Missing required fields: clientName, clientEmail, subject, description' }, { status: 400 }) as unknown as Response;
    }

    // Insert into project_requests table
    const { data: request, error: dbError } = await supabaseAdmin
      .from('project_requests')
      .insert([
        {
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone || '',
          subject,
          description,
          file_url: fileUrl || '',
          status: 'pending',
        }
      ])
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    // Log message reception event
    await logEvent(
      'evt_request_received',
      'contact',
      'success',
      `New project request submitted by ${clientName} (${clientEmail}) - Subject: "${subject}".`,
      { client_name: clientName, email: clientEmail, subject }
    );

    return NextResponse.json({ success: true, request }) as unknown as Response;
  } catch (error: any) {
    console.error('Request Submission API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}
