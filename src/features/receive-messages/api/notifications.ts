import type { SessionState } from '@entities/session';
import { request } from '@shared/api';

function notificationUrl(
  { apiUrl, idInstance, apiTokenInstance }: SessionState,
  method: string,
) {
  return `${apiUrl.replace(/\/$/, '')}/waInstance${idInstance}/${method}/${apiTokenInstance}`;
}

export async function receiveNotification(
  session: SessionState,
  signal: AbortSignal,
): Promise<unknown> {
  const response = await request(
    notificationUrl(session, 'receiveNotification'),
    { signal },
  );
  if (!response.ok) throw new Error('Notification request failed');
  const text = await response.text();
  return text.trim() ? JSON.parse(text) : null;
}

export async function deleteNotification(
  session: SessionState,
  receiptId: number,
  signal: AbortSignal,
): Promise<boolean> {
  const response = await request(
    `${notificationUrl(session, 'deleteNotification')}/${receiptId}`,
    { method: 'DELETE', signal },
  );
  if (!response.ok) throw new Error('Notification deletion failed');
  const body: unknown = await response.json();
  return (
    !!body &&
    typeof body === 'object' &&
    'result' in body &&
    body.result === true
  );
}
