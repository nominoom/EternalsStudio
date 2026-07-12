import { supabaseAdmin } from './supabase';

export type EventCategory = 'deployment' | 'stripe' | 'quickbooks' | 'database' | 'auth' | 'contact';
export type EventStatus = 'info' | 'success' | 'warning' | 'error';

export interface SystemEvent {
  id?: string;
  event_key: string;
  category: EventCategory;
  status: EventStatus;
  message: string;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
}

/**
 * Logs a system event. Attempts to write to the Supabase `system_events` table.
 * If that fails (e.g. database offline, table not created), it falls back to console.log/console.error.
 */
export async function logEvent(
  eventKey: string,
  category: EventCategory,
  status: EventStatus,
  message: string,
  metadata: Record<string, unknown> = {}
): Promise<SystemEvent> {
  const eventData: SystemEvent = {
    event_key: eventKey,
    category,
    status,
    message,
    metadata,
  };

  try {
    const { data, error } = await supabaseAdmin
      .from('system_events')
      .insert(eventData)
      .select()
      .single();

    if (error) {
      console.warn(`[Supabase Log Failed] Falling back to console: ${error.message}`);
      fallbackLog(category, status, eventKey, message, metadata);
      return { ...eventData, created_at: new Date().toISOString() };
    }

    return data;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[Supabase Log Error] Falling back to console: ${errMsg}`);
    fallbackLog(category, status, eventKey, message, metadata);
    return { ...eventData, created_at: new Date().toISOString() };
  }
}

function fallbackLog(
  category: EventCategory,
  status: EventStatus,
  eventKey: string,
  message: string,
  metadata: Record<string, unknown>
) {

  const formattedMsg = `[EVENT][${category.toUpperCase()}][${status.toUpperCase()}] ${eventKey} - ${message}`;
  if (status === 'error') {
    console.error(formattedMsg, JSON.stringify(metadata));
  } else if (status === 'warning') {
    console.warn(formattedMsg, JSON.stringify(metadata));
  } else {
    console.log(formattedMsg, JSON.stringify(metadata));
  }
}
