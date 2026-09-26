import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addChatMessage,
  parseNotificationMessage,
  selectChatsState,
} from '@entities/chat';
import { selectIsAuthorized, selectSession } from '@entities/session';
import { receiveNotification, deleteNotification } from '../api/notifications';
import { pollNotifications } from './pollNotifications';

export function useReceiveMessages() {
  const session = useSelector(selectSession);
  const authorized = useSelector(selectIsAuthorized);
  const hasChats = useSelector(
    (state: Parameters<typeof selectChatsState>[0]) =>
      Object.keys(selectChatsState(state)).length > 0,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authorized || !hasChats) return;
    return pollNotifications({
      receive: (signal) => receiveNotification(session, signal),
      remove: (receiptId, signal) =>
        deleteNotification(session, receiptId, signal),
      onBody: (body) => {
        const message = parseNotificationMessage(body);
        if (message)
          dispatch(addChatMessage({ chatId: message.chatId, message }));
      },
    });
  }, [authorized, hasChats, session, dispatch]);
}
