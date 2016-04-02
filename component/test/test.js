/* eslint-env mocha */
/* globals run */
/* eslint no-console: "off" */

const System = require('jspm');

System.import('component/test/game_test.js')
.then(() => {
	run();
})
.catch((e) => {
	console.error(e);
});
