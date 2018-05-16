
async function RunTest(_test) {

	console.log(`${RunTest.indent || ''}${_test.name} -- ${_test.description || 'Missing description'}`);

	try {

		await _test();

		console.log(`${RunTest.indent || ''}${_test.name} -- Passed`.green);
		return true;

	} catch (err) {

		console.log(`${RunTest.indent || ''}${_test.name} -- Error: \n${RunTest.indent || ''}${err}`.yellow);
		console.log(`${RunTest.indent || ''}${_test.name} -- Failed`.red);
		return false;

	}

}

function test () {

	let args = arguments;

	let test = async () => {

		for (let i = 0; i < args.length; i++) {
			
			if (typeof args[i] != 'function') continue;

			RunTest(args[i]);

		}

	};

	return test;

}

function series () {

	let args = arguments;

	let series = async () => {

		for (let i = 0; i < args.length; i++) {

			if (typeof args[i] != 'function') continue;
			
			if (!await RunTest(args[i]))
				throw 'Stopping sequential execution due to failed task.';

		}

	};
	series.description = `${args.length} test to run in series`;

	return series;

}

function parallel() {

	let args = arguments;

	let parallel = async () => {

		let tests = [];

		for (let i = 0; i < args.length; i++) {

			if (typeof args[i] != 'function') continue;

			tests.push(RunTest(args[i]));

		}

		await Promise.all(tests);

	};
	parallel.description = `${args.length} test to run in parallel`;

	return parallel;

}

module.exports = { test, series, parallel };