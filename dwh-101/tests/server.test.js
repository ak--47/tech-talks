// @ts-nocheck
import { routes } from '../server/server.js'

describe('do tests work?', () => {
	test('a = a', () => {
		expect(true).toBe(true);
	});
});

describe('do routes work?', () => { 
	test('/', async () => { 
		const {statusCode, contentType, content} = await routes('/')
		expect(statusCode).toBe(200)
		expect(contentType).toBe('text/html')
		expect(content.toString().startsWith(`<!DOCTYPE html>`)).toBe(true)
	})

	test('/api', async () => {
		const fakeData = {foo: 'bar'}
		const {statusCode, contentType, content} = await routes('/api', null, null, fakeData)
		expect(statusCode).toBe(200)
		expect(contentType).toBe('application/json')
		expect(JSON.parse(content).yourData).toEqual(fakeData)
		
	})

	test('/up', async () => { 
		const {statusCode, contentType, content} = await routes('/up')
		expect(statusCode).toBe(200)
		expect(contentType).toBe('text/plain')
		expect(content.includes('👋')).toBe(true)
		
	})

	test('404', async () => { 
		const {statusCode, contentType, content} = await routes()
		expect(statusCode).toBe(404)
		expect(contentType).toBe('text/plain')
		expect(content.includes('❌')).toBe(true)
		
	})
})