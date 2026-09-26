import { Fragment, useLayoutEffect, useMemo, useRef } from 'react';
import type { ChatHistoryStatus, ChatMessage } from '@entities/chat';

interface MessageHistoryProps {
  messages: ChatMessage[];
  status: ChatHistoryStatus;
}

function getDateKey(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function getDateLabel(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (getDateKey(timestamp) === getDateKey(today.getTime() / 1000)) {
    return 'сегодня';
  }

  if (getDateKey(timestamp) === getDateKey(yesterday.getTime() / 1000)) {
    return 'вчера';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getMessageTime(timestamp: number) {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp * 1000));
}

export function MessageHistory({ messages, status }: MessageHistoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupedMessages = useMemo(() => {
    const groups: Array<{
      key: string;
      timestamp: number;
      items: ChatMessage[];
    }> = [];

    messages.forEach((message) => {
      const key = getDateKey(message.timestamp);
      const currentGroup = groups[groups.length - 1];

      if (currentGroup?.key === key) {
        currentGroup.items.push(message);
        return;
      }

      groups.push({ key, timestamp: message.timestamp, items: [message] });
    });

    return groups;
  }, [messages]);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (container && messages.length > 0) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="relative z-0 min-h-0 flex-1 overscroll-contain overflow-y-auto px-4 py-5 sm:px-6"
      ref={containerRef}
    >
      {status === 'loading' && (
        <p className="text-center text-sm text-slate-600">Загрузка истории…</p>
      )}
      {status === 'failed' && (
        <p className="text-center text-sm text-red-700">
          Не удалось загрузить историю чата
        </p>
      )}
      {status === 'loaded' && messages.length === 0 && (
        <p className="text-center text-sm text-slate-600">
          Текстовых сообщений пока нет
        </p>
      )}

      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        {groupedMessages.map((group) => (
          <Fragment key={group.key}>
            <div className="my-2 flex justify-center">
              <time
                className="rounded-full bg-sky-600/70 px-3 py-1 text-xs font-medium text-white"
                dateTime={new Date(group.timestamp * 1000).toISOString()}
              >
                {getDateLabel(group.timestamp)}
              </time>
            </div>
            {group.items.map((message) => (
              <article
                className={`flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                key={message.idMessage}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm text-slate-950 shadow-sm ${message.type === 'outgoing' ? 'rounded-br-md bg-cyan-50' : 'rounded-bl-md bg-white'}`}
                >
                  <p className="inline whitespace-pre-wrap break-words">
                    {message.textMessage}
                  </p>
                  <time
                    className="ml-2 inline-block align-bottom text-[11px] leading-4 text-slate-400"
                    dateTime={new Date(message.timestamp * 1000).toISOString()}
                  >
                    {getMessageTime(message.timestamp)}
                  </time>
                </div>
              </article>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
