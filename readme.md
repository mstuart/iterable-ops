# iterable-ops

> Lazy utility functions for sync and async iterables — map, filter, take, chunk, zip, flatten

## Install

```sh
npm install iterable-ops
```

## Usage

```js
import {map, filter, take, chunk, zip, flatten, unique} from 'iterable-ops';

[...map([1, 2, 3], x => x * 2)];
//=> [2, 4, 6]

[...filter([1, 2, 3, 4], x => x % 2 === 0)];
//=> [2, 4]

[...take([1, 2, 3, 4, 5], 3)];
//=> [1, 2, 3]

[...chunk([1, 2, 3, 4, 5], 2)];
//=> [[1, 2], [3, 4], [5]]

[...zip([1, 2], ['a', 'b'])];
//=> [[1, 'a'], [2, 'b']]

[...flatten([[1, 2], [3, [4]]])];
//=> [1, 2, 3, [4]]

[...unique([1, 2, 2, 3, 3])];
//=> [1, 2, 3]
```

All functions are lazy — they use generators and only compute values as they are consumed.

## API

### map(iterable, function_)

Yields `function_(item)` for each item.

### filter(iterable, function_)

Yields items where `function_(item)` is truthy.

### take(iterable, count)

Yields the first `count` items, then stops.

### drop(iterable, count)

Skips the first `count` items, then yields the rest.

### chunk(iterable, size)

Yields arrays of `size` items. The last chunk may be smaller.

### zip(...iterables)

Yields arrays of parallel items from each iterable. Stops at the shortest.

### flatten(iterable, depth?)

Yields items from nested iterables, flattening up to `depth` levels. Default: `1`.

### unique(iterable)

Yields only the first occurrence of each value.

### mapAsync(iterable, function_)

Async version of `map` for async iterables.

### filterAsync(iterable, function_)

Async version of `filter` for async iterables.

## Related

- [map-extras](https://github.com/mstuart/map-extras) - Utility functions for JavaScript Map

## License

MIT
