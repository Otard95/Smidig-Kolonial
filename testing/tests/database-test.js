const assert = require('assert');
const db = require('../../bin/database');
const unit = require('../unit');

async function DatabaseNotNull () {
	return assert.ok(db != null && db != undefined);
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

async function CreateDocumentTest() {

	let newdoc = {
		email: "new.mail@somedomain.com",
		name: "John Doe",
		password: "some pass"
	};

	let res = await db.CreateDocument('customers', newdoc);

	assert.ok(res != null && res != undefined);

} CreateDocumentTest.description = 'Try to create a new document in the database';

// -----------

async function ValidateNewDocument() {
	let res = await db.GetDocument('customers/{"name": "John Doe"}');

	let data = {
		email: "new.mail@somedomain.com",
		name: "John Doe",
		password: "some pass"
	};

	assert.deepEqual(res.data(), data);

}
ValidateNewDocument.description = 'Make sure the data recovered from the database matches expectations.';

// -----------

let test_getters = unit.parallel(GetDocumentTest, GetInSubColletion);
let main = unit.series(DatabaseNotNull, test_getters, ValidateTestDocument);

module.exports = unit.test(main);
