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

export interface Chat {
  chatId: string;
  order: number;
  contactInfo?: ContactInfo;
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
  },
});

export const { addChat, setChatContactInfo } = chatsSlice.actions;
export const chatsReducer = chatsSlice.reducer;

export const selectChatsState = (state: { chats: ChatsState }) => state.chats;

export const selectChats = (state: { chats: ChatsState }) =>
  Object.values(state.chats).sort((left, right) => left.order - right.order);
