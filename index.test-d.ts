import { expectError, expectType } from "tsd";
import {
  chunk,
  drop,
  filter,
  filterAsync,
  flatten,
  map,
  mapAsync,
  take,
  unique,
  zip,
} from "./index.js";

expectType<Generator<number>>(map([1, 2, 3], (x) => x * 2));
expectType<Generator<string>>(map([1, 2, 3], String));
expectType<Generator<number>>(filter([1, 2, 3], (x) => x > 1));
expectType<Generator<number>>(take([1, 2, 3], 2));
expectType<Generator<number>>(drop([1, 2, 3], 1));
expectType<Generator<number[]>>(chunk([1, 2, 3], 2));
expectType<Generator<[number, string]>>(zip([1, 2], ["a", "b"]));
expectType<Generator>(
  flatten([
    [1, 2],
    [3, 4],
  ])
);
expectType<Generator<number>>(unique([1, 2, 2, 3]));

async function* generate(): AsyncGenerator<number> {
  await Promise.resolve();
  yield 1;
  yield 2;
}

expectType<AsyncGenerator<number>>(mapAsync(generate(), (x) => x * 2));
expectType<AsyncGenerator<number>>(filterAsync(generate(), (x) => x > 1));

expectError(map(123, (x) => x));
expectError(filter(123, (x) => x));

// Async generators await mapped promises before yielding values.
expectType<AsyncGenerator<number>>(
  mapAsync(generate(), async (value) => value + 1)
);

expectType<Generator<[]>>(zip());
expectType<Generator<[number, string, boolean]>>(
  zip([1], ["a"], new Set([true]))
);
expectType<AsyncGenerator<number>>(mapAsync([1, 2], (item) => item * 2));
expectType<AsyncGenerator<number>>(
  mapAsync([Promise.resolve(1)], (item) => {
    expectType<number>(item);
    return item * 2;
  })
);
expectType<AsyncGenerator<number>>(filterAsync([1, 2], (item) => item > 1));
const predicateResult: PromiseLike<boolean> = Promise.resolve(true);
expectType<AsyncGenerator<number>>(
  filterAsync(generate(), () => predicateResult)
);
