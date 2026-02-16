import * as assert from 'node:assert/strict';
import tape from 'tape';

type TestFn = () => unknown | Promise<unknown>;
type TableRow = unknown[] | unknown;

let suiteStack: string[] = [];

function prefixedName(name: string): string {
  if (suiteStack.length === 0) {
    return name;
  }
  return `${suiteStack.join(' > ')} > ${name}`;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function matchObject(actual: unknown, expected: unknown): boolean {
  if (!isObject(expected)) {
    return Object.is(actual, expected);
  }
  if (!isObject(actual)) {
    return false;
  }
  for (const [key, expectedValue] of Object.entries(expected)) {
    if (!(key in actual)) {
      return false;
    }
    const actualValue = (actual as Record<string, unknown>)[key];
    if (Array.isArray(expectedValue)) {
      if (!Array.isArray(actualValue) || expectedValue.length !== actualValue.length) {
        return false;
      }
      for (let i = 0; i < expectedValue.length; i++) {
        if (!matchObject(actualValue[i], expectedValue[i])) {
          return false;
        }
      }
      continue;
    }
    if (!matchObject(actualValue, expectedValue)) {
      return false;
    }
  }
  return true;
}

function createExpect(actual: unknown) {
  const not = {
    toBe(expected: unknown) {
      assert.notStrictEqual(actual, expected);
    },
    toBeUndefined() {
      assert.notStrictEqual(actual, undefined);
    },
  };

  return {
    not,
    toBe(expected: unknown) {
      assert.strictEqual(actual, expected);
    },
    toBeUndefined() {
      assert.strictEqual(actual, undefined);
    },
    toEqual(expected: unknown) {
      assert.deepStrictEqual(actual, expected);
    },
    toMatchObject(expected: unknown) {
      assert.ok(matchObject(actual, expected));
    },
    toThrow(expected?: string | RegExp) {
      assert.ok(typeof actual === 'function', 'toThrow expects a function');
      if (expected === undefined) {
        assert.throws(actual as () => unknown);
        return;
      }
      if (typeof expected === 'string') {
        assert.throws(actual as () => unknown, (err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          return message.includes(expected);
        });
        return;
      }
      assert.throws(actual as () => unknown, expected);
    },
  };
}

function runTest(name: string, fn: TestFn): void {
  tape(prefixedName(name), async (t: tape.Test) => {
    try {
      await fn();
      t.pass(name);
    } catch (err) {
      const message = err instanceof Error ? err.stack ?? err.message : String(err);
      t.fail(message);
    }
    t.end();
  });
}

function eachFactory(cases: TableRow[]) {
  return (name: string, fn: (...args: unknown[]) => unknown) => {
    for (const row of cases) {
      const args = Array.isArray(row) ? row : [row];
      let caseName = name;
      for (const arg of args) {
        caseName = caseName.replace(/%[sidfjo]/, String(arg));
      }
      runTest(caseName, () => fn(...args));
    }
  };
}

function describe(name: string, fn: () => void): void {
  suiteStack.push(name);
  try {
    fn();
  } finally {
    suiteStack = suiteStack.slice(0, -1);
  }
}

function test(name: string, fn: TestFn): void {
  runTest(name, fn);
}

const it = Object.assign(test, {
  each: eachFactory,
});

Object.assign(globalThis, {
  describe,
  expect: createExpect,
  it,
  test,
});
