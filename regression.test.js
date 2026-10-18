import test from "ava";
import { chunk, zip } from "./index.js";

test("zip with no inputs terminates without producing tuples", (t) => {
  const iterator = zip();
  t.deepEqual(iterator.next(), { done: true, value: undefined });
});

test("zip closes acquired iterators when a later iterator cannot be acquired", (t) => {
  const failure = new Error("acquisition failed");
  let closed = 0;
  const first = {
    [Symbol.iterator]() {
      return {
        next() {
          return { done: false, value: 1 };
        },
        return() {
          closed += 1;
          return { done: true };
        },
      };
    },
  };
  const second = {
    [Symbol.iterator]() {
      throw failure;
    },
  };
  t.is(
    t.throws(() => zip(first, second).next()),
    failure
  );
  t.is(closed, 1);
});

test("zip acquisition failure is preserved even if cleanup throws", (t) => {
  const failure = new Error("acquisition failed");
  const first = {
    [Symbol.iterator]() {
      return {
        next() {
          return { done: false, value: 1 };
        },
        return() {
          throw new Error("cleanup failed");
        },
      };
    },
  };
  const second = {
    [Symbol.iterator]() {
      throw failure;
    },
  };
  t.is(
    t.throws(() => zip(first, second).next()),
    failure
  );
});

test("chunk rejects invalid sizes before pulling source data", (t) => {
  let pulled = false;
  const source = {
    [Symbol.iterator]() {
      pulled = true;
      return [1, 2][Symbol.iterator]();
    },
  };
  for (const size of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    t.throws(() => chunk(source, size).next(), { instanceOf: RangeError });
  }
  t.false(pulled);
});
