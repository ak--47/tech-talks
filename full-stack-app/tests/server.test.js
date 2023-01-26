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

	test('/style.css', async ()=>{
		const {statusCode, contentType, content} = await routes('/style.css')
		expect(statusCode).toBe(200)
		expect(contentType).toBe('text/css')
	})

	test('/interactivity.js', async ()=>{
		const {statusCode, contentType, content} = await routes('/interactivity.js')
		expect(statusCode).toBe(200)
		expect(contentType).toBe('text/javascript')
	})

	test('/favicon.ico', async ()=>{
		const {statusCode, contentType, content} = await routes('/favicon.ico')
		expect(statusCode).toBe(200)
		expect(contentType).toBe('image/x-icon')
		
	})
	
	test('/tell-joke', async () => { 
		const {statusCode, contentType, content} = await routes('/tell-joke', 'POST', null, {})
		const joke = JSON.parse(content)
		expect(statusCode).toBe(200)
		expect(contentType).toBe('application/json')
		expect(joke.text.length).toBeGreaterThan(1)
		expect(joke.rating).toBe('G')
		expect(joke.dark).toBe(true)
		expect(joke.long).toBe(false)
		expect(joke.vibe).toBe('positive')
		
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