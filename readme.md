<div align="center">
  <img src="docs/assets/logo.svg" alt="iterable-ops — Lazy utility functions for sync and async iterables — map, filter, take, chunk, zip, flatten" width="720">
</div>

<p align="center"><strong>Lazy utility functions for sync and async iterables — map, filter, take, chunk, zip, flatten</strong></p>

<p align="center">
  <a href="https://github.com/mstuart/iterable-ops/actions/workflows/main.yml"><img src="https://github.com/mstuart/iterable-ops/actions/workflows/main.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://www.npmjs.com/package/iterable-ops"><img src="https://img.shields.io/npm/v/iterable-ops?label=npm" alt="npm"></a>
  <img src="https://img.shields.io/badge/node-%E2%89%A520-339933.svg" alt="Node 20+">
  <a href="https://deepwiki.com/mstuart/iterable-ops"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
  <a href="https://socket.dev/npm/package/iterable-ops"><img src="https://socket.dev/api/badge/npm/package/iterable-ops" alt="Socket"></a>
</p>

---
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
