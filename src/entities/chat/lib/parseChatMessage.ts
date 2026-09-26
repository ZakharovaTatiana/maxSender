import type { ChatMessage } from '../model/chatSlice';

const TEXT_MESSAGE_TYPES = new Set(['textMessage', 'extendedTextMessage']);

function getOptionalString(message: Record<string, unknown>, field: string) {
  const value = message[field];
  return typeof value === 'string' ? value : undefined;
}

function getOptionalBoolean(message: Record<string, unknown>, field: string) {
  const value = message[field];
  return typeof value === 'boolean' ? value : undefined;
}

function getOptionalNumber(message: Record<string, unknown>, field: string) {
  const value = message[field];
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

function getExtendedTextMessage(message: Record<string, unknown>) {
  const value = message.extendedTextMessage;

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  const extendedText = value as Record<string, unknown>;

  if (typeof extendedText.text !== 'string') {
    return undefined;
  }

  return {
    text: extendedText.text,
    description: getOptionalString(extendedText, 'description'),
    title: getOptionalString(extendedText, 'title'),
    isForwarded: getOptionalBoolean(extendedText, 'isForwarded'),
    forwardingScore: getOptionalNumber(extendedText, 'forwardingScore'),
  };
}

export function parseChatMessage(value: unknown): ChatMessage | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const message = value as Record<string, unknown>;
  const { type, idMessage, timestamp, typeMessage, chatId, chatType } = message;
  const textMessage = message.textMessage;

  if (
    (type !== 'incoming' && type !== 'outgoing') ||
    typeof idMessage !== 'string' ||
    typeof timestamp !== 'number' ||
    !Number.isFinite(timestamp) ||
    typeof typeMessage !== 'string' ||
    !TEXT_MESSAGE_TYPES.has(typeMessage) ||
    typeof chatId !== 'string' ||
    typeof chatType !== 'string' ||
    typeof textMessage !== 'string'
  ) {
    return null;
  }

  return {
    type,
    idMessage,
    timestamp,
    typeMessage: typeMessage as ChatMessage['typeMessage'],
    chatId,
    chatType,
    textMessage,
    extendedTextMessage: getExtendedTextMessage(message),
    statusMessage: getOptionalString(message, 'statusMessage'),
    sendByApi: getOptionalBoolean(message, 'sendByApi'),
    senderId: getOptionalString(message, 'senderId'),
    senderName: getOptionalString(message, 'senderName'),
    senderType: getOptionalString(message, 'senderType'),
    senderContactName: getOptionalString(message, 'senderContactName'),
    isForwarded: getOptionalBoolean(message, 'isForwarded'),
    forwardingScore: getOptionalNumber(message, 'forwardingScore'),
    isEdited: getOptionalBoolean(message, 'isEdited'),
    isDeleted: getOptionalBoolean(message, 'isDeleted'),
  };
}
