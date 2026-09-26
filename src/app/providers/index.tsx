import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../store';
import { NotificationReceiver } from './NotificationReceiver';

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <NotificationReceiver />
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        {children}
      </BrowserRouter>
    </Provider>
  );
}
