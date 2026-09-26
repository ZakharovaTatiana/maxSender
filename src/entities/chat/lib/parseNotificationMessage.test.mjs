import assert from 'node:assert/strict';
import test from 'node:test';
import { parseNotificationMessage } from './parseNotificationMessage.ts';
import {
  addChat,
  addChatMessage,
  chatsReducer,
  setChatMessages,
} from '../model/chatSlice.ts';

const body = {
  typeWebhook: 'incomingMessageReceived',
  idMessage: 'test-message',
  timestamp: 100,
  senderData: { chatId: 'test-chat', chatType: 'user', sender: 'test-sender' },
  messageData: {
    typeMessage: 'textMessage',
    textMessageData: { textMessage: 'Test' },
  },
};

test('maps incoming and outgoing text notification fields', () => {
  const incoming = parseNotificationMessage(body);
  assert.equal(incoming.textMessage, 'Test');
  assert.equal(incoming.senderId, 'test-sender');
  assert.equal(incoming.type, 'incoming');
  for (const typeWebhook of [
    'outgoingMessageReceived',
    'outgoingAPIMessageReceived',
  ]) {
    const message = parseNotificationMessage({ ...body, typeWebhook });
    assert.equal(message.type, 'outgoing');
    assert.equal(
      message.sendByApi,
      typeWebhook === 'outgoingAPIMessageReceived',
    );
  }
});

test('maps extended text and ignores unsupported or malformed notifications', () => {
  const message = parseNotificationMessage({
    ...body,
    messageData: {
      typeMessage: 'extendedTextMessage',
      extendedTextMessageData: {
        text: 'Link',
        title: 'Title',
        isForwarded: true,
      },
    },
  });
  assert.equal(message.textMessage, 'Link');
  assert.equal(message.extendedTextMessage.title, 'Title');
  assert.equal(message.isForwarded, true);
  for (const value of [
    null,
    [],
    {},
    { ...body, typeWebhook: 'outgoingMessageStatus' },
    { ...body, senderData: null },
    { ...body, messageData: { typeMessage: 'imageMessage' } },
  ]) {
    assert.equal(parseNotificationMessage(value), null);
  }
});

test('only existing chats receive messages; duplicates and history races preserve messages', () => {
  const message = parseNotificationMessage(body);
  const action = addChatMessage({ chatId: message.chatId, message });
  let state = chatsReducer(undefined, action);
  assert.deepEqual(state, {});
  state = chatsReducer(state, addChat(message.chatId));
  state = chatsReducer(state, action);
  state = chatsReducer(state, action);
  assert.equal(state[message.chatId].messages.length, 1);
  state = chatsReducer(
    state,
    setChatMessages({
      chatId: message.chatId,
      messages: [{ ...message, idMessage: 'older', timestamp: 50 }],
    }),
  );
  assert.deepEqual(
    state[message.chatId].messages.map((item) => item.idMessage),
    ['older', 'test-message'],
  );
  state = chatsReducer(
    state,
    setChatMessages({ chatId: message.chatId, messages: [message] }),
  );
  assert.equal(state[message.chatId].messages.length, 2);
});
