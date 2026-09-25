export interface RequestConfig extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export function request(url: string, config: RequestConfig = {}) {
  const { body, headers: initialHeaders, ...requestConfig } = config;
  const headers = new Headers(initialHeaders);

  if (body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, {
    ...requestConfig,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
