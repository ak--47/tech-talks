import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import * as u from 'ak-tools';
// eslint-disable-next-line
import jokeFile from "../storage/jokes.json" assert { type: "json" };

const host = 'localhost';
const port = 8000;


/*
---------------
MAKING A SERVER
---------------
*/

export function bootServer() {
	const server = http.createServer(requestListener);
	server.listen(port, host, () => {
		console.log(`\tserver is running on http://${host}:${port}`);
	});
}

/*
-----------------------------
HANDLING REQUESTS + RESPONSES
-----------------------------
*/

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

/*
-------------------
APPLICATION ROUTES
-------------------
*/

//application routes
export async function routes(url, method, headers, body) {
	let statusCode, content, contentType;

	//serving HTML
	if (url === '/') {
		statusCode = 200;
		contentType = 'text/html';
		content = await fs.readFile(path.resolve("./ui/main.html"));
	}

	//serving CSS
	if (url === '/style.css') {
		statusCode = 200;
		contentType = 'text/css';
		content = await fs.readFile(path.resolve('./ui/style.css'));
	}

	if (url === '/normalize.css') {
		statusCode = 200;
		contentType = 'text/css';
		content = await fs.readFile(path.resolve('./ui/normalize.css'));
	}

	//serving JAVASCRIPT
	if (url === '/interactivity.js') {
		statusCode = 200;
		contentType = 'text/javascript';
		content = await fs.readFile(path.resolve('./ui/interactivity.js'));
	}

	//serving JSON
	if (url === '/api') {
		statusCode = 200;
		const apiData = { myData: { foo: { bar: { baz: ['qux', 'mux', 'dux'] } } }, yourData: body || {} };
		contentType = 'application/json';
		content = u.json(apiData);

	}

	//serving icons
	if (url === '/favicon.ico') {
		statusCode = 200;
		contentType = 'image/x-icon';
		content = await fs.readFile(path.resolve('./ui/favicon.ico'));
	}

	//serving TEXT
	if (url === '/up') {
		statusCode = 200;
		contentType = `text/plain`;
		content = `👋 yep, i'm alive! 🎉`;
	}

	//serving dynamic content
	if (method === 'POST' && url === '/tell-joke') {
		({ statusCode, contentType, content } = await jokeGetter(body));
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

/*
------------------------
FETCHING DYNAMIC CONTENT
------------------------
*/

async function jokeGetter(body) {
	const filters = u.objDefault(body.filters, { rating: 'G', dark: true, long: false, vibe: 'positive' });
	const validFilters = ['rating', 'dark', 'long', 'vibe'];

	//make sure only valid filters are included
	for (const key in filters) {
		if (!validFilters.includes(key)) delete filters[key];
	}

	const apiVersion = body.version || 1;
	let joke;
	if (apiVersion === 1) {
		joke = getAJoke(filters);
	}

	if (apiVersion === 2) {
		joke = getAJokeFromFile(filters);
	}

	return {
		statusCode: 200,
		contentType: 'application/json',
		content: joke
	};
}

// v1: just put it in code
//this is bad... don't do this
function getAJoke(filters) {
	const possibleJokes = [];
	for (const joke of jokes) {
		let matchedFilters = 0;

		for (const filter in filters) {
			if (joke[filter] === filters[filter]) {
				matchedFilters++;
			}

		}

		if (matchedFilters === 4) {
			possibleJokes.push(joke);
		}
	}
	if (possibleJokes.length === 0) {
		return JSON.stringify({
			"text": "oops... i can't find a joke which matches that criteria",
		});
	}
	const randomJoke = possibleJokes[u.rand(0, possibleJokes.length - 1)];
	return JSON.stringify(randomJoke);
}
const jokes =
	[
		{
			"text": "My wife told me to stop impersonating a flamingo. I had to put my foot down.",
			"rating": "G",
			"dark": false,
			"long": false,
			"vibe": "positive"
		},
		{
			"text": "I went to buy some camo pants but couldn't find any.",
			"rating": "G",
			"dark": false,
			"long": false,
			"vibe": "positive"
		},
		{
			"text": "I failed math so many times at school, I can't even count.",
			"rating": "G",
			"dark": true,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "I used to have a handle on life, but then it broke.",
			"rating": "R",
			"dark": true,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "I was wondering why the frisbee kept getting bigger and bigger, but then it hit me.",
			"rating": "G",
			"dark": false,
			"long": false,
			"vibe": "positive"
		},
		{
			"text": "I heard there were a bunch of break-ins over at the car park. That is wrong on so many levels.",
			"rating": "R",
			"dark": true,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "I want to die peacefully in my sleep, like my grandfather… Not screaming and yelling like the passengers in his car.",
			"rating": "R",
			"dark": true,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "When life gives you melons, you might be dyslexic.",
			"rating": "R",
			"dark": false,
			"long": false,
			"vibe": "positive"
		},
		{
			"text": "Don't you hate it when someone answers their own questions? I do.",
			"rating": "G",
			"dark": false,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "It takes a lot of balls to golf the way I do.",
			"rating": "R",
			"dark": true,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "What do you call a cow with no legs?\r\n\r\nGround Beef!",
			"rating": "G",
			"dark": false,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "What do you call a cow jumping over a barbed wire fence?\r\n\r\nUtter destruction.",
			"rating": "R",
			"dark": true,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "What's black and white and red all over?\r\n\r\nA newspaper.",
			"rating": "R",
			"dark": false,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "So, this guy walks into a bar.\r\n\r\nAnd says, \"ouch\".",
			"rating": "G",
			"dark": true,
			"long": false,
			"vibe": "positive"
		},
		{
			"text": "If the opposite of pro is con, isn't the opposite of progress, congress?",
			"rating": "R",
			"dark": true,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "What do you call a guy with no arms or legs floating in the ocean?\r\n\r\nBob!",
			"rating": "G",
			"dark": true,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "I went to a wedding the other day.  Two antennas were getting married.  It wasn't much of a wedding ceremony, but it was one heck of a reception!",
			"rating": "G",
			"dark": false,
			"long": false,
			"vibe": "positive"
		},
		{
			"text": "There's this dyslexic guy... he walked into a bra...",
			"rating": "R",
			"dark": true,
			"long": false,
			"vibe": "positive"
		},
		{
			"text": "Joel: \"How's the progress on new house that you are building Pete?\"\r\nPeter: \"Things are really slow at the moment.\"\r\nJoel: \"Yeah, I guess all this rain would be putting a dampener on things...\"",
			"rating": "R",
			"dark": false,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "A white horse walked into a bar.  The barman saw him and said,  \"We have a whiskey named after you!\"\r\n\r\nThe horse looked puzzled and said, \"What, Eric?\"",
			"rating": "R",
			"dark": true,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "There was a dyslexic insomniac agnostic.\r\n\r\nHe laid awake all night wondering if there really was a Dog.",
			"rating": "G",
			"dark": true,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "What do you call 500 lawyers at the bottom of the sea?\r\n\r\nA start.",
			"rating": "R",
			"dark": true,
			"long": false,
			"vibe": "positive"
		},
		{
			"text": "What's the difference between a bad golfer and a bad skydiver?\r\n\r\nA bad golfer goes whack, dang. A bad skydiver goes dang, whack.",
			"rating": "R",
			"dark": false,
			"long": false,
			"vibe": "positive"
		},
		{
			"text": "Saddam Hussein was sitting in his office wondering who to invade next when his telephone rang. \r\n\r\n\"Hallo! Mr. Hussein,\" a heavily accented voice said. \"This is Paddy up in County Cavan, Ireland. I am ringing to inform you that we are officially declaring war on you!\" \r\n\r\n\"Well, Paddy,\" Saddam replied, \"this is indeed important news! Tell me, how big is your army?\" \r\n\r\n\"At this moment in time,\" said Paddy after a moment's calculation, \"there is myself, my cousin Sean, my next door neighbor Gerry, and the entire dominoes team from the pub-that makes 8!\" \r\n\r\nSaddam sighed. \"I must tell you Paddy that I have 1 million men in my army waiting to move on my command.\" \r\n\r\n\"Begorra!\" said Paddy, \"I'll have to ring you back!\" \r\n\r\nSure enough, the next day Paddy rang back. \"Right Mr. Hussein, the war is still on! We have managed to acquire some equipment!\" \r\n\r\n\"And what equipment would that be, Paddy?\" Saddam asked. \r\n\r\n\"Well, we have 2 combine harvesters, a bulldozer and Murphy's tractor from the farm.\" \r\n\r\nOnce more Saddam sighed. \"I must tell you, Paddy, that I have 16 thousand tanks, 14 thousand armored personnel carriers, and my army has increased to 1 and a half million since we last spoke.\" \r\n\r\n\"Really?\" said Paddy \"I'll have to ring you back!\" \r\n\r\nSure enough, Paddy rang again the next day. \"Right Mr. Hussein, the war is still on! We have managed to get ourselves airborne! We've modified Ted's ultralight with a couple of rifles in the cockpit and the bridge team has joined us as well!\" \r\n\r\nSaddam was silent for a minute, then sighed. \"I must tell you Paddy that I have a thousand bombers, 500 MiG 19 attack planes, my military complex is surrounded by laser-guided surface-to-air missile sites, and since we last spoke, my army has increased to 2 million.\" \r\n\r\n\"Faith and begorra!\" said Paddy, \"I'll have to ring you back.\" \r\n\r\nSure enough, Paddy called again the next day. \"Right Mr. Hussein, I am sorry to tell you that we have had to call off the war.\" \r\n\r\n\"I'm sorry to hear that,\" said Saddam. \"Why the sudden change of heart?\" \r\n\r\n\"Well,\" said Paddy \"We've all had a chat, and there's no way we can feed 2 million prisoners.\"",
			"rating": "G",
			"dark": true,
			"long": true,
			"vibe": "positive"
		},
		{
			"text": "A little old lady goes to the doctor and says, \"Doctor I have this problem with wind, but it really doesn't bother me too much because they never smell and are always silent.\"\r\n\r\n\"As a matter of fact, I've farted at least 20 times since I've been here in your office.\" The doctor says, \"I see, take these pills and come back to see me next week.\" \r\n\r\nThe next week the lady goes back to his office. \"Doctor,\" she says, \"I don't know what you gave me, but now my farts, although still silent, stink terribly!\" \r\n\r\nThe doctor says, \"Good, Now that we've cleared up your sinuses, let's work on your hearing.\"",
			"rating": "G",
			"dark": false,
			"long": true,
			"vibe": "cynical"
		},
		{
			"text": "Do infants enjoy infancy as much as adults enjoy adultery?",
			"rating": "R",
			"dark": true,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "If a pig loses its voice, is it disgruntled?",
			"rating": "R",
			"dark": false,
			"long": false,
			"vibe": "cynical"
		},
		{
			"text": "Saddam Hussein and George W. Bush meet up in Baghdad for the first round of talks in a new peace process. When George sits down, he notices three buttons on the side of Saddam's chair.\r\n\r\nThey begin talking. After about five minutes, Saddam presses the first button. A boxing glove springs out of a box on the desk and punches Bush in the face.\r\n\r\nConfused, Bush carries on talking as Saddam laughs. A few minutes later, the second button is pressed. This time a big boot comes out and kicks Bush in the shin. Again Saddam laughs, and again Bush carries on talking, not wanting to put off the bigger issue of peace between the two countries.\r\n\r\nBut when the third button is pressed and another boot comes out and kicks Bush in the privates, he's finally had enough, knowing that he can't do much without them functioning well.\r\n\r\n\"I'm going back home!\" he tells the Iraqi. \"We'll finish these talks in two weeks!\"\r\n\r\nA fortnight passes and Saddam flies to the United States for talks. As the two men sit down, Hussein notices three buttons on Bush's chair and prepares himself for the Yank's revenge.\r\n\r\nThey begin talking and George presses the first button. Saddam ducks, but nothing happens. Bush snickers. A few seconds later he presses the second button. Saddam jumps up, but again nothing happens. Bush roars with laughter. When the third button is pressed, Saddam jumps up again, and again nothing happens. Bush falls on the floor in a fit of hysterics.\r\n\r\n\"Forget this,\" says Saddam. \"I'm going back to Baghdad!\" Bush says through tears of laughter, \"What Baghdad?\"",
			"rating": "R",
			"dark": false,
			"long": true,
			"vibe": "cynical"
		},
		{
			"text": "During the wedding rehearsal, the groom approached the pastor with an unusual offer. \"Look, I'll give you $100 if you'll change the wedding vows. When you get to me and the part where I'm to promise to 'love, honour and obey' and 'forsaking all others, be faithful to her forever,' I'd appreciate it if you'd just leave that part out.\" He passed the minister a $100 bill and walked away satisfied.\r\nIt is now the day of the wedding, and the bride and groom have moved to that part of the ceremony where the vows are exchanged. When it comes time for the groom's vows, the pastor looks the young man in the eye and says:\r\n\"Will you promise to prostrate yourself before her, obey her every command and wish, serve her breakfast in bed every morning of your life and swear eternally before God and your lovely wife that you will not ever even look at another woman, as long as you both shall live?\"\r\nThe groom gulped and looked around, and said in a tiny voice, \"Yes.\"\r\nThe groom leaned toward the pastor and hissed, \"I thought we had a deal.\"\r\nThe pastor put the $100 bill into his hand and whispered back, \"She made me a much better offer.\"",
			"rating": "R",
			"dark": false,
			"long": true,
			"vibe": "cynical"
		},
		{
			"text": "Doctor: Well I hope you enjoy changing diapers, Mrs Jones?\r\nMrs Jones: Why, Am I pregnant?\r\nDoctor: No, you have bowel cancer!",
			"rating": "G",
			"dark": false,
			"long": false,
			"vibe": "cynical"
		}
	];




//v2: put jokes in a separate file
// this is better but still not great...
function getAJokeFromFile(filters) {
	let joke;
	const filterList = Object.entries(filters);
	const possibleJokes = jokeFile.filter(joke => {
		const includeJoke = filterList.every(filter => {
			return joke[filter[0]] === filter[1];
		});
		return includeJoke;
	});

	if (possibleJokes.length === 0) {
		return JSON.stringify({
			"text": "oops... i can't find a joke which matches that criteria",
		});
	}

	joke = possibleJokes[u.rand(0, possibleJokes.length - 1)];
	return JSON.stringify(joke);

}


/*
--------------------
HANDLING USER INPUT
--------------------
*/

