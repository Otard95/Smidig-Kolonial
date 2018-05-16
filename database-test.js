const assert = require('assert');
const db = require('./bin/database');
const colors = require('colors');
const unit = require('./testing/unit');

async function RunTest (test) {

	console.log(`${RunTest.indent || ''}${test.name} -- ${test.description || 'Missing description'}`);

	try {

		await test();

		console.log(`${RunTest.indent || ''}${test.name} -- Passed`.green);
		return true;

	} catch (err) {

		console.log(`${RunTest.indent || ''}${test.name} -- Error: \n${RunTest.indent || ''}${err}`.yellow);
		console.log(`${RunTest.indent || ''}${test.name} -- Failed`.red);
		return false;

	}

}

async function RunSequentially() {

	console.log(`\nRunning ${arguments.length} sequential tests.\n`);
	RunTest.indent ? RunTest.indent += '\t' : RunTest.indent = '\t';

	for (let i = 0; i < arguments.length; i++) {

		if (typeof arguments[i] != 'function') continue;
		if (!await RunTest(arguments[i])) {
			console.log('Stopping sequential execution due to failed task.'.red);
			return false;
		}

	}

	console.log(`\nFinished ${arguments.length} sequential tests.\n`);
	RunTest.indent = RunTest.indent.substring(1);
	return true;

}

async function RunParallel() {

	console.log(`\nRunning ${arguments.length} parallel tests.\n`);
	RunTest.indent ? RunTest.indent += '\t' : RunTest.indent = '\t';
	let tests = [];

	for (let i = 0; i < arguments.length; i++) {

		if (typeof arguments[i] != 'function') continue;
		tests.push(RunTest(arguments[i]));

	}

	await Promise.all(tests);

	console.log(`\nFinished ${arguments.length} parallel tests.\n`);
	RunTest.indent = RunTest.indent.substring(1);

}

/**
 * ## User Tests 
*/

async function DatabaseNotNull () {
	assert.ok(db != null && db != undefined);
}
DatabaseNotNull.description = 'Make sure we got a database instance.';

// -----------

async function GetDocumentTest () {

	let res = await db.GetDocument('customers/{"name": "Test Tester"}');

	assert.ok(res != null && res != undefined);

}
GetDocumentTest.description = 'Try getting test data.';

// -----------

async function ValidateTestDocument () {
	let res = await db.GetDocument('customers/{"name": "Test Tester"}');

	let data = {
		email: "test@test.com",
		name: "Test Tester",
		password: "Test1234"
	};

	assert.deepEqual(res.data(), data);

}
ValidateTestDocument.description = 'Make sure the data recovered from the database matches expectations.';

// -----------

async function GetInSubColletion () {

	let res = await db.GetDocument('customers/{"name": "Test Tester"}/test/{}');

	assert.ok(res != null && res != undefined);

}
GetInSubColletion.description = 'Try getting test data in a subcollection';

// -----------



console.log('\n\nDatabase Test\n\n');

// let test_getters = unit.parallel(GetDocumentTest, GetInSubColletion);
// let main = unit.series(DatabaseNotNull, test_getters, ValidateTestDocument);
// unit.test(main)().then(process.exit);

RunTest(DatabaseNotNull)
.then(() => {
	return RunParallel(GetDocumentTest, GetInSubColletion);
})
.then(() => {
	return RunTest(ValidateTestDocument)
})
.then(() => {

	console.log('\n\nDone!\n');
	process.exit();

});