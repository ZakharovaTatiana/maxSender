import assert from 'node:assert/strict';
import test from 'node:test';
import { addChat, chatsReducer, selectChats } from './chatSlice.ts';

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
