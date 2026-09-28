import { useSelector } from 'react-redux';
import { ChatList, selectActiveChat, selectChats } from '@entities/chat';
import { useOpenChat } from '@features/chat-history';
import { ContactSearchForm } from '@features/contact-search';
import { LogoutButton } from '@features/logout';

export function ChatPanel() {
  const chats = useSelector(selectChats);
  const activeChat = useSelector(selectActiveChat);
  const openChat = useOpenChat();

  return (
    <section
      className={`min-w-0 flex-1 overflow-y-auto border-r border-slate-200 bg-white px-4 py-4 lg:block lg:w-96 lg:flex-none lg:px-5 lg:py-6 ${activeChat ? 'hidden' : 'block'}`}
    >
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Чаты
        </h1>
        <LogoutButton variant="header" />
      </header>
      <ContactSearchForm />
      <ChatList chats={chats} onChatSelect={openChat} />
    </section>
  );
}
