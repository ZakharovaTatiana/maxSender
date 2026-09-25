import {
  isValidSessionCredentials,
  type SessionState,
} from '@entities/session';

const SESSION_STORAGE_KEY = 'maxSender.session';

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadPersistedSession(): SessionState | undefined {
  const storage = getStorage();

  if (!storage) {
    return undefined;
  }

  try {
    const serializedSession = storage.getItem(SESSION_STORAGE_KEY);

    if (!serializedSession) {
      return undefined;
    }

    const session: unknown = JSON.parse(serializedSession);

    if (isValidSessionCredentials(session)) {
      return session;
    }

    storage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    try {
      storage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // The app continues with in-memory state when storage is unavailable.
    }
  }

  return undefined;
}

export function persistSession(session: SessionState) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    if (isValidSessionCredentials(session)) {
      storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      return;
    }

    storage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Persistence failure must not block authentication in the current tab.
  }
}
