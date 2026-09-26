import type { Chat } from '../model/chatSlice';

export function getChatName({ chatId, contactInfo }: Chat) {
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
