import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { logEvent } from '../../../lib/logger';

export async function POST(req: Request): Promise<Response> {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 }) as unknown as Response;
    }

    const { requestId, orderId, fileName, fileData, fileSize, fileType } = await req.json();

    if (!fileName || !fileData) {
      return NextResponse.json({ error: 'Missing required file data' }, { status: 400 }) as unknown as Response;
    }

    const userEmail = user.emailAddresses[0]?.emailAddress || '';
    const userName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : userEmail;

    // Construct file attachment metadata object
    const newAttachment = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: fileName,
      url: fileData, // Data URL or storage link
      size: fileSize || 0,
      type: fileType || 'application/octet-stream',
      uploaded_at: new Date().toISOString(),
      uploaded_by_email: userEmail,
      uploaded_by_name: userName,
    };

    let updatedRecord = null;

    if (requestId) {
      // 1. Fetch current attachments from Supabase project_requests
      let currentAttachments: any[] = [];
      try {
        const { data, error } = await supabaseAdmin
          .from('project_requests')
          .select('attachments')
          .eq('id', requestId)
          .single();

        if (!error && data && Array.isArray(data.attachments)) {
          currentAttachments = data.attachments;
        }
      } catch (err: any) {
        console.warn('[Upload API] Could not fetch current DB attachments:', err.message);
      }

      const updatedAttachments = [newAttachment, ...currentAttachments];

      try {
        const { data, error: updateErr } = await supabaseAdmin
          .from('project_requests')
          .update({ attachments: updatedAttachments })
          .eq('id', requestId)
          .select()
          .single();

        if (updateErr) throw updateErr;
        updatedRecord = data;
      } catch (dbErr: any) {
        console.warn('[Upload API] DB update failed, returning attachment object for client storage fallback:', dbErr.message);
      }
    }

    // Log upload event
    await logEvent(
      'evt_file_uploaded',
      'client',
      'success',
      `File "${fileName}" uploaded by ${userName} for item ${requestId || orderId || 'general'}.`,
      { fileName, requestId, orderId, userEmail }
    );

    return NextResponse.json({
      success: true,
      attachment: newAttachment,
      record: updatedRecord,
    }) as unknown as Response;
  } catch (error: any) {
    console.error('File Upload API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}
