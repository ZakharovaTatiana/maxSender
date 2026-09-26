import type { Chat } from '../model/chatSlice';

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
];

interface ChatListProps {
  chats: Chat[];
}

function getChatName({ chatId, contactInfo }: Chat) {
  const name = contactInfo?.name?.trim();
  const contactName = contactInfo?.contactName?.trim();
  const phoneNumber = contactInfo?.phoneNumber;

  if (name) {
    return name;
  }

  if (contactName) {
    return contactName;
  }

  if (typeof phoneNumber === 'number' && phoneNumber !== 0) {
    return String(phoneNumber);
  }

  return chatId;
}

function getChatInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .join('')
    .toLocaleUpperCase('ru-RU');
}

export function ChatList({ chats }: ChatListProps) {
  if (chats.length === 0) {
    return null;
  }

  return (
    <ul className="mt-3 divide-y divide-slate-100" aria-label="Список чатов">
      {chats.map((chat) => {
        const chatName = getChatName(chat);
        const avatar = chat.contactInfo?.avatar?.trim();

        return (
          <li className="flex items-center gap-3 py-3" key={chat.chatId}>
            {avatar ? (
              <img
                alt=""
                className="size-12 shrink-0 rounded-full object-cover"
                src={avatar}
              />
            ) : (
              <div
                aria-hidden="true"
                className={`flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white ${AVATAR_COLORS[(chat.order - 1) % AVATAR_COLORS.length]}`}
              >
                {getChatInitials(chatName)}
              </div>
            )}
            <span className="min-w-0 truncate text-sm font-medium text-slate-950">
              {chatName}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
