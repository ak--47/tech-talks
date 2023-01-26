// @ts-nocheck
import main from '../index.js';
import queryDb from '../fakeSQL.js';

describe('do tests work?', () => {
	test('a = a', () => {
		expect(true).toBe(true);
	});
});


describe('can query', () => {
	test('main', async () => {
		const query = await main();
		expect(query.length).toBe(2);
	});

	test('query', async () => {
		const query = await queryDb('SELECT * LIMIT 2 WHERE PG');
		expect(query.length).toBe(2);
	});
});