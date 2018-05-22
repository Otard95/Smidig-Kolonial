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

	assert(DBRes.OK(DBResOK), 'OK Response');
	assert(!DBRes.OK(DBResMultDocErr), 'Multi-Doc error');
	assert(!DBRes.OK(DBResNoDocErr), 'No Doc Error');
	return;

}
TestDBResponse.description = 'Make sure the DBResponse::OK() works as expected';

async function DatabaseNotNull () {
	return assert(db != null && db != undefined, 'database not defined');
}
DatabaseNotNull.description = 'Make sure we got a database instance.';

// -----------

async function GetDocumentTest () {

	let res = await db.Get('customers/{"name": "Test Tester"}');

	assert(DBRes.OK(res), res.err);
	
	assert(res.data != null && res.data != undefined, 'Data not defined: ' + res);

}
GetDocumentTest.description = 'Try getting test data.';

// -------------

async function GetDocumentWithId () {

	let res = await db.Get('customers/cEx6uZdHs5K7KfUfz6cT');

	assert(DBRes.OK(res), res.err);

	assert(res.data != null && res.data != undefined, 'Data not defined: ' + res);
	assert.equal(res.data.length, 1, 'Unexpected length of returned data: ' + res);
	assert.deepEqual(res.data[0].data(), test_doc, 'Document doesn\'t match expectations.');

}
GetDocumentWithId.description = 'Test Database::Get() using path with document id.';

// -----------

async function ValidateTestDocument () {

	let res = await db.Get('customers/{"name": "Test Tester"}');

	assert(DBRes.OK(res), res.err);
	assert(res.data.length == 1);
	assert.deepEqual(res.data[0].data(), test_doc, 'Document doesn\'t match expectations.');

}
ValidateTestDocument.description = 'Make sure the data recovered from the database matches expectations.';

// -----------

async function GetInSubColletion () {

	let res = await db.Get('customers/{"name": "Test Tester"}/shoppingLists/{}');

	assert(DBRes.OK(res), res.err);

	assert(res.data != null && res.data != undefined, 'Data not defined: ' + res);

}
GetInSubColletion.description = 'Try getting test data in a subcollection';

// -----------

async function CreateDocumentTest() {

	let res = await db.Create('customers', new_doc);

	assert(DBRes.OK(res), res.err);

	assert(res.data != null && res.data != undefined, 'Data not defined: ' + res);

} CreateDocumentTest.description = 'Try to create a new document in the database';

// -----------

async function ValidateNewDocument() {

	let res = await db.Get('customers/{"name": "John Doe"}');

	assert(DBRes.OK(res), res.err);
	assert.equal(res.data.length, 1, 'Unexpected length of returned data: ' + res);
	assert.deepEqual(res.data[0].data(), new_doc, 'Data doesn\'t match expectations.');

}
ValidateNewDocument.description = 'Make sure the data recovered from the database matches expectations.';

// -------------

async function CreateDocumentInSubCollection () {

	let res = await db.Create('customers/{"email": "test@test.com"}/testCollection', { some: 'test data' });

	assert(DBRes.OK(res), res.err);

	assert(res.data, 'Data not defined: ' + res);

}
CreateDocumentInSubCollection.description = 'Test if Database::Create() can create a document in a non ecsistent sub collection.';

// -----------

async function CreateDocumentWithIdInPath() {

	let res = await db.Create('customers/cEx6uZdHs5K7KfUfz6cT/testCollection', new_doc);

	assert(DBRes.OK(res), res.err);

	assert(res.data != null && res.data != undefined, 'Data not defined: ' + res);

}
CreateDocumentWithIdInPath.description = 'Try to create a new document in the database';

// -----------

let test_getters = unit.parallel(GetDocumentTest, GetInSubColletion, GetDocumentWithId);
let test_setters = unit.series(CreateDocumentTest, ValidateNewDocument, CreateDocumentInSubCollection, CreateDocumentWithIdInPath)
let main = unit.series(TestDBResponse, DatabaseNotNull, test_getters, ValidateTestDocument, test_setters);

module.exports = unit.test(main);
