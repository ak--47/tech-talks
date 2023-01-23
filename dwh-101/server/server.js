import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import * as u from 'ak-tools';


const host = 'localhost';
const port = 8000;

export function bootServer() {
	const server = http.createServer(requestListener);
	server.listen(port, host, () => {
		console.log(`\tserver is running on http://${host}:${port}`);
	});
}

//request handler
async function requestListener(request, response) {
	// http request body is a stream; we have to serialize it in chunks
	let body = ``;
	request.on('data', function (chunk) {
		body += chunk;
	});

	// once we have the whole body, we can respond!
	request.on('end', async () => {

		//construct the response
		body = u.isJSONStr(body) ? JSON.parse(body) : body;
		const asset = await routes(request.url, request.method, request.headers, body);

		// respond to the client!
		response.writeHead(asset.statusCode, { 'Content-Type': asset.contentType });
		response.end(asset.content);
	});

}


//application routes
export async function routes(url, method, headers, body) {
	let statusCode, content, contentType;

	//serving HTML
	if (url === '/') {
		statusCode = 200;
		contentType = 'text/html';
		content = await fs.readFile(path.resolve("./ui/main.html"));
	}

	//serving JSON
	if (url === '/api') {
		statusCode = 200;
		const apiData = { myData: { foo: { bar: { baz: ['qux', 'mux', 'dux'] } } }, yourData: body || {} };
		contentType = 'application/json';
		content = u.json(apiData);

	}

	//serving TEXT
	if (url === '/up') {
		statusCode = 200;
		contentType = `text/plain`;
		content = `👋 yep, i'm alive! 🎉`;
	}

	//serving 404! 
	if (!statusCode || !content || !contentType) {
		statusCode = 404,
			content = `❌ i couldn't find the endpoint\n\n\t${url}\n\nsorry!!!`,
			contentType = `text/plain`;
	}

	return {
		statusCode,
		content,
		contentType
	};
}
