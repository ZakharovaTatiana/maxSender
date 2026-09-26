import type { Chat } from '../model/chatSlice';
import { getChatName } from '../lib/getChatName';
import { ChatAvatar } from './ChatAvatar';

interface ChatListProps {
  chats: Chat[];
  onChatSelect: (chatId: string) => void;
}

export function ChatList({ chats, onChatSelect }: ChatListProps) {
  if (chats.length === 0) {
    return null;
  }

  return (
    <ul className="mt-3 divide-y divide-slate-100" aria-label="Список чатов">
      {chats.map((chat) => {
        const chatName = getChatName(chat);

        return (
          <li key={chat.chatId}>
            <button
              aria-pressed={Boolean(chat.isActive)}
              className={`flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#3478f6] ${chat.isActive ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
              onClick={() => onChatSelect(chat.chatId)}
              type="button"
            >
              <ChatAvatar chat={chat} />
              <span className="min-w-0 truncate text-sm font-medium text-slate-950">
                {chatName}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
