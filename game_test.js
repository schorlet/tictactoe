/* eslint-env mocha */
/* eslint no-console: "off" */

import { Game } from './game.js';

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
		play(game, PLAYER)
		.then((winner) => {
			throw new Error(`${winner} win`);
		})
		.catch(err => {
			console.error(err);
		});
	});
});
