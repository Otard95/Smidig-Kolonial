
class Session {

	constructor (id, user_id, user, exp_date) {
		this.id = id;
		this.user_id = user_id;
		this.user_data = user;
		this.exp_date = exp_date;
	}

}

module.exports = Session;