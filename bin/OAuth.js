const db            = require('./database');
const OAuthResponse = require("../models/OAuth-response");
const DBResponse    = require('../models/database-response');
const Session       = require('../models/session')

class OAuth {

	constructor () {
		if (!OAuth._instance) {

			this.sessions = [];

		}

		return OAuth._instance;

	}

	async AuthenticateUser (username, password) {
		
		let user;
		try {

			// get the user filtered by username
			let res = await db.GetDocument(`customers/{"email": "${username}"}`);

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
			}

			user = res.data;

			if (user.data().password == password) {

				return new OAuthResponse (OAuthResponse.status_codes.OK, user);

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
				req.params[username_paramerter_name],
				req.params[password_parameter_name]
			)
			.then(Auth_res => {

				req.authenticated = OAuthResponse.OK(Auth_res);

				if (req.authenticated) {
					req.user = Auth_res.user;
					req.auth_err = Auth_res.err;
					req.session.id = this.CreateSession(req.user);
				}

				next();

			})
			.catch(err => {

				next(err);

			});
		}

	}

	async IsAuthorized (session_id) {

		if (this.sessions[session_id])
			return true;
		
		return false;

	}

	Authorized () {

		return (req, res, next) => {

			if (req.session.id) {
				this.IsAuthorized(req.session.id)
				.then(Auth_res => {

					req.autorized = Auth_res;

					next();

				})
				.catch(err => {

					req.autorized = false;
					next(err);

				});

			} else {

				req.autorized = false;
				next();

			}

		}

	}

	CreateSession (user) {

		let new_session_id = this.RandomId(32);
		while (this.sessions[new_session_id]) new_session_id = this.RandomId(32);
	
		let session = new Session(
			new_session_id,
			user.id,
			user,
			Date.now() + 60 * 60 * 1000
		);
		this.sessions.push(session);
		return new_session_id;

	}

	RandomId (num_len) {

		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		let id = ''
		for (let i = 0; i < num_len; i++) 
			id += possible.charAt(Math.floor(Math.random() * possible.length));

		return id;

	}

}

const inst = new OAuth();

module.exports = inst;