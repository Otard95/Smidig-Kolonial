const db = require('./database');
const OAuthResponse = require("../models/OAuth-response");
const Session = require('../models/session')

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
			user = await db.GetDocument(`customers/{"email": "${username}"`);

			if (user.password == password)
				return new OAuthResponse(OAuthResponse.status_codes.OK, user);
			else
				return new OAuthResponse(OAuthResponse.status_codes.INVALID_PASSWORD,
																 null,
																 'Provided password did not match with the one saved to theprofile');

		} catch (err) {

			throw new OAuthResponse(OAuthResponse.status_codes.DATABASE_ERROR, err, 'Failed to retrieve the document');

		}

	}

	Authenticate (username_paramerter_name, password_parameter_name) {

		return (req, res, next) => {
			this.AuthenticateUser(req.params[username_paramerter_name], req.params[password_parameter_name])
			.then(res => {

				req.authenticated = OAuthResponse.OK(res);

				if (req.authenticated) {
					req.user = res.user;
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
				.then(res => {

					req.autorized = res;

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

		new_session_id = this.RandomId(12);
		while (this.sessions[new_session_id]) new_session_id = this.RandomId(12);

		this.sessions.push(new Session(new_session_id, user.id, user));
		return new_session_id;

	}

	RandomId (num_len) {

		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		let id = ''
		for (let i = 0; i < num_len; i++) 
			id += possible.charAt(Math.floor(Math.random() * possible.length));

		return id;

	}

}

const inst = new OAuth();

module.exports = inst;