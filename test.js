/* eslint-env node, mocha */
/* globals run */
/* eslint no-console: "off" */

const System = require('jspm');

System.import('./game_test.js')
.then(() => {
	run();
})
.catch((e) => {
	console.error(e);
});
