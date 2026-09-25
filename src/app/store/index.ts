import { configureStore } from '@reduxjs/toolkit';
import { sessionReducer } from '@entities/session';
import { loadPersistedSession, persistSession } from './sessionPersistence';

const persistedSession = loadPersistedSession();

export const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
  preloadedState: persistedSession
    ? {
        session: persistedSession,
      }
    : undefined,
});

let previousSession = store.getState().session;

store.subscribe(() => {
  const session = store.getState().session;

  if (session === previousSession) {
    return;
  }

  previousSession = session;
  persistSession(session);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
