import assert from 'node:assert/strict';
import test from 'node:test';
import { pollNotifications } from './pollNotifications.ts';

const flush = async () => {
  for (let i = 0; i < 10; i++) await Promise.resolve();
};
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

for (const outcome of [null, {}, 'error']) {
  test(`waits five seconds after response: ${JSON.stringify(outcome)}`, async (t) => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    let calls = 0;
    const first = deferred();
    const stop = pollNotifications({
      receive: async () => {
        calls++;
        if (calls === 1) await first.promise;
        if (outcome === 'error') throw new Error('offline');
        return outcome;
      },
      remove: async () => {
        assert.fail('No receipt to delete');
      },
      onBody: () => {},
    });
    t.after(stop);
    assert.equal(calls, 1);
    t.mock.timers.tick(20000);
    assert.equal(calls, 1);
    first.resolve();
    await flush();
    t.mock.timers.tick(4999);
    assert.equal(calls, 1);
    t.mock.timers.tick(1);
    assert.equal(calls, 2);
  });
}

for (const result of [true, false, 'error']) {
  test(`deletion ${result} handles the original retry deadline`, async (t) => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const deletion = deferred();
    const bodies = [];
    let calls = 0;
    const stop = pollNotifications({
      receive: async () =>
        ++calls === 1 ? { receiptId: 0, body: { example: true } } : null,
      remove: async (id) => {
        assert.equal(id, 0);
        await deletion.promise;
        if (result === 'error') throw new Error('offline');
        return result;
      },
      onBody: (body) => bodies.push(body),
    });
    t.after(stop);
    await flush();
    assert.deepEqual(bodies, [{ example: true }]);
    t.mock.timers.tick(2000);
    deletion.resolve();
    await flush();
    assert.equal(calls, result === true ? 2 : 1);
    t.mock.timers.tick(3000);
    await flush();
    assert.equal(calls, 2);
    if (result === true) {
      t.mock.timers.tick(2000);
      assert.equal(calls, 3);
    }
  });
}

test('slow deletion does not delay polling or overlap receives', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const deletion = deferred();
  const nextReceive = deferred();
  let calls = 0;
  const stop = pollNotifications({
    receive: async () =>
      ++calls === 1 ? { receiptId: 7 } : nextReceive.promise,
    remove: () => deletion.promise,
    onBody: () => {},
  });
  t.after(stop);
  await flush();
  t.mock.timers.tick(5000);
  assert.equal(calls, 2);
  deletion.resolve(true);
  await flush();
  assert.equal(calls, 2);
  nextReceive.resolve(null);
  await flush();
  t.mock.timers.tick(5000);
  assert.equal(calls, 3);
});

for (const phase of ['receive', 'delete']) {
  test(`stop cancels ${phase} and ignores its late result`, async (t) => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const pending = deferred();
    let calls = 0;
    let requestSignal;
    let bodies = 0;
    const stop = pollNotifications({
      receive: async (signal) => {
        calls++;
        requestSignal = signal;
        return phase === 'receive'
          ? pending.promise
          : { receiptId: 1, body: {} };
      },
      remove: () => pending.promise,
      onBody: () => bodies++,
    });
    await flush();
    stop();
    assert.equal(requestSignal.aborted, true);
    pending.resolve(phase === 'receive' ? { receiptId: 1, body: {} } : true);
    await flush();
    t.mock.timers.tick(20000);
    assert.equal(calls, 1);
    assert.equal(bodies, phase === 'receive' ? 0 : 1);
  });
}

test('body without receipt is still processed', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const bodies = [];
  const stop = pollNotifications({
    receive: async () => ({ body: { example: true } }),
    remove: async () => assert.fail('No receipt'),
    onBody: (body) => bodies.push(body),
  });
  t.after(stop);
  await flush();
  assert.deepEqual(bodies, [{ example: true }]);
});
