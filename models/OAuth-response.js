
class OAuthResponse {

	constructor (status, data, message) {
		this.status = status;
		status == OAuthResponse.status_codes.OK ? this.user = data : this.err = data;
		this.msg = message;
	}

	static OK (OARes) {
		return OARes.status == OAuthResponse.status_codes.OK;
	}

	static StatusName (code) {
		for ( let key in OAuthResponse.status_codes ) {
			if ( code == OAuthResponse.status_codes[key] ) return key;
		}
	}

}

OAuthResponse.status_codes = {
	OK: 0,
	USER_NOT_FOUND: 1,
	INVALID_PASSWORD: 2,
	UNEXPECTED_ERROR_NON_UNIQUE_USERNAME: 101,
	DATABASE_ERROR: 201
}

module.exports = OAuthResponse;