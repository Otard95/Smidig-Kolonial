const database = require('./database');

class OAuth {

	constructor () {
		if (!OAuth._instance) {

			this.sessions = [];

		}

		return OAuth._instance;

	}



}

const inst = new OAuth();

module.exports = inst;