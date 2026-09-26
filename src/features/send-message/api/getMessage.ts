import { parseChatMessage, type ChatMessage } from '@entities/chat';
import type { SessionState } from '@entities/session';
import { request } from '@shared/api';

export async function getMessage(
  { apiUrl, idInstance, apiTokenInstance }: SessionState,
  chatId: string,
  idMessage: string,
): Promise<ChatMessage> {
  const baseUrl = apiUrl.replace(/\/$/, '');
  const response = await request(
    `${baseUrl}/waInstance${idInstance}/getMessage/${apiTokenInstance}`,
    {
      method: 'POST',
      body: { chatId, idMessage },
    },
  );

  if (!response.ok) {
    throw new Error('Message request failed');
  }

  const message = parseChatMessage(await response.json());

  if (!message) {
    throw new Error('Invalid message response');
  }

  return message;
}
