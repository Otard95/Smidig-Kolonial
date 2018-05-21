const assert = require('assert');
const unit   = require('../unit');
const db     = require('../../bin/database');
const DBRes  = require('../../models/database-response');

/**
 * ## Test data
*/

const test_doc = {
	email: 'test@test.com',
	name: 'Test Tester',
	password: 'Test1234'
}

new_doc = {
	email: "new.mail@somedomain.com",
	name: "John Doe",
	password: "some pass"
};

const DBResOK = new DBRes(
	DBRes.status_codes.OK,
	{
		name: "Test Teser",
		email: "test@test.com",
		password: "Test1234"
	}
)

const DBResNoDocErr = new DBRes(
	DBRes.status_codes.DOCUMENT_NOT_FOUND,
	null,
	'Some error'
)

const DBResMultDocErr = new DBRes(
	DBRes.status_codes.MULTI_MATCH_ERROR,
	{ msg: 'some db err' },
	'some err'
)

/**
 * ## Tests
*/

async function TestDBResponse() {

	assert(DBRes.OK(DBResOK));
	assert(!DBRes.OK(DBResMultDocErr));
	assert(!DBRes.OK(DBResNoDocErr));
	return;

}
TestDBResponse.description = 'Make sure the DBResponse::OK() works as expected';

async function DatabaseNotNull () {
	return assert.ok(db != null && db != undefined);
}
DatabaseNotNull.description = 'Make sure we got a database instance.';

// -----------

async function GetDocumentTest () {

	let res = await db.GetDocument('customers/{"name": "Test Tester"}');

	assert(DBRes.OK(res));
	
	assert.ok(res.data != null && res.data != undefined);

}
GetDocumentTest.description = 'Try getting test data.';

// -----------

async function ValidateTestDocument () {

	let res = await db.GetDocument('customers/{"name": "Test Tester"}');

	assert.deepEqual(res.data.data(), test_doc);

}
ValidateTestDocument.description = 'Make sure the data recovered from the database matches expectations.';

// -----------

async function GetInSubColletion () {

	let res = await db.GetDocument('customers/{"name": "Test Tester"}/test/{}');

	assert(DBRes.OK(res));

	assert(res.data != null && res.data != undefined);

}
GetInSubColletion.description = 'Try getting test data in a subcollection';

// -----------

async function CreateDocumentTest() {

	let res = await db.CreateDocument('customers', new_doc);

	assert.ok(res.data != null && res.data != undefined);

} CreateDocumentTest.description = 'Try to create a new document in the database';

// -----------

async function ValidateNewDocument() {

	let res = await db.GetDocument('customers/{"name": "John Doe"}');

	assert.deepEqual(res.data.data(), new_doc);

}
ValidateNewDocument.description = 'Make sure the data recovered from the database matches expectations.';

// -----------

let test_getters = unit.parallel(GetDocumentTest, GetInSubColletion);
let test_setters = unit.series(CreateDocumentTest, ValidateNewDocument)
let main = unit.series(TestDBResponse, DatabaseNotNull, test_getters, ValidateTestDocument, test_setters);

module.exports = unit.test(main);
