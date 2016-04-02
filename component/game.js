export class Game {

	constructor(player1, player2) {
		this.player1 = player1; // user
		this.player2 = player2; // computer
		this.board = new Array(9);
	}

	/*
	* player1 plays.
	*/
	play(index) {
		if (index < 0 || index > 9) {
			throw new Error('bad move');
		} else if (this.board[index] !== undefined) {
			throw new Error('bad move');
		}

		this.board[index] = this.player1;
		return this.winner();
	}

	/*
	* player plays.
	*/
	guess(player) {
		if (player !== this.player1 && player !== this.player2) {
			throw new Error('unknown player');
		}

		let opponent = this.player2;
		if (player === this.player2) {
			opponent = this.player1;
		}

		return new Promise((resolve, reject) => {
			const moves = Game.spaces(this.board);

			if (moves.length === 0) {
				reject('game over');
			} else if (moves.length >= 8 || moves.length === 1) {
				const index = moves[0];
				this.board[index] = player;
				resolve(index);
			} else {
				const board = Array.from(this.board);
				const [, move] = this.mmax(board, player, opponent, 1);

				this.board[move] = player;
				resolve(move);
			}
		});
	}

	/*
	* spaces returns indexes of board undefined values.
	*
	*  0 1 2
	*  3 4 5
	*  6 7 8
	*/
	static spaces(board) {
		return [4, 0, 2, 8, 6, 1, 5, 7, 3].filter(value =>
			board[value] === undefined
		);
	}

	/*
	* count returns a counter map of values in diag.
	*/
	static count(board, diag) {
		const counter = new Map();
		for (const pos of diag) {
			const key = board[pos];
			let value = counter.get(key);
			if (value === undefined) {
				value = 0;
			}
			counter.set(key, value + 1);
		}
		return counter;
	}

	static diags() {
		return [
			[0, 1, 2], [3, 4, 5], [6, 7, 8],
			[0, 3, 6], [1, 4, 7], [2, 5, 8],
			[0, 4, 8], [6, 4, 2],
		];
	}

	/*
	* winner returns the winner player or undefined.
	*/
	winner(...args) {
		const [board = this.board] = args;
		for (const diag of Game.diags()) {
			const counter = Game.count(board, diag);
			if (counter.get(this.player1) === 3) {
				return this.player1;
			} else if (counter.get(this.player2) === 3) {
				return this.player2;
			}
		}
		return undefined;
	}

	/*
	* calc evaluates the player's score.
	*/
	calc(board, player, depth) {
		let score = 0;
		const winner = this.winner(board);
		if (winner === player) {
			score = (10 - depth) * 1000;
		} else if (winner !== undefined) {
			score = (depth - 10) * 1000;
		}
		return score;
	}

	/*
	* calc2 evaluates the player's score.
	*/
	static calc2(board, move) {
		const player = board[move];
		let score = 0;

		for (const diag of Game.diags()) {
			if (diag.indexOf(move) === -1) {
				continue;
			}
			const counter = Game.count(board, diag);
			const cp = counter.get(player);
			const cb = counter.get(undefined);

			if (cp === 2 && cb === 1) {
				// X X _
				score += 50;
			} else if (cp === 1 && cb === 2) {
				// X _ _
				score += 10;
			} else if (cp === 1 && cb === 1) {
				// X O _
				score += 20;
			} else if (cp === 1 && cb === 0) {
				// X O O
				score += 100;
			}
		}
		return score;
	}

	// player1 move
	mmax(board, player1, player2, depth) {
		let bestMove = -1;
		let bestScore = Number.MIN_SAFE_INTEGER;
		const moves = Game.spaces(board);

		for (const move of moves) {
			board[move] = player1;
			let score = bestScore;

			if (moves.length === 1 || this.winner(board)) {
				score = this.calc(board, player1, depth);
			} else {
				[score] = this.mmin(board, player2, player1, depth + 1);
			}

			if (depth === 1) {
				score += Game.calc2(board, move);
			}
			board[move] = undefined;

			if (score > bestScore) {
				bestScore = score;
				bestMove = move;
			}
		}

		return [bestScore, bestMove];
	}

	// player2 move
	mmin(board, player1, player2, depth) {
		let bestMove = -1;
		let bestScore = Number.MAX_SAFE_INTEGER;
		const moves = Game.spaces(board);

		for (const move of moves) {
			board[move] = player1;
			let score = bestScore;

			if (moves.length === 1 || this.winner(board)) {
				score = this.calc(board, player2, depth);
			} else {
				[score] = this.mmax(board, player2, player1, depth + 1);
			}
			board[move] = undefined;

			if (score < bestScore) {
				bestScore = score;
				bestMove = move;
			}
		}

		return [bestScore, bestMove];
	}

	toString() {
		return Game.print(this.board);
	}

	static print(board) {
		let s = '';
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 3; x++) {
				let value = board[y * 3 + x];
				if (value === undefined) {
					value = ' ';
				}
				s += ` ${value} `;
			}
			s += (y < 2) ? '\n' : '';
		}
		return s;
	}
}
