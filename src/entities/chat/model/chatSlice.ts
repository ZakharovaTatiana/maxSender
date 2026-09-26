import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ContactInfo extends Record<string, unknown> {
  avatar?: string;
  name?: string;
  contactName?: string;
  chatId?: string;
  chatType?: string;
  lastSeen?: string | number | null;
  phoneNumber?: number;
  phoneNumberTimestamp?: number;
}

export interface ChatMessage {
  type: 'incoming' | 'outgoing';
  idMessage: string;
  timestamp: number;
  typeMessage: 'textMessage' | 'extendedTextMessage';
  chatId: string;
  chatType: string;
  textMessage: string;
  extendedTextMessage?: {
    text: string;
    description?: string;
    title?: string;
    isForwarded?: boolean;
    forwardingScore?: number;
  };
  statusMessage?: string;
  sendByApi?: boolean;
  senderId?: string;
  senderName?: string;
  senderType?: string;
  senderContactName?: string;
  isForwarded?: boolean;
  forwardingScore?: number;
  isEdited?: boolean;
  isDeleted?: boolean;
}

export type ChatHistoryStatus = 'idle' | 'loading' | 'loaded' | 'failed';

export interface Chat {
  chatId: string;
  order: number;
  contactInfo?: ContactInfo;
  isActive?: boolean;
  messages: ChatMessage[];
  historyStatus: ChatHistoryStatus;
}

export type ChatsState = Record<string, Chat>;

const initialState: ChatsState = {};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addChat: (state, { payload: chatId }: PayloadAction<string>) => {
      if (state[chatId]) {
        return;
      }

      const maxOrder = Object.values(state).reduce(
        (maximum, chat) => Math.max(maximum, chat.order),
        0,
      );

      state[chatId] = {
        chatId,
        order: maxOrder + 1,
        messages: [],
        historyStatus: 'idle',
      };
    },
    setChatContactInfo: (
      state,
      {
        payload: { chatId, contactInfo },
      }: PayloadAction<{ chatId: string; contactInfo: ContactInfo }>,
    ) => {
      const chat = state[chatId];

      if (chat) {
        chat.contactInfo = contactInfo;
      }
    },
    activateChat: (state, { payload: chatId }: PayloadAction<string>) => {
      Object.values(state).forEach((chat) => {
        chat.isActive = chat.chatId === chatId;
      });
    },
    deactivateChat: (state) => {
      Object.values(state).forEach((chat) => {
        chat.isActive = false;
      });
    },
    startChatHistoryLoading: (
      state,
      { payload: chatId }: PayloadAction<string>,
    ) => {
      const chat = state[chatId];

      if (chat?.historyStatus === 'idle') {
        chat.historyStatus = 'loading';
      }
    },
    setChatMessages: (
      state,
      {
        payload: { chatId, messages },
      }: PayloadAction<{ chatId: string; messages: ChatMessage[] }>,
    ) => {
      const chat = state[chatId];

      if (chat) {
        chat.messages = messages;
        chat.historyStatus = 'loaded';
      }
    },
    addChatMessage: (
      state,
      {
        payload: { chatId, message },
      }: PayloadAction<{ chatId: string; message: ChatMessage }>,
    ) => {
      const chat = state[chatId];

      if (
        !chat ||
        chat.messages.some(({ idMessage }) => idMessage === message.idMessage)
      ) {
        return;
      }

      chat.messages.push(message);
      chat.messages.sort((left, right) => left.timestamp - right.timestamp);
    },
    failChatHistoryLoading: (
      state,
      { payload: chatId }: PayloadAction<string>,
    ) => {
      const chat = state[chatId];

      if (chat) {
        chat.historyStatus = 'failed';
      }
    },
  },
});

export const {
  activateChat,
  addChatMessage,
  addChat,
  deactivateChat,
  failChatHistoryLoading,
  setChatContactInfo,
  setChatMessages,
  startChatHistoryLoading,
} = chatsSlice.actions;
export const chatsReducer = chatsSlice.reducer;

export const selectChatsState = (state: { chats: ChatsState }) => state.chats;

export const selectChats = (state: { chats: ChatsState }) =>
  Object.values(state.chats).sort((left, right) => left.order - right.order);

export const selectActiveChat = (state: { chats: ChatsState }) =>
  Object.values(state.chats).find((chat) => chat.isActive) ?? null;
