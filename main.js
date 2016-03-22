/* eslint no-console: "off" */

import { Game } from './game.js';

class App {
	constructor() {
		this.player1 = 'X'; // &#10060;
		this.player2 = 'O';
	}

	start() {
		this.game = new Game(this.player1, this.player2);
		this.cells = [];

		const cells = document.querySelectorAll('.board_inner > div');
		Array.from(cells).forEach((div, index) => {
			div.innerHTML = '';
			div.onmouseover = this.onmouseover;
			div.onmouseout = this.onmouseout;
			div.onclick = this.onclick.bind(this);
			div.setAttribute('index', index);
			this.cells.push(div);
		});
	}

	onmouseover() {
		if (this.innerHTML !== '') {
			return;
		}
		this.setAttribute('o', 'o');
		this.innerHTML = '&#10060;';
	}

	onmouseout() {
		if (this.getAttribute('o')) {
			this.removeAttribute('o');
			this.innerHTML = '';
		}
	}

	onclick(e) {
		e.target.removeAttribute('o');
		const index = parseInt(e.target.getAttribute('index'), 10);
		this.play(index)
		.then(() => {
			this.winner = this.game.winner();
		});
	}

	play(index1) {
		this.cells[index1].innerHTML = '&#10060;'; // player1
		this.winner = this.game.play(index1);

		return this.game.guess(this.player2)
		.then((index2) => {
			this.cells[index2].innerHTML = this.player2;
		})
		.catch((err) => {
			console.error(err);
		});
	}

	set winner(value) {
		if (value === undefined) {
			return;
		}
		console.log(`${value} win`);
		this.cells.forEach((div) => {
			div.onmouseover = undefined;
			div.onmouseout = undefined;
			div.onclick = undefined;
		});
	}
}

const app = new App();
app.start();

