import test from 'ava';
import {
	map,
	filter,
	take,
	drop,
	chunk,
	zip,
	flatten,
	unique,
	mapAsync,
	filterAsync,
} from './index.js';

// --- map ---

test('map transforms items', t => {
	t.deepEqual([...map([1, 2, 3], x => x * 2)], [2, 4, 6]);
});

test('map with string transformation', t => {
	t.deepEqual([...map(['a', 'b'], s => s.toUpperCase())], ['A', 'B']);
});

test('map with empty iterable', t => {
	t.deepEqual([...map([], x => x)], []);
});

test('map is lazy', t => {
	let callCount = 0;
	const result = map([1, 2, 3], x => {
		callCount++;
		return x * 2;
	});
	t.is(callCount, 0);
	const first = result.next();
	t.is(first.value, 2);
	t.is(callCount, 1);
});

// --- filter ---

test('filter selects matching items', t => {
	t.deepEqual([...filter([1, 2, 3, 4], x => x % 2 === 0)], [2, 4]);
});

test('filter with no matches', t => {
	t.deepEqual([...filter([1, 2, 3], x => x > 10)], []);
});

test('filter with all matches', t => {
	t.deepEqual([...filter([1, 2, 3], x => x > 0)], [1, 2, 3]);
});

test('filter with empty iterable', t => {
	t.deepEqual([...filter([], () => true)], []);
});

// --- take ---

test('take returns first n items', t => {
	t.deepEqual([...take([1, 2, 3, 4, 5], 3)], [1, 2, 3]);
});

test('take with count larger than iterable', t => {
	t.deepEqual([...take([1, 2], 5)], [1, 2]);
});

test('take with count of 0', t => {
	t.deepEqual([...take([1, 2, 3], 0)], []);
});

test('take with infinite generator', t => {
	function * infiniteNumbers() {
		let index = 0;
		while (true) {
			yield index++;
		}
	}

	t.deepEqual([...take(infiniteNumbers(), 5)], [0, 1, 2, 3, 4]);
});

test('take with empty iterable', t => {
	t.deepEqual([...take([], 3)], []);
});

// --- drop ---

test('drop skips first n items', t => {
	t.deepEqual([...drop([1, 2, 3, 4, 5], 2)], [3, 4, 5]);
});

test('drop with count larger than iterable', t => {
	t.deepEqual([...drop([1, 2], 5)], []);
});

test('drop with count of 0', t => {
	t.deepEqual([...drop([1, 2, 3], 0)], [1, 2, 3]);
});

test('drop with empty iterable', t => {
	t.deepEqual([...drop([], 3)], []);
});

// --- chunk ---

test('chunk groups items', t => {
	t.deepEqual([...chunk([1, 2, 3, 4], 2)], [[1, 2], [3, 4]]);
});

test('chunk with non-even division', t => {
	t.deepEqual([...chunk([1, 2, 3, 4, 5], 2)], [[1, 2], [3, 4], [5]]);
});

test('chunk with size larger than iterable', t => {
	t.deepEqual([...chunk([1, 2], 5)], [[1, 2]]);
});

test('chunk with size of 1', t => {
	t.deepEqual([...chunk([1, 2, 3], 1)], [[1], [2], [3]]);
});

test('chunk with empty iterable', t => {
	t.deepEqual([...chunk([], 2)], []);
});

// --- zip ---

test('zip combines iterables', t => {
	t.deepEqual([...zip([1, 2], ['a', 'b'])], [[1, 'a'], [2, 'b']]);
});

test('zip stops at shortest', t => {
	t.deepEqual([...zip([1, 2, 3], ['a', 'b'])], [[1, 'a'], [2, 'b']]);
});

test('zip with three iterables', t => {
	t.deepEqual(
		[...zip([1, 2], ['a', 'b'], [true, false])],
		[[1, 'a', true], [2, 'b', false]],
	);
});

test('zip with empty iterable', t => {
	t.deepEqual([...zip([1, 2], [])], []);
});

// --- flatten ---

test('flatten one level', t => {
	t.deepEqual([...flatten([[1, 2], [3, 4]])], [1, 2, 3, 4]);
});

test('flatten with nested arrays (depth 1)', t => {
	t.deepEqual([...flatten([[1, [2]], [3]])], [1, [2], 3]);
});

test('flatten with depth 2', t => {
	t.deepEqual([...flatten([[1, [2, [3]]]], 2)], [1, 2, [3]]);
});

test('flatten with depth Infinity', t => {
	t.deepEqual([...flatten([[1, [2, [3, [4]]]]], Infinity)], [1, 2, 3, 4]);
});

test('flatten does not flatten strings', t => {
	t.deepEqual([...flatten([['hello', 'world']])], ['hello', 'world']);
});

test('flatten with empty iterable', t => {
	t.deepEqual([...flatten([])], []);
});

test('flatten with empty nested arrays', t => {
	t.deepEqual([...flatten([[], [1], []])], [1]);
});

// --- unique ---

test('unique removes duplicates', t => {
	t.deepEqual([...unique([1, 2, 2, 3, 3, 3])], [1, 2, 3]);
});

test('unique preserves first occurrence order', t => {
	t.deepEqual([...unique([3, 1, 2, 1, 3])], [3, 1, 2]);
});

test('unique with no duplicates', t => {
	t.deepEqual([...unique([1, 2, 3])], [1, 2, 3]);
});

test('unique with all duplicates', t => {
	t.deepEqual([...unique([1, 1, 1])], [1]);
});

test('unique with empty iterable', t => {
	t.deepEqual([...unique([])], []);
});

test('unique with strings', t => {
	t.deepEqual([...unique(['a', 'b', 'a', 'c'])], ['a', 'b', 'c']);
});

// --- mapAsync ---

test('mapAsync transforms async iterable', async t => {
	async function * generate() {
		yield 1;
		yield 2;
		yield 3;
	}

	const result = [];
	for await (const item of mapAsync(generate(), x => x * 2)) {
		result.push(item);
	}

	t.deepEqual(result, [2, 4, 6]);
});

test('mapAsync with empty async iterable', async t => {
	async function * generate() {
		// Empty
	}

	const result = [];
	for await (const item of mapAsync(generate(), x => x)) {
		result.push(item);
	}

	t.deepEqual(result, []);
});

// --- filterAsync ---

test('filterAsync filters async iterable', async t => {
	async function * generate() {
		yield 1;
		yield 2;
		yield 3;
		yield 4;
	}

	const result = [];
	for await (const item of filterAsync(generate(), x => x % 2 === 0)) {
		result.push(item);
	}

	t.deepEqual(result, [2, 4]);
});

test('filterAsync with async predicate', async t => {
	async function * generate() {
		yield 1;
		yield 2;
		yield 3;
	}

	const result = [];
	for await (const item of filterAsync(generate(), async x => x > 1)) {
		result.push(item);
	}

	t.deepEqual(result, [2, 3]);
});

test('filterAsync with empty async iterable', async t => {
	async function * generate() {
		// Empty
	}

	const result = [];
	for await (const item of filterAsync(generate(), () => true)) {
		result.push(item);
	}

	t.deepEqual(result, []);
});

// --- composition ---

test('composing take and map', t => {
	t.deepEqual([...take(map([1, 2, 3, 4, 5], x => x * 10), 3)], [10, 20, 30]);
});

test('composing filter and map', t => {
	t.deepEqual(
		[...map(filter([1, 2, 3, 4], x => x % 2 === 0), x => x * 10)],
		[20, 40],
	);
});
