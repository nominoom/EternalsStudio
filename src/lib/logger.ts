import { SystemEvent, dbConnect } from './db';

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
 * Logs a system event. Attempts to write to the MongoDB `systemevents` collection.
 * If that fails (e.g. database offline), it falls back to console.log/console.error.
 */
export async function logEvent(
  eventKey: string,
  category: EventCategory,
  status: EventStatus,
  message: string,
  metadata: Record<string, unknown> = {}
): Promise<SystemEvent> {
  const eventData = {
    event_key: eventKey,
    category,
    status,
    message,
    metadata,
  };

  try {
    await dbConnect();
    const doc = await SystemEvent.create(eventData);
    
    return {
      id: doc._id.toString(),
      event_key: doc.event_key,
      category: doc.category as EventCategory,
      status: doc.status as EventStatus,
      message: doc.message,
      metadata: doc.metadata,
      created_at: doc.created_at.toISOString(),
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[MongoDB Log Error] Falling back to console: ${errMsg}`);
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
