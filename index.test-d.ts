import {expectType, expectError} from 'tsd';
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

expectType<Generator<number>>(map([1, 2, 3], x => x * 2));
expectType<Generator<string>>(map([1, 2, 3], String));
expectType<Generator<number>>(filter([1, 2, 3], x => x > 1));
expectType<Generator<number>>(take([1, 2, 3], 2));
expectType<Generator<number>>(drop([1, 2, 3], 1));
expectType<Generator<number[]>>(chunk([1, 2, 3], 2));
expectType<Generator<unknown[]>>(zip([1, 2], ['a', 'b']));
expectType<Generator>(flatten([[1, 2], [3, 4]]));
expectType<Generator<number>>(unique([1, 2, 2, 3]));

async function * generate(): AsyncGenerator<number> {
	yield 1;
	yield 2;
}

expectType<AsyncGenerator<number>>(mapAsync(generate(), x => x * 2));
expectType<AsyncGenerator<number>>(filterAsync(generate(), x => x > 1));

expectError(map(123, x => x));
expectError(filter(123, x => x));
