import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { quickbooksRequest } from '../../../../lib/quickbooks';
import { supabaseAdmin } from '../../../../lib/supabase';
import { logEvent } from '../../../../lib/logger';

const WEBHOOK_VERIFIER = process.env.QUICKBOOKS_WEBHOOK_VERIFIER || '';

export async function POST(req: Request): Promise<Response> {
  const body = await req.text();
  const signature = req.headers.get('intuit-signature') || '';

  // Validate Intuit webhook signature if verifier is configured
  if (WEBHOOK_VERIFIER && signature) {
    const hash = crypto
      .createHmac('sha256', WEBHOOK_VERIFIER)
      .update(body)
      .digest('base64');

    if (hash !== signature) {
      console.warn('QuickBooks Webhook Signature verification failed.');
      await logEvent(
        'evt_qb_webhook_error',
        'quickbooks',
        'warning',
        `QuickBooks webhook signature verification failed.`,
        { signature }
      );
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 }) as unknown as Response;
    }
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 }) as unknown as Response;
  }

  const notifications = payload.eventNotifications || [];

  if (notifications.length > 0) {
    await logEvent(
      'evt_qb_webhook_recv',
      'quickbooks',
      'info',
      `QuickBooks webhook notifications received (notifications: ${notifications.length}).`,
      { payload_snippet: notifications.map((n: any) => n.realmId) }
    );
  }

  for (const notification of notifications) {
    const entities = notification.dataChangeEvent?.entities || [];

    for (const entity of entities) {
      const entityId = entity.id;
      const entityName = entity.name; // 'Invoice', 'Payment'
      const operation = entity.operation; // 'Update', 'Create'

      console.log(`Processing QuickBooks webhook event: ${entityName} - ${operation} for ID: ${entityId}`);

      try {
        if (entityName === 'Invoice') {
          // 1. Fetch invoice details from QuickBooks
          const invoiceRes = await quickbooksRequest(`invoice/${entityId}`);
          const invoice = invoiceRes.Invoice;
          
          const balance = Number(invoice.Balance);
          const totalAmt = Number(invoice.TotalAmt);

          // If balance is 0 and total is positive, invoice is fully paid
          if (balance === 0 && totalAmt > 0) {
            const { error: dbError } = await supabaseAdmin
              .from('orders')
              .update({ status: 'completed' })
              .eq('stripe_session_id', entityId);

            if (dbError) throw dbError;
            console.log(`Order status updated to completed for invoice ID ${entityId}`);
            
            await logEvent(
              'evt_qb_invoice_paid',
              'quickbooks',
              'success',
              `QuickBooks Invoice ${entityId} balance is $0.00. Supabase order completed.`,
              { invoice_id: entityId, balance, totalAmt }
            );
          }
        } 
        else if (entityName === 'Payment') {
          // 2. Fetch payment details from QuickBooks
          const paymentRes = await quickbooksRequest(`payment/${entityId}`);
          const payment = paymentRes.Payment;
          
          // Get the linked transaction (invoice) ID
          const linkedTxnId = payment.Line?.[0]?.LinkedTxn?.[0]?.TxnId || payment.Line?.[0]?.TxnId;

          if (linkedTxnId) {
            const { error: dbError } = await supabaseAdmin
              .from('orders')
              .update({ status: 'completed' })
              .eq('stripe_session_id', linkedTxnId);

            if (dbError) throw dbError;
            console.log(`Order status updated to completed for linked invoice ID ${linkedTxnId} via Payment webhook`);
            
            await logEvent(
              'evt_qb_payment_success',
              'quickbooks',
              'success',
              `QuickBooks Payment ${entityId} allocated. Supabase order completed for invoice ID ${linkedTxnId}.`,
              { payment_id: entityId, invoice_id: linkedTxnId }
            );
          }
        }
      } catch (err: any) {
        console.error(`Error processing QuickBooks webhook entity ID ${entityId}:`, err.message);
        await logEvent(
          'evt_qb_webhook_error',
          'quickbooks',
          'error',
          `Failed to process QuickBooks webhook event for entity ${entityName} (${entityId}): ${err.message}`,
          { error: err.message, entity_id: entityId, entity_name: entityName, operation }
        );
      }
    }
  }

  return NextResponse.json({ received: true }) as unknown as Response;
}


