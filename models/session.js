
class Session {

	constructor (id, user_id, user) {
		this.id = id;
		this.user_id = user_id;
		this.user_data = user;
	}

}

module.exports = Session;