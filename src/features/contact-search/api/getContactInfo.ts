import type { ContactInfo } from '@entities/chat';
import type { SessionState } from '@entities/session';
import { request } from '@shared/api';

function isContactInfo(value: unknown): value is ContactInfo {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export async function getContactInfo(
  { apiUrl, idInstance, apiTokenInstance }: SessionState,
  chatId: string,
): Promise<ContactInfo> {
  const baseUrl = apiUrl.replace(/\/$/, '');
  const response = await request(
    `${baseUrl}/waInstance${idInstance}/getContactInfo/${apiTokenInstance}`,
    {
      method: 'POST',
      body: { chatId },
    },
  );

  if (!response.ok) {
    throw new Error('Contact info request failed');
  }

  const contactInfo: unknown = await response.json();

  if (!isContactInfo(contactInfo)) {
    throw new Error('Invalid contact info response');
  }

  return contactInfo;
}
