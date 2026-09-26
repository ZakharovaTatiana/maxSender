import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addChat,
  chatsReducer,
  selectChats,
  setChatMessages,
  startChatHistoryLoading,
} from './chatSlice.ts';

test('selectChats reuses results until chats change', () => {
  const state = { chats: chatsReducer(undefined, { type: 'init' }) };
  const empty = selectChats(state);
  assert.strictEqual(selectChats(state), empty);
  assert.strictEqual(selectChats({ ...state, session: {} }), empty);

  const updated = { chats: chatsReducer(state.chats, addChat('first')) };
  const chats = selectChats(updated);
  assert.notStrictEqual(chats, empty);
  assert.deepEqual(
    chats.map(({ chatId }) => chatId),
    ['first'],
  );
  assert.strictEqual(selectChats(updated), chats);
  assert.deepEqual(empty, []);
});

test('selectChats sorts by order without changing the state', () => {
  const first = Object.freeze({ chatId: 'first', order: 1 });
  const second = Object.freeze({ chatId: 'second', order: 2 });
  const state = { chats: Object.freeze({ second, first }) };
  assert.deepEqual(selectChats(state), [first, second]);
  assert.deepEqual(Object.keys(state.chats), ['second', 'first']);
});

test('history refresh merges new data and updates existing messages', () => {
  const chatId = 'chat';
  const message = (idMessage, timestamp, textMessage) => ({
    type: 'incoming',
    idMessage,
    timestamp,
    typeMessage: 'textMessage',
    chatId,
    chatType: 'user',
    textMessage,
  });
  let state = chatsReducer(undefined, addChat(chatId));

  state = chatsReducer(
    state,
    setChatMessages({
      chatId,
      messages: [
        message('first', 10, 'Old text'),
        message('second', 20, 'Second'),
      ],
    }),
  );
  state = chatsReducer(state, startChatHistoryLoading(chatId));
  assert.equal(state[chatId].historyStatus, 'loading');

  state = chatsReducer(
    state,
    setChatMessages({
      chatId,
      messages: [
        message('first', 10, 'Updated text'),
        message('third', 30, 'Third'),
      ],
    }),
  );

  assert.deepEqual(
    state[chatId].messages.map(({ idMessage, textMessage }) => ({
      idMessage,
      textMessage,
    })),
    [
      { idMessage: 'first', textMessage: 'Updated text' },
      { idMessage: 'second', textMessage: 'Second' },
      { idMessage: 'third', textMessage: 'Third' },
    ],
  );
  assert.equal(state[chatId].historyStatus, 'loaded');
});
