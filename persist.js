const config  = require("./config.json");
const persist = require('node-persist');

persist.initSync({
	dir: config.node_persist_path
});

persist.get('countdowns').then((countdowns) => {
	console.log(`Init countdowns value: ` + countdowns);

	if(countdowns === undefined) {

		persist.set('countdowns', {}).then(function() {
			console.log(`Init countdowns value was undefined, initialized to {}`);
		})

	}
});

persist.get('bakas').then((bakas) => {
	console.log(`Init bakas value: ` + bakas);

	if(bakas === undefined) {

		persist.set('bakas', []).then(function() {
			console.log(`Init bakas value was undefined, initialized to []`);
		})

	}
});

exports.persist = persist;
