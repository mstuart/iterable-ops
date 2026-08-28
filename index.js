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

export function* zip(...iterables) {
  const iterators = iterables.map((iterable) => iterable[Symbol.iterator]());
  const done = iterators.map(() => false);
  let iterationFailed = false;
  try {
    for (;;) {
      const results = iterators.map((iterator, index) => {
        const result = iterator.next();
        done[index] = result.done;
        return result;
      });

      if (results.some((result) => result.done)) {
        return;
      }

      yield results.map((result) => result.value);
    }
  } catch (error) {
    iterationFailed = true;
    throw error;
  } finally {
    let cleanupError;
    for (const [index, iterator] of iterators.entries()) {
      if (done[index]) continue;
      try {
        iterator.return?.();
      } catch (error) {
        cleanupError ??= error;
      }
    }
    if (cleanupError && !iterationFailed) throw cleanupError;
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
