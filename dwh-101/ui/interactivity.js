console.log('\n\t\tthe app hath loaded!\n\n');

// shortcuts
const qs = document.querySelector.bind(document);
const qsa = document.querySelectorAll.bind(document);
const log = console.log;

// main
const app = {
	init: function () {
		this.cacheDOM();
		this.bindInteractions();
	},


	cacheDOM: function () {
		const elements = {
			main: qs('main'),
			userInput: qs('#user-content'),
			sendJokeButton: qs('#send'),
			getJokeButton: qs('#suggest'),
			clearJokes: qs('#clearJokes'),
			toggles: Array.from(qsa('fieldset input')),
			printedJokes: qs('ul'),
			versionSlider: qs('#version'),
			versionLabel: qs('#versionLabel'),
			ratingTemplate: qs('#ratingTemplate'),
			ratings: []
		};
		this.DOM = elements;
		return elements;
	},
	DOM: {},

	bindInteractions: function () {
		// clicks
		this.DOM.sendJokeButton.addEventListener('click', () => { this.sendJoke(); });
		this.DOM.getJokeButton.addEventListener('click', () => { this.getJoke(); });

		// toggles
		this.DOM.toggles.forEach(element => {
			element.addEventListener('click', this.toggleFilter);
		});

		// slider
		this.DOM.versionSlider.addEventListener('change', () => {
			this.updateSlider();
		});

		// clear
		this.DOM.clearJokes.addEventListener('click', () => {
			this.DOM.printedJokes.innerHTML = "";
			this.DOM.clearJokes.disabled = true;
		});
	},
	bindRatings: function (ratingsWidget) {
		const reactions = Array.from(ratingsWidget.querySelectorAll('span'));

		reactions.forEach((rating) => {
			rating.addEventListener('click', (click) => {
				click.target.parentElement.style.display = 'none';
			});
		});
	},

	toggleFilter: function (click) {
		const toggle = click.target;
		const checkbox = toggle.id;
		const label = toggle.nextElementSibling;
		const currentLabel = label.textContent;

		const labels = {
			dark: ['light', 'dark'],
			vibe: ['positive', 'cynical'],
			rating: ['G', 'R'],
			long: ['short form', 'long form']

		};
		const newLabel = labels[checkbox].slice().filter(label => label !== currentLabel).pop();
		label.textContent = newLabel;

		// light dark/mode
		if (checkbox === 'dark') {
			app.DOM.main.setAttribute('data-theme', newLabel);
		}

	},

	updateSlider: function () {
		this.DOM.versionLabel.textContent = this.DOM.versionSlider.value;
	},


	getJoke: async function () {
		log('get joke');
		const toggles = this.DOM.toggles.map(a => { return { [a.id]: a.nextElementSibling.textContent }; });
		const filters = toObject(toggles);
		if (filters.dark === 'dark') filters.dark = true;
		else if (filters.dark === 'light') filters.dark = false;

		if (filters.long.includes('long')) filters.long = true;
		else if (filters.long.includes('short')) filters.long = false;

		const version = Number(this.DOM.versionSlider.value);

		const request = await fetch('./tell-joke', { method: "POST", body: JSON.stringify({ version, filters }) });
		const response = await request.json();
		this.renderJoke(response);

	},
	renderJoke: function (joke = { text: 'oops... something failed' }) {
		this.DOM.clearJokes.disabled = false;

		const jokeEl = document.createElement('li');
		// @ts-ignore
		const jokeText = joke.text.replaceAll("\n", "<br/>").replaceAll("\t", "    ");
		jokeEl.innerHTML = jokeText;

		const ratingWidget = this.DOM.ratingTemplate.content.cloneNode(true);
		this.DOM.ratings.push(ratingWidget);
		this.bindRatings(ratingWidget);

		jokeEl.appendChild(ratingWidget);


		this.DOM.printedJokes.prepend(jokeEl);
	},
	sendJoke: function () {
		log('send joke');
	}
};


//bootstrap
app.init(); // 😎


//helpers
function toObject(arr) {
	let result = {};
	for (const thing of arr) {
		result = { ...thing, ...result };
	}
	return result;
}

