import { useReceiveMessages } from '@features/receive-messages';

export function NotificationReceiver() {
  useReceiveMessages();
  return null;
}
