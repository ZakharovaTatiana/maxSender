import { configureStore } from '@reduxjs/toolkit';

// Замените корневой reducer на карту reducers по мере появления сущностей и фич.
const initialState = {};
export const store = configureStore({
  reducer: (state = initialState) => state,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
