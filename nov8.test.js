import test from "ava";
import { filterAsync, mapAsync, zip } from "./index.js";

test("zip snapshots each value before advancing the next iterator", (t) => {
  let value = 1;
  const first = {
    *[Symbol.iterator]() {
      yield value;
    },
  };
  const second = {
    *[Symbol.iterator]() {
      value = 2;
      yield value;
    },
  };
  const result = {
    done: false,
    get value() {
      return value;
    },
  };
  first[Symbol.iterator] = () => ({ next: () => result });
  const tuples = zip(first, second);
  t.deepEqual(tuples.next().value, [1, 2]);
  tuples.return();
});

test("async operators accept synchronous sources and await their values", async (t) => {
  const mapped = [];
  for await (const value of mapAsync(
    [Promise.resolve(1), Promise.resolve(2)],
    (item) => item * 2
  )) {
    mapped.push(value);
  }
  t.deepEqual(mapped, [2, 4]);
  const filtered = [];
  for await (const value of filterAsync([1, 2], (item) =>
    Promise.resolve(item > 1)
  )) {
    filtered.push(value);
  }
  t.deepEqual(filtered, [2]);
});
