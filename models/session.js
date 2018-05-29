
class Session {

	constructor (user_id, user_name, user_email) {
		if (typeof user_id === 'object') {
			this._copy_constructor(user_id);
		} else {
			this.user_id = user_id;
			this.user_name = user_name;
			this.user_email = user_email;
		}
	}

	_copy_constructor (to_copy) {
		this.user_id = to_copy.user_id;
		this.user_name = to_copy.user_name;
		this.user_email = to_copy.user_email;
	}

	getData () {
		return {
			user_id: this.user_id,
			user_name: this.user_name,
			user_email: this.user_email,
		}
	}

}

module.exports = Session;