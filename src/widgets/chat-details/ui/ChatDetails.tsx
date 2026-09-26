import {
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addChatMessage,
  ChatAvatar,
  deactivateChat,
  getChatName,
  selectActiveChat,
} from '@entities/chat';
import { selectSession } from '@entities/session';
import { getMessage, sendMessage } from '@features/send-message';
import { ErrorTooltip } from '@shared/ui';
import { MessageHistory } from './MessageHistory';

export function ChatDetails() {
  const activeChat = useSelector(selectActiveChat);

  if (!activeChat) {
    return <section className="min-w-0 flex-1" aria-label="Детализация чата" />;
  }

  return <ActiveChatDetails chat={activeChat} key={activeChat.chatId} />;
}

interface ActiveChatDetailsProps {
  chat: NonNullable<ReturnType<typeof selectActiveChat>>;
}

function ActiveChatDetails({ chat }: ActiveChatDetailsProps) {
  const dispatch = useDispatch();
  const credentials = useSelector(selectSession);
  const [message, setMessage] = useState('');
  const [sendError, setSendError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [message]);

  const chatName = getChatName(chat);
  const hasMessage = message.trim().length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasMessage || isSending) {
      return;
    }

    setIsSending(true);
    setSendError('');

    let idMessage: string;

    try {
      idMessage = await sendMessage(credentials, chat.chatId, message);
    } catch {
      setSendError('Ошибка отправки сообщения, попробуйте позже');
      setIsSending(false);
      return;
    }

    setMessage('');

    try {
      const sentMessage = await getMessage(credentials, chat.chatId, idMessage);
      dispatch(addChatMessage({ chatId: chat.chatId, message: sentMessage }));
    } catch {
      // Sending succeeded, but the journal entry is not available yet.
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <section
      className="app-background flex min-w-0 flex-1 flex-col"
      aria-label={`Чат ${chatName}`}
    >
      <header className="flex h-18 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
        <button
          aria-label="Закрыть чат"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3478f6]"
          onClick={() => dispatch(deactivateChat())}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <ChatAvatar chat={chat} className="size-10" />
        <h2 className="min-w-0 truncate text-base font-semibold text-slate-950">
          {chatName}
        </h2>
      </header>

      <MessageHistory messages={chat.messages} status={chat.historyStatus} />

      <form className="shrink-0 p-3 sm:p-4" onSubmit={handleSubmit}>
        <div className="relative mx-auto max-w-3xl">
          {sendError && (
            <ErrorTooltip message={sendError} setMessage={setSendError} />
          )}
          <label>
            <span className="sr-only">Сообщение</span>
            <textarea
              className="block min-h-12 w-full resize-none overflow-hidden rounded-2xl bg-white py-3 pr-14 pl-4 text-sm leading-6 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-[#3478f6]"
              name="message"
              maxLength={4000}
              onChange={(event) => {
                setSendError('');
                setMessage(event.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Сообщение"
              ref={textareaRef}
              rows={1}
              value={message}
            />
          </label>
          <button
            aria-label="Отправить сообщение"
            className="absolute right-2 bottom-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#3478f6] text-white transition hover:bg-[#2868dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3478f6] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            disabled={!hasMessage || isSending}
            type="submit"
          >
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
}
