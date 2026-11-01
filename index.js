export function* map(iterable, function_) {
  for (const item of iterable) {
    yield function_(item);
  }
}

export function* filter(iterable, function_) {
  for (const item of iterable) {
    if (function_(item)) {
      yield item;
    }
  }
}

export function* take(iterable, count) {
  if (count <= 0) {
    return;
  }

  let index = 0;
  for (const item of iterable) {
    yield item;
    index += 1;
    // Stop as soon as we have enough, without pulling another element from
    // the source — important for lazy, infinite, or side-effectful iterables.
    if (index >= count) {
      return;
    }
  }
}

export function* drop(iterable, count) {
  let index = 0;
  for (const item of iterable) {
    if (index >= count) {
      yield item;
    }

    index += 1;
  }
}

export function* chunk(iterable, size) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError("Expected size to be a positive integer");
  }

  let current = [];
  for (const item of iterable) {
    current.push(item);
    if (current.length === size) {
      yield current;
      current = [];
    }
  }

  if (current.length > 0) {
    yield current;
  }
}

// Close every iterator that has not finished on its own, then surface the
// first error a `.return()` raised — unless the zip body itself already threw,
// in which case that original error must win. Kept out of zip's `finally`
// block on purpose: rethrowing directly inside `finally` triggers
// noUnsafeFinally, and the propagation here is intentional and tested.
function closeUnfinishedIterators(iterators, done, iterationFailed) {
  let cleanupError;
  let hasCleanupError = false;
  for (const [index, iterator] of iterators.entries()) {
    if (done[index]) {
      continue;
    }
    try {
      iterator.return?.();
    } catch (error) {
      if (!hasCleanupError) {
        cleanupError = error;
        hasCleanupError = true;
      }
    }
  }
  if (hasCleanupError && !iterationFailed) {
    throw cleanupError;
  }
}

export function* zip(...iterables) {
  const iterators = [];
  const done = [];
  let iterationFailed = false;
  try {
    for (const iterable of iterables) {
      iterators.push(iterable[Symbol.iterator]());
      done.push(false);
    }

    if (iterators.length === 0) {
      return;
    }

    for (;;) {
      const results = [];
      for (const [index, iterator] of iterators.entries()) {
        const result = iterator.next();
        // Read done once and stop without pulling later inputs.
        done[index] = Boolean(result.done);
        if (done[index]) {
          return;
        }
        results.push(result);
      }

      yield results.map((result) => result.value);
    }
  } catch (error) {
    iterationFailed = true;
    throw error;
  } finally {
    closeUnfinishedIterators(iterators, done, iterationFailed);
  }
}

export function* flatten(iterable, depth = 1) {
  for (const item of iterable) {
    if (
      depth > 0 &&
      item !== null &&
      item !== undefined &&
      typeof item[Symbol.iterator] === "function" &&
      typeof item !== "string"
    ) {
      yield* flatten(item, depth - 1);
    } else {
      yield item;
    }
  }
}

export function* unique(iterable) {
  const seen = new Set();
  for (const item of iterable) {
    if (seen.has(item)) {
      continue;
    }

    seen.add(item);
    yield item;
  }
}

export async function* mapAsync(iterable, function_) {
  for await (const item of iterable) {
    yield function_(item);
  }
}

export async function* filterAsync(iterable, function_) {
  for await (const item of iterable) {
    if (await function_(item)) {
      yield item;
    }
  }
}
