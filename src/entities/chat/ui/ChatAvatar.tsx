import type { Chat } from '../model/chatSlice';
import { getChatName } from '../lib/getChatName';

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
];

interface ChatAvatarProps {
  chat: Chat;
  className?: string;
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

export function ChatAvatar({ chat, className = 'size-12' }: ChatAvatarProps) {
  const avatar = chat.contactInfo?.avatar?.trim();
  const commonClassName = `${className} shrink-0 rounded-full`;

  if (avatar) {
    return (
      <img alt="" className={`${commonClassName} object-cover`} src={avatar} />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center text-lg font-semibold text-white ${commonClassName} ${AVATAR_COLORS[(chat.order - 1) % AVATAR_COLORS.length]}`}
    >
      {getChatInitials(getChatName(chat))}
    </div>
  );
}
