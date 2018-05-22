const assert   = require('assert');
const unit     = require('../unit');
const OAuth    = require('../../bin/OAuth');
const OAuthRes = require('../../models/OAuth-response');

/**
 * ## Test data
*/

const user = {
	email: 'test@test.com',
	name: 'Test Tester',
	password: 'Test1234'
}

const userWrongUsername = {
	email: 'test@test.no',
	name: 'Test Tester',
	password: 'Test1234'
}

const userWrongPass = {
	email: 'test@test.com',
	name: 'Test Tester',
	password: 'Some other pass'
}

const AuthResOK = new OAuthRes(
	OAuthRes.status_codes.OK,
	{
		name: "Test Teser",
		email: "test@test.com",
		password: "Test1234"
	}
)

const AuthResPassErr = new OAuthRes(
	OAuthRes.status_codes.INVALID_PASSWORD,
	null,
	'Some error'
)

const AuthResDBErr = new OAuthRes(
	OAuthRes.status_codes.DATABASE_ERROR,
	{ msg: 'some db err' },
	'some err'
)

/**
 * ## Tests
*/

async function TestAuthResponse () {

	assert(OAuthRes.OK(AuthResOK));
	assert(!OAuthRes.OK(AuthResPassErr));
	assert(!OAuthRes.OK(AuthResDBErr));
	return;

}
TestAuthResponse.description = 'Make sure the OAuthResponse::OK() works as expected';

// -------------

async function TestAuthenticateFunction () {
	
	let AuthRes = await OAuth.AuthenticateUser(user.email, user.password);

	assert(OAuthRes.OK(AuthRes));

}
TestAuthenticateFunction.description = 'Test the OAuth::Authenticate() with inputs that should yield a positive response.';

// -------------

async function TestAuthenticateFunctionUsernameErr () {

	try {
		let AuthRes = await OAuth.AuthenticateUser(userWrongUsername.email, userWrongUsername.password);
		assert.fail('No exception');
	} catch (err) {
		assert(!OAuthRes.OK(err));
	}

}
TestAuthenticateFunctionUsernameErr.description = 'Test the OAuth::Authenticate() with wrong username. Here we exprect a Exeption.';

// -------------

async function TestAuthenticateFunctionPassErr() {

	let AuthRes = await OAuth.AuthenticateUser(userWrongPass.email, userWrongPass.password);

	assert(!OAuthRes.OK(AuthRes));
	assert.equal(OAuthRes.status_codes.INVALID_PASSWORD, AuthRes.status);

}
TestAuthenticateFunctionPassErr.description = 'Test the OAuth::Authenticate() with wrong password.';

// -------------

async function TestAuthenticateMiddleware () {

	let done = false;

	let wait_for_done = () => { 
		return new Promise((resolve, reject) => {
			while (!done);
			resolve();
		});
	}

	function next (err) {
		if (err) assert.fail(err);
		done = true;
	}

	// create fake post request
	let req = {
		params: {
			email: 'test@test.com',
			password: 'Test1234'
		},
		session: {}
	}
	
	await OAuth.Authenticate('email','password')(req, null, next);

	// console.log(req.user.data(), user);

	assert(req.authenticated);
	assert.deepEqual(user, req.user.data());
	assert(req.session.id);

}
TestAuthenticateMiddleware.description = 'Test the OAuth::Authenticate() function and middleware.';

/**
 * ## Unit test setup
*/

let test_authenticate = unit.series(
	TestAuthenticateFunction,
	TestAuthenticateFunctionPassErr,
	TestAuthenticateFunctionUsernameErr
);

let main = unit.series(TestAuthResponse, test_authenticate);

module.exports = unit.test(main);