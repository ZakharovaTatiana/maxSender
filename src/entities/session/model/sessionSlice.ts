import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SessionState {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl: string;
}

export function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isValidSessionCredentials(
  value: unknown,
): value is SessionState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const credentials = value as Record<string, unknown>;

  return (
    typeof credentials.idInstance === 'string' &&
    /^\d+$/.test(credentials.idInstance) &&
    typeof credentials.apiTokenInstance === 'string' &&
    credentials.apiTokenInstance.trim().length > 0 &&
    typeof credentials.apiUrl === 'string' &&
    isValidHttpUrl(credentials.apiUrl)
  );
}

const initialState: SessionState = {
  idInstance: '',
  apiTokenInstance: '',
  apiUrl: '',
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCredentials: (state, { payload }: PayloadAction<SessionState>) => {
      state.idInstance = payload.idInstance;
      state.apiTokenInstance = payload.apiTokenInstance;
      state.apiUrl = payload.apiUrl;
    },
    clearCredentials: (state) => {
      state.idInstance = '';
      state.apiTokenInstance = '';
      state.apiUrl = '';
    },
  },
});

export const { setCredentials, clearCredentials } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;

export const selectIsAuthorized = (state: { session: SessionState }) =>
  isValidSessionCredentials(state.session);

export const selectSession = (state: { session: SessionState }) =>
  state.session;
