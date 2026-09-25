import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SessionState {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl: string;
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
  state.session.idInstance.length > 0 &&
  state.session.apiTokenInstance.length > 0 &&
  state.session.apiUrl.length > 0;
