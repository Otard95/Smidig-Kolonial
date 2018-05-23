
class ShoppingListResponse {

    constructor(status, data, message) {
        this.status = status;
        status == ShoppingListResponse.status_codes.OK ? this.data = data : this.err = data;
        this.message = message;
    }

    static OK (ShoppRes) {
        return ShoppRes.status == ShoppingListResponse.status_codes.OK;
    }

    static StatusName (code) {
        for ( let key in ShoppingListResponse.status_codes ) {
            if ( code == ShoppingListResponse.status_codes[key] ) return key;
        }
    }
}


ShoppingListResponse.status_codes = {
    OK: 0,
    CONFLICT: 201,
    INVALID_PARAMETER: 202,
    DATABASE_CONNECTION_ERROR: 203,
    UNKNOWN_ERROR: 204
};

module.exports = ShoppingListResponse;


