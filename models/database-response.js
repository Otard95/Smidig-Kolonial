
class DatabaseResponse {

	constructor(status, data, message) {
		this.status = status;
		status == DatabaseResponse.status_codes.OK ? this.data = data : this.err = data;
		this.msg = message;
	}

	static OK(OARes) {
		return OARes.status == DatabaseResponse.status_codes.OK;
	}

	static StatusName(code) {
		for (let key in DatabaseResponse.status_codes) {
			if (code == DatabaseResponse.status_codes[key]) return key;
		}
	}

}

DatabaseResponse.status_codes = {
	OK: 0,
	DOCUMENT_NOT_FOUND: 101,
	MULTI_MATCH_ERROR: 102,
	PARAMETER_ERROR: 201,
	DOCUMENT_DELETION_FAILED: 202
}

module.exports = DatabaseResponse;
