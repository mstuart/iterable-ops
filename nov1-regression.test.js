import test from "ava";
import { zip } from "./index.js";

test("stops before reading later iterators once a shortest input ends", (t) => {
  let reads = 0;
  let closes = 0;
  const later = {
    [Symbol.iterator]() {
      return {
        next() {
          reads += 1;
          throw new Error("unneeded read");
        },
        return() {
          closes += 1;
          return { done: true };
        },
      };
    },
  };
  t.deepEqual([...zip([], later)], []);
  t.is(reads, 0);
  t.is(closes, 1);
});
