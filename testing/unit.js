const color = require('colors');

function WaitForSeconds(num_sec) {

	return () => {
		console.log('\t        |');
		console.log(`\t Waiting ${num_sec} seconds`);
		console.log('\t        |');

		return new Promise(resolve => setTimeout(resolve, num_sec * 1000));
	}

}

async function RunTest(_test) {

	console.log(
		`${_test.pre_line ? '\n' : ''}${RunTest.indent || ''}${_test.name} -- ${_test.description || 'Missing description'}`
	);

	try {

		await _test();

		console.log(
			`${RunTest.indent || ''}${_test.name} -- Passed${_test.post_line ? '\n' : ''}`.green
		);
		return true;

	} catch (err) {

		console.log(`${RunTest.indent || ''}${_test.name} -- Error: \n${RunTest.indent || ''}${JSON.stringify(err)}\n${err.stack}`.yellow);
		console.log(`${RunTest.indent || ''}${_test.name} -- Failed${_test.post_line ? '\n' : ''}`.red);
		return false;

	}

}

function test () {

	let args = arguments;

	let test = async () => {

		for (let i = 0; i < args.length; i++) {
			
			if (typeof args[i] != 'function') continue;

			await RunTest(args[i]);

		}

	};

	return test;

}

function series () {

	let args = arguments;

	let SERIES = async () => {

		// Formating outout
		console.log(' ');
		RunTest.indent ? RunTest.indent += '\t' : RunTest.indent = '\t';

		for (let i = 0; i < args.length; i++) {

			if (typeof args[i] != 'function') continue;
			
			if (!await RunTest(args[i]))
				throw 'Stopping sequential execution due to failed task.';

		}

		// Formating outout
		console.log(' ');
		RunTest.indent = RunTest.indent.substring(1);	

	};
	SERIES.description = `${args.length} test to run in series`;
	SERIES.pre_line = true;
	SERIES.post_line = true;

	return SERIES;

}

function parallel() {

	let args = arguments;

	let PARALLEL = async () => {
		
		// Formating outout
		console.log(' ');
		RunTest.indent ? RunTest.indent += '\t' : RunTest.indent = '\t';
		
		let tests = [];

		for (let i = 0; i < args.length; i++) {

			if (typeof args[i] != 'function') continue;

			tests.push(RunTest(args[i]));

		}

		await Promise.all(tests);

		// Formating outout
		console.log(' ');
		RunTest.indent = RunTest.indent.substring(1);

	};
	PARALLEL.description = `${args.length} test to run in parallel`;
	PARALLEL.pre_line = true;
	PARALLEL.post_line = true;

	return PARALLEL;

}

module.exports = { test, series, parallel, WaitForSeconds };