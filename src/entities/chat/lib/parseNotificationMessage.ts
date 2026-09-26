import { parseChatMessage } from './parseChatMessage.ts';

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseNotificationMessage(value: unknown) {
  const body = record(value);
  const incoming = body.typeWebhook === 'incomingMessageReceived';
  const outgoing =
    body.typeWebhook === 'outgoingMessageReceived' ||
    body.typeWebhook === 'outgoingAPIMessageReceived';
  if (!incoming && !outgoing) return null;
  const sender = record(body.senderData);
  const data = record(body.messageData);
  const text = record(data.textMessageData);
  const extended = record(data.extendedTextMessageData);
  return parseChatMessage({
    type: incoming ? 'incoming' : 'outgoing',
    idMessage: body.idMessage,
    timestamp: body.timestamp,
    chatId: sender.chatId,
    chatType: sender.chatType,
    typeMessage: data.typeMessage,
    textMessage:
      data.typeMessage === 'extendedTextMessage'
        ? extended.text
        : text.textMessage,
    extendedTextMessage: data.extendedTextMessageData,
    senderId: sender.sender,
    senderName: sender.senderName,
    senderType: sender.senderType,
    senderContactName: sender.senderContactName,
    sendByApi: outgoing
      ? body.typeWebhook === 'outgoingAPIMessageReceived'
      : undefined,
    isForwarded: extended.isForwarded,
    forwardingScore: extended.forwardingScore,
  });
}
