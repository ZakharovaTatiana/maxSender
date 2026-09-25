import type { SessionState } from '@entities/session';
import { request } from '@shared/api';

export function checkAccount(
  { apiUrl, idInstance, apiTokenInstance }: SessionState,
  phoneNumber: string,
) {
  const baseUrl = apiUrl.replace(/\/$/, '');

  return request(
    `${baseUrl}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`,
    {
      method: 'POST',
      body: { phoneNumber },
    },
  );
}
