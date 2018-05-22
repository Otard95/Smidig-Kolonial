const db            = require('./database');
const OAuthResponse = require("../models/OAuth-response");
const DBResponse    = require('../models/database-response');
const Session       = require('../models/session')

class OAuth {

	constructor () {
		if (!OAuth._instance) {

			this.sessions = {};

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

				return new OAuthResponse (OAuthResponse.status_codes.OK, user,'');

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

		return (req, res, next) => {
			this.AuthenticateUser(
				req.body[username_paramerter_name || 'username'],
				req.body[password_parameter_name || 'password']
			)
			.then(Auth_res => {

				req.authenticated = OAuthResponse.OK(Auth_res);

				req.user = Auth_res.user;
				req.auth_err = Auth_res.err;

				if (req.authenticated) {
					this.CreateSession(req.session.id, req.user);
				}

				next();

			})
			.catch(err => {

				res.status(500);
				next({status: 500, OAuthErr: err});

			});
		}

	}

	async IsAuthorized (session_id) {

		if (this.sessions[session_id])
			return true;
		
		return false;

	}

	Authorized (unauthorized_redirect = undefined) {

		return (req, res, next) => {

			if (req.session.id) {
				this.IsAuthorized(req.session.id)
				.then(Auth_res => {

					req.autorized = Auth_res;
					if (Auth_res &&
							unauthorized_redirect &&
							typeof unauthorized_redirect === 'string')
					{
						res.redirect(unauthorized_redirect);
					}
					next();

				})
				.catch(err => {

					req.autorized = false;
					next(err);

				});

			} else {

				req.autorized = false;
				if (unauthorized_redirect && typeof unauthorized_redirect === 'string')
					res.redirect(unauthorized_redirect);
				next();

			}

		}

	}

	CreateSession (session_id, user) {

		let session = new Session(
			session_id,
			user.id,
			user,
			Date.now() + 60 * 60 * 1000
		);
		this.sessions[session_id] = session;

	}

}

const inst = new OAuth();

module.exports = inst;