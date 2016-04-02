/* eslint-env: browser */

import 'webcomponents.js';

import { Game } from 'component/game.js';
import template from 'component/tictactoe.html!text';

export class TicTacToe extends HTMLElement {
	createdCallback() {
		this.player1 = 'X'; // &#10060;
		this.player2 = 'O';

		this.createShadowRoot().innerHTML = template;
	}

	attachedCallback() {
		this.game = new Game(this.player1, this.player2);

		const cells = this.shadowRoot.querySelectorAll('.board_inner > div');
		this.cells = Array.from(cells);

		this.cells.forEach((div, index) => {
			div.innerHTML = '';
			div.onmouseover = this.onmouseover;
			div.onmouseout = this.onmouseout;
			div.onclick = this.onclick.bind(this);
			div.setAttribute('index', index);
		});
	}

	detachedCallback() {
		this.cells.forEach((div) => {
			div.onmouseover = undefined;
			div.onmouseout = undefined;
			div.onclick = undefined;
		});
		this.cells = undefined;
		this.game = undefined;
	}

	onmouseover() {
		if (this.innerHTML !== '') {
			return;
		}
		this.setAttribute('o', 'o');
		this.innerHTML = '&#10060;';
	}

	onmouseout() {
		if (this.hasAttribute('o')) {
			this.removeAttribute('o');
			this.innerHTML = '';
		}
	}

	onclick(e) {
		e.target.removeAttribute('o');
		const index = parseInt(e.target.getAttribute('index'), 10);
		this.play(index);
	}

	play(index1) {
		if (this.winner) {
			return Promise.reject('game ended');
		}

		this.cells[index1].innerHTML = '&#10060;'; // player1
		this.winner = this.game.play(index1);
		if (this.winner) {
			return Promise.resolve();
		}

		return this.game.guess(this.player2)
		.then((index2) => {
			this.cells[index2].innerHTML = this.player2;
			this.winner = this.game.winner();
		});
	}

	set winner(value) {
		if (value === undefined) {
			return;
		}
		this.cells.forEach((div) => {
			div.onmouseover = undefined;
			div.onmouseout = undefined;
			div.onclick = undefined;
		});
	}

	get winner() {
		return this.game.winner();
	}
}
