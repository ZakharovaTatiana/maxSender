import { useSelector } from 'react-redux';
import { ChatList, selectChats } from '@entities/chat';
import { ContactSearchForm } from '@features/contact-search';

export function ChatPanel() {
  const chats = useSelector(selectChats);

  return (
    <section className="min-w-0 flex-1 border-r border-slate-200 bg-white px-4 py-6 sm:w-96 sm:flex-none sm:px-5">
      <h1 className="text-2xl font-bold tracking-tight text-slate-950">Чаты</h1>
      <ContactSearchForm />
      <ChatList chats={chats} />
    </section>
  );
}
