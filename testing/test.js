const readline = require('readline');
const fs       = require('fs');


/**
 * ## Stup Readline
*/
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.lock = false;

rl.on('line', async input => {

	if (rl.lock) return;
	rl.lock = true;

	command = input.split(' ');

	switch (command[0]) {

		case 'run'  : await run(command[1]); break;
		case 'list' : list();                break;
		case 'help' : help();								 break;
		case 'quit' : quit();								 break;
		default     : print_usage();

	}

	rl.lock = false;

});

/**
 * ## Print a welcome message
*/

console.log('This is the tesing program. Use the `help` command to see your options.');

/**
 * ## Functions
*/

async function run (test_name) {

	console.log(`\nStarting test: ${test_name}`);
	
	try {
		await require(`./tests/${test_name}`)();
	} catch (err) {
		
		if (err.code == 'MODULE_NOT_FOUND') {
			console.log('\nERROR: That test doesn\'t exists.\n');
		} else if (err instanceof TypeError) {
			console.log('\nERROR: This test was improperly set-up.\n');
		} else {
			console.log('\nUNKNOWN ERROR:\n', err, '\n');
		}

	}

	console.log(`Done!\n`);

}

function list () {

	console.log('\nTests:');

	let dir = fs.readdirSync('./testing/tests');

	for (let file of dir) {
		console.log('  ', file.split('.')[0]);
	}

	console.log(' ');

}

function help () {

	print_usage();

}

function quit () {

	rl.close();
	process.exit();

}

function print_usage () {

	console.log(
`\nUsage: <command> <argument(s)>
	Commands:
		run  -- Runs the test spesified in the provided argument.
		list -- Available tests.
		help -- Display help.
		quit -- Exites the program.\n`
	);


}