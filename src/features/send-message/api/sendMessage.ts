import type { SessionState } from '@entities/session';
import { request } from '@shared/api';

export async function sendMessage(
  { apiUrl, idInstance, apiTokenInstance }: SessionState,
  chatId: string,
  message: string,
): Promise<string> {
  const baseUrl = apiUrl.replace(/\/$/, '');
  const response = await request(
    `${baseUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
    {
      method: 'POST',
      body: { chatId, message },
    },
  );

  if (!response.ok) {
    throw new Error('Message sending failed');
  }

  const result: unknown = await response.json();

  if (
    !result ||
    typeof result !== 'object' ||
    !('idMessage' in result) ||
    typeof result.idMessage !== 'string' ||
    result.idMessage.length === 0
  ) {
    throw new Error('Invalid message sending response');
  }

  return result.idMessage;
}
