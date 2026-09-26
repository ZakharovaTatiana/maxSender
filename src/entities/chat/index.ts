export { getChatName } from './lib/getChatName';
export { ChatAvatar } from './ui/ChatAvatar';
export { ChatList } from './ui/ChatList';
export {
  activateChat,
  addChat,
  chatsReducer,
  deactivateChat,
  failChatHistoryLoading,
  selectActiveChat,
  selectChats,
  selectChatsState,
  setChatContactInfo,
  setChatMessages,
  startChatHistoryLoading,
} from './model/chatSlice';
export type {
  Chat,
  ChatHistoryStatus,
  ChatMessage,
  ChatsState,
  ContactInfo,
} from './model/chatSlice';
