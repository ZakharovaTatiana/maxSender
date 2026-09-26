import type { SessionState } from '@entities/session';
import { request } from '@shared/api';

export interface CheckAccountResult {
  exist: true;
  chatId: string;
}

function parseCheckAccountResult(value: unknown): CheckAccountResult | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const result = value as Record<string, unknown>;
  const chatId = result.chatId;
  const isNumericChatId =
    (typeof chatId === 'string' && /^\d+$/.test(chatId)) ||
    (typeof chatId === 'number' &&
      Number.isFinite(chatId) &&
      Number.isInteger(chatId) &&
      chatId >= 0);

  if (result.exist !== true || !isNumericChatId) {
    return null;
  }

  return {
    exist: true,
    chatId: String(chatId),
  };
}

export async function checkAccount(
  { apiUrl, idInstance, apiTokenInstance }: SessionState,
  phoneNumber: string,
): Promise<CheckAccountResult> {
  const baseUrl = apiUrl.replace(/\/$/, '');

  const response = await request(
    `${baseUrl}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`,
    {
      method: 'POST',
      body: { phoneNumber },
    },
  );

  if (!response.ok) {
    throw new Error('Account check failed');
  }

  const result = parseCheckAccountResult(await response.json());

  if (!result) {
    throw new Error('Account was not found');
  }

  return result;
}
