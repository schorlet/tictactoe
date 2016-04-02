/* eslint-env: browser */
/* eslint-env mocha */

import { TicTacToe } from './tictactoe.js';
document.registerElement('tic-tac-toe', TicTacToe);

mocha.setup({ ui: 'bdd' });

describe('TicTacToe', () => {
	let xFoo = undefined;
	let cells = undefined;

	before(() => {
		xFoo = document.createElement('tic-tac-toe');
		xFoo.style.width = '200px';
		xFoo.style.height = '200px';

		cells = xFoo.shadowRoot.querySelectorAll('.board_inner > div');
		document.body.appendChild(xFoo);

		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 300);
		});
	});

	after(() => {
		document.body.removeChild(xFoo);
	});

	it('should work', () => {
		if (xFoo.tagName.toLowerCase() !== 'tic-tac-toe') {
			throw new Error('bad tagName');
		}
	});

	it('plays X4/O0', () =>
		xFoo.play(4)
		.then(() => {
			if (cells[4].innerText === '') {
				throw new Error('cells[4] is empty');
			}
			if (cells[0].innerText === '') {
				throw new Error('cells[0] is empty');
			}
		})
	);

	it('plays X5/O3', () => {
		cells[5].click();
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (cells[5].innerText === '') {
					reject('cells[5] is empty');
				}
				if (cells[3].innerText === '') {
					reject('cells[3] is empty');
				}
				resolve();
			}, 200);
		});
	});

	it('plays X7/O6', () =>
		xFoo.play(7)
		.then(() => {
			if (cells[7].innerText === '') {
				throw new Error('cells[7] is empty');
			}
			if (cells[6].innerText === '') {
				throw new Error('cells[6] is empty');
			}
		})
	);

	it('O should win', () => {
		if (xFoo.winner !== 'O') {
			throw new Error('O should have won');
		}
	});

	it('X should not be able to click', () => {
		cells[1].click();
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (cells[1].innerText === '') {
					resolve();
				} else {
					reject('cells[1] is not empty');
				}
			}, 100);
		});
	});

	it('X should not be able to play', () =>
		xFoo.play(1)
		.then(() => {
			throw new Error('X has played');
		})
		.catch(() => null)
	);
});

describe('TicTacToe x10', () => {
	for (let i = 0; i < 10; i++) {
		it('should run', () => {
			const xFoo = document.createElement('tic-tac-toe');
			xFoo.style.width = '200px';
			xFoo.style.height = '200px';
			document.body.appendChild(xFoo);
			xFoo.play(i % 9);

			return new Promise((resolve) => {
				setTimeout(() => {
					document.body.removeChild(xFoo);
					resolve();
				}, 300);
			});
		});
	}
});

window.addEventListener('WebComponentsReady', () => {
	// imports are loaded and elements have been registered
	// console.log('Components are ready');
	mocha.checkLeaks();
	mocha.run();
});
