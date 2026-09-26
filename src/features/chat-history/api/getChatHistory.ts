import { parseChatMessage, type ChatMessage } from '@entities/chat';
import type { SessionState } from '@entities/session';
import { request } from '@shared/api';

export async function getChatHistory(
  { apiUrl, idInstance, apiTokenInstance }: SessionState,
  chatId: string,
  count?: number,
): Promise<ChatMessage[]> {
  const baseUrl = apiUrl.replace(/\/$/, '');
  const response = await request(
    `${baseUrl}/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`,
    {
      method: 'POST',
      body: count === undefined ? { chatId } : { chatId, count },
    },
  );

  if (!response.ok) {
    throw new Error('Chat history request failed');
  }

  const history: unknown = await response.json();

  if (!Array.isArray(history)) {
    throw new Error('Invalid chat history response');
  }

  return history
    .map(parseChatMessage)
    .filter((message): message is ChatMessage => message !== null)
    .sort((left, right) => left.timestamp - right.timestamp);
}
