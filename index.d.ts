/**
Lazily transform each item in an iterable.

@param iterable - The input iterable.
@param function_ - The mapping function.
@returns A generator yielding transformed items.

@example
```
import {map} from 'iterable-ops';

[...map([1, 2, 3], x => x * 2)];
//=> [2, 4, 6]
```
*/
export function map<T, U>(
  iterable: Iterable<T>,
  function_: (item: T) => U
): Generator<U>;

/**
Lazily filter items in an iterable.

@param iterable - The input iterable.
@param shouldInclude - The predicate function.
@returns A generator yielding items that pass the predicate.

@example
```
import {filter} from 'iterable-ops';

[...filter([1, 2, 3, 4], x => x % 2 === 0)];
//=> [2, 4]
```
*/
export function filter<T>(
  iterable: Iterable<T>,
  shouldInclude: (item: T) => boolean
): Generator<T>;

/**
Lazily take the first `count` items from an iterable.

@param iterable - The input iterable.
@param count - The number of items to take.
@returns A generator yielding at most `count` items.

@example
```
import {take} from 'iterable-ops';

[...take([1, 2, 3, 4, 5], 3)];
//=> [1, 2, 3]
```
*/
export function take<T>(iterable: Iterable<T>, count: number): Generator<T>;

/**
Lazily skip the first `count` items from an iterable.

@param iterable - The input iterable.
@param count - The number of items to skip.
@returns A generator yielding items after skipping `count`.

@example
```
import {drop} from 'iterable-ops';

[...drop([1, 2, 3, 4, 5], 2)];
//=> [3, 4, 5]
```
*/
export function drop<T>(iterable: Iterable<T>, count: number): Generator<T>;

/**
Lazily group items into arrays of `size`.

@param iterable - The input iterable.
@param size - The number of items per chunk.
@returns A generator yielding arrays of items.

@example
```
import {chunk} from 'iterable-ops';

[...chunk([1, 2, 3, 4, 5], 2)];
//=> [[1, 2], [3, 4], [5]]
```
*/
export function chunk<T>(iterable: Iterable<T>, size: number): Generator<T[]>;

/**
Lazily zip multiple iterables together, stopping at the shortest.

@param iterables - The input iterables.
@returns A generator yielding arrays of parallel items.

@example
```
import {zip} from 'iterable-ops';

[...zip([1, 2], ['a', 'b'])];
//=> [[1, 'a'], [2, 'b']]
```
*/
export function zip<T extends Iterable<unknown>[]>(
  ...iterables: T
): Generator<unknown[]>;

/**
Lazily flatten nested iterables up to the specified depth.

@param iterable - The input iterable.
@param depth - The depth to flatten. Default: `1`.
@returns A generator yielding flattened items.

@example
```
import {flatten} from 'iterable-ops';

[...flatten([[1, 2], [3, [4]]])];
//=> [1, 2, 3, [4]]
```
*/
export function flatten(iterable: Iterable<unknown>, depth?: number): Generator;

/**
Lazily yield only unique items from an iterable.

@param iterable - The input iterable.
@returns A generator yielding unique items.

@example
```
import {unique} from 'iterable-ops';

[...unique([1, 2, 2, 3, 3, 3])];
//=> [1, 2, 3]
```
*/
export function unique<T>(iterable: Iterable<T>): Generator<T>;

/**
Lazily transform each item in an async iterable.

@param iterable - The input async iterable.
@param function_ - The mapping function.
@returns An async generator yielding transformed items.

@example
```
import {mapAsync} from 'iterable-ops';

async function* gen() { yield 1; yield 2; }
for await (const item of mapAsync(gen(), x => x * 2)) {
	console.log(item);
}
```
*/
export function mapAsync<T, U>(
  iterable: AsyncIterable<T>,
  function_: (item: T) => U
): AsyncGenerator<U>;

/**
Lazily filter items in an async iterable.

@param iterable - The input async iterable.
@param function_ - The predicate function.
@returns An async generator yielding items that pass the predicate.

@example
```
import {filterAsync} from 'iterable-ops';

async function* gen() { yield 1; yield 2; yield 3; }
for await (const item of filterAsync(gen(), x => x > 1)) {
	console.log(item);
}
```
*/
export function filterAsync<T>(
  iterable: AsyncIterable<T>,
  function_: (item: T) => boolean | Promise<boolean>
): AsyncGenerator<T>;
