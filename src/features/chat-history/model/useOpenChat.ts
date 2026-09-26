import { useCallback } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import {
  activateChat,
  failChatHistoryLoading,
  setChatMessages,
  startChatHistoryLoading,
  type ChatsState,
} from '@entities/chat';
import { selectSession } from '@entities/session';
import { getChatHistory } from '../api/getChatHistory';

export function useOpenChat() {
  const dispatch = useDispatch();
  const store = useStore<{ chats: ChatsState }>();
  const credentials = useSelector(selectSession);

  return useCallback(
    (chatId: string) => {
      dispatch(activateChat(chatId));

      const chat = store.getState().chats[chatId];

      if (!chat || chat.historyStatus !== 'idle') {
        return;
      }

      dispatch(startChatHistoryLoading(chatId));

      void getChatHistory(credentials, chatId)
        .then((messages) => {
          dispatch(setChatMessages({ chatId, messages }));
        })
        .catch(() => {
          dispatch(failChatHistoryLoading(chatId));
        });
    },
    [credentials, dispatch, store],
  );
}
