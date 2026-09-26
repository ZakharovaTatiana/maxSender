interface PollOptions {
  receive: (signal: AbortSignal) => Promise<unknown>;
  remove: (receiptId: number, signal: AbortSignal) => Promise<boolean>;
  onBody: (body: unknown) => void;
}

export function pollNotifications({ receive, remove, onBody }: PollOptions) {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let receiving = false;
  const deleting = new Set<number>();

  async function acknowledge(receiptId: number) {
    if (deleting.has(receiptId)) return;
    deleting.add(receiptId);
    try {
      const deleted = await remove(receiptId, controller.signal);
      if (deleted && !controller.signal.aborted) {
        clearTimeout(timer);
        void poll();
      }
    } catch {
      // Keep the retry deadline set by ReceiveNotification.
    } finally {
      deleting.delete(receiptId);
    }
  }

  async function poll() {
    if (controller.signal.aborted || receiving) return;
    clearTimeout(timer);
    receiving = true;
    let notification: unknown;
    try {
      notification = await receive(controller.signal);
    } catch {
      // Empty responses and errors both use the normal retry interval.
    } finally {
      receiving = false;
      if (!controller.signal.aborted)
        timer = setTimeout(() => void poll(), 5000);
    }
    if (
      controller.signal.aborted ||
      !notification ||
      typeof notification !== 'object'
    )
      return;
    if ('body' in notification) onBody(notification.body);
    if (
      'receiptId' in notification &&
      typeof notification.receiptId === 'number' &&
      Number.isSafeInteger(notification.receiptId)
    ) {
      void acknowledge(notification.receiptId);
    }
  }

  void poll();
  return () => {
    controller.abort();
    clearTimeout(timer);
  };
}
