const db            = require('./database');
const DBResponse    = require('../models/database-response');
const OAuthResponse = require("../models/OAuth-response");
const Session       = require('../models/session');
const jwt           = require('jsonwebtoken');
const crypto        = require('crypto');

class OAuth {

	constructor () {
		if (!OAuth._instance) {

			this.sessions = {};

			const DH = crypto.createDiffieHellman(2048);
			DH.generateKeys();

			this.secret = DH.getPrivateKey();

		}

		return OAuth._instance;

	}

	async AuthenticateUser (username, password) {

		if ((!username || !password) &&
				(typeof username !== 'string' || typeof password !== 'string'))
		{
			throw new OAuthResponse(
				OAuthResponse.status_codes.INVALID_PARAMETER,
				{ username_param: username, pass_param: password },
				'The parameter(s) passed are/is invalid.'
			)
		}
		
		let user;
		try {

			// get the user filtered by username
			let res = await db.Get(`customers/{"email": "${username}"}`);

			if (!DBResponse.OK(res)) {
				if (res.status == DBResponse.status_codes.MULTI_MATCH_ERROR) {
					throw new OAuthResponse (
						OAuthResponse.status_codes.UNEXPECTED_ERROR_NON_UNIQUE_USERNAME,
						res,
						'The username is not unique.'
					);
				}
				else if (res.status == DBResponse.status_codes.DOCUMENT_NOT_FOUND) {
					return new OAuthResponse (
						OAuthResponse.status_codes.USER_NOT_FOUND,
						res,
						'Could not ind any user with that username/email.'
					);
				} else {
					throw new OAuthResponse (
						OAuthResponse.status_codes.DATABASE_ERROR,
						res,
						'Unexprected response.'
					);
				}
			} else if (res.data.length > 1) {
				throw new OAuthResponse(
					OAuthResponse.status_codes.UNEXPECTED_ERROR_NON_UNIQUE_USERNAME,
					res,
					'The username is not unique.'
				);
			}

			user = res.data[0];

			if (user.data().password == password) {

				return new OAuthResponse (OAuthResponse.status_codes.OK, user, 'User Authenticated.');

			} else {

				return new OAuthResponse (
					OAuthResponse.status_codes.INVALID_PASSWORD,
					null,
					'Provided password did not match with the one saved to the profile'
				);

			}

		} catch (err) {

			throw new OAuthResponse (
				OAuthResponse.status_codes.DATABASE_ERROR,
				err,
				'The database encountered and error'
			);

		}

	}

	Authenticate (username_paramerter_name, password_parameter_name) {

		return async (req, res, next) => {

			let Auth_res;
			try {
				Auth_res = await this.AuthenticateUser(req.body[username_paramerter_name || 'username'],
																									 req.body[password_parameter_name  || 'password']);

			} catch (err) {

				res.status(500);
				next({status: 500, OAuthErr: err});
				return;

			}

			req.authenticated = OAuthResponse.OK(Auth_res);

			if (!req.authenticated) {
				req.auth_err = Auth_res.err;
				next();
				return;
			}

			let sess = new Session(
				Auth_res.user.id,
				Auth_res.user.data().name,
				Auth_res.user.data().email
			)

			jwt.sign(sess.getData(), this.secret, {
				expiresIn: 24 * 60 * 60
			}, (err, token) => {

				if (err) {

					res.status(500);
					next({ status: 500, OAuthErr: err });

				} else {

					req.session.token = token;
					next();

				}

			});

		}

	}

	async IsAuthorized (token) {

		try {
			var decoded = jwt.verify(token, this.secret);

			return new OAuthResponse(
				OAuthResponse.status_codes.OK,
				new Session(decoded),
				'Token Veified.'
			);

		} catch (err) {

			return new OAuthResponse(
				OAuthResponse.status_codes.INVALID_SESSION_TOKEN,
				err,
				'The token was invalid.'
			);

		}

	}

	Authorized (unauthorized_redirect = undefined) {

		return async (req, res, next) => {

			// Is there a sesstion token
			if (!req.session.token) {

				req.autorized = false;

				req.session.destroy(err=>{

					if (unauthorized_redirect && typeof unauthorized_redirect === 'string')
						res.redirect(unauthorized_redirect);
					else
						next();

				});

				return;

			}
		
			// Validate token
			let Auth_res;
			try {

				Auth_res = await this.IsAuthorized(req.session.token);
				
			} catch (err) {

				req.status(500);
				next({ status: 500, OAuthErr: err });
				return;

			}

			// Check vaidations response
			req.autorized = OAuthResponse.OK(Auth_res);
			if (!req.autorized) {
				// token invalid or expired destroy session
				req.session.destroy(err => {
					// redirect or continue
					if (unauthorized_redirect && typeof unauthorized_redirect === 'string')
						res.redirect(unauthorized_redirect);
					else
						next();

				});

				return;
			}

			// token valid extract some data
			req.user = {};
			req.user.id = Auth_res.user.user_id;
			req.user.name = Auth_res.user.user_name;
			req.user.email = Auth_res.user.user_email;

			// Get a user referance from the databse
			let db_res_user;
			let db_res_lists;
			try {

				db_res_user = await db.Get(`customers/${Auth_res.user.user_id}`);
				db_res_lists = await db.Get(`customers/${Auth_res.user.user_id}/shoppingLists/{}`);

			} catch (err) {
				// handle errors
				req.status(500);
				next({ status: 500, DBErr: err });
				return;

			}

			// check database response
			if (!DBResponse.OK(db_res_user) && !DBResponse.OK(db_res_lists)) {
				// database query failed
				req.status(500);
				next({ status: 500, DBResponseErr: {db_res_user, db_res_lists} });
				return;

			} 

			// db response OK
			// add user referance to request object
			req.user.ref = db_res.data[0].ref;
			req.user.lists = db_res_lists.data.map( p => {
				return p.data().shoppingListId;
			});

			next();

		}

	}

	Logout (redirect_path = '/') {

		return (req, res, next) => {

			req.session.destroy(err => {

				if (typeof redirect_path !== 'string')
					res.redirect('/');
				else
					res.redirect(redirect_path);

			});

		}

	}

}

const inst = new OAuth();

module.exports = inst;