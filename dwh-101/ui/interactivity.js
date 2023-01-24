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
			toggles: Array.from(qsa('fieldset input')),
			printedJokes: qs('ul')
		};
		this.DOM = elements;
		return elements;
	},
	DOM: {},
	
	bindInteractions: function () {
		this.DOM.sendJokeButton.addEventListener('click', () => { this.sendJoke(); });
		this.DOM.getJokeButton.addEventListener('click', () => { this.getJoke(); });
		this.DOM.toggles.forEach(element => {
			element.addEventListener('click', this.toggleFilter);
		});

	},

	toggleFilter: function (click) {
		const toggle = click.target;
		const checkbox = toggle.id;
		const label = toggle.nextElementSibling
		const currentLabel = label.textContent

		const labels = {
			dark: ['light', 'dark'],
			vibe: ['positive', 'cynical'],
			emoji: ['yes emoji', 'no emoji'],
			long: ['short form', 'long form']

		};
		const newLabel = labels[checkbox].slice().filter(label => label !== currentLabel).pop();
		label.textContent = newLabel;
		
		// light dark/mode
		if (checkbox === 'dark') {
			app.DOM.main.setAttribute('data-theme', newLabel)
		}

	},


	getJoke: function () {
		log('get joke');
	},
	sendJoke: function () {
		log('send joke');
	}
};


//bootstrap
app.init(); // 😎




