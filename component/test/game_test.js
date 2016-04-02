/* eslint-env mocha */
/* eslint no-console: "off" */

import { Game } from 'component/game.js';

const PLAYER = 'O';
const OPPONENT = 'X';

function play(game, player) {
	const start = Date.now();
	return game.guess(player)
	.then(() => game.winner())
	.then(winner => {
		console.log(game.toString());
		const end = Date.now() - start;
		console.log(`--------- ${end}`);

		if (winner) {
			console.log(`${winner} win`);
			return winner;
		}
		return play(game, (player === PLAYER) ? OPPONENT : PLAYER);
	});
}

describe('Game', () => {
	it('should stale', () => {
		const game = new Game(PLAYER, OPPONENT);
		return play(game, PLAYER)
		.then((winner) => {
			throw new Error(`${winner} win`);
		})
		.catch(err => {
			console.error(err);
			const expected = ['X', 'X', 'O', 'O', 'O', 'X', 'X', 'O', 'O'];
			if (game.board.join(',') !== expected.join(',')) {
				throw new Error(`want: ${expected}, got:  ${game.board}`);
			}
		});
	});
	it('X should win', () => {
		const game = new Game(PLAYER, OPPONENT);
		const und = undefined;
		game.board = [
			und, und, und,
			'0', 'X', und,
			und, und, und,
		];
		return play(game, OPPONENT)
		.then((winner) => {
			if (winner !== 'X') {
				throw new Error(`${winner} win`);
			}
		})
		.catch(err => {
			throw new Error(err);
		});
	});
});
