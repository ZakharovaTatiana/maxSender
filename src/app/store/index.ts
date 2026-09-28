import {
  combineReducers,
  configureStore,
  type UnknownAction,
} from '@reduxjs/toolkit';
import { chatsReducer } from '@entities/chat';
import { clearCredentials, sessionReducer } from '@entities/session';
import { loadPersistedSession, persistSession } from './sessionPersistence';

const persistedSession = loadPersistedSession();
const rootReducer = combineReducers({
  chats: chatsReducer,
  session: sessionReducer,
});

function appReducer(
  state: ReturnType<typeof rootReducer> | undefined,
  action: UnknownAction,
) {
  return rootReducer(
    clearCredentials.match(action) ? undefined : state,
    action,
  );
}

const initialState = rootReducer(undefined, { type: '@@INIT' });

export const store = configureStore({
  reducer: appReducer,
  preloadedState: persistedSession
    ? {
        ...initialState,
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
