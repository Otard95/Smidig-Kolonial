const db = require('./database');
const DBResponse = require('../models/database-response');
const ShoppingListDocument = require('../models/shopping-list-document');
const ShoppingListResponse = require('../models/shopping-list-response');
const ProductDocument = require('../models/product-document');


class ShoppingList {


    constructor(){
        if (!ShoppingList._instance) {

            // construct

            ShoppingList._instance = this;
        }

        return ShoppingList._instance;

    }

    async createShoppingList (userId, name, date, users) {

        let listObj = new ShoppingListDocument(name, date);

        let DBres = await db.Create("shoppingLists", listObj.getData());

        if (!DBResponse.OK(DBres)) {
            // error
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                DBres,
                "Error while creating shopping list"
            );
        }

        //TODO kaste feilmedling om det ikke går
        let userObj = {
            shoppingListId: DBres.data.id,
            sharedWith: []
        };

        if (users && users.length() > 0) {
            userObj.sharedWith = users;
            users.forEach((user) => {
                db.Create(`customers/${user}/sharedShoppingLists`,
                    { shoppingListID: DBres.data.id, owner: userId });
            })
        }

        DBres = await db.Create(`customers/${userId}/shoppingLists`, userObj);
        if (!DBResponse.OK(DBres)) {
            // error
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                DBres,
                "Error while creating shopping list"
            );
        }
    }

    async addProductToList(listId, product) {
        if (listId && product instanceof ProductDocument) {
            return await db.Create(`shoppingLists/${listId}/products`, product);
        }
        throw new ShoppingListResponse(
            ShoppingListResponse.status_codes.INVALID_PARAMETER,
            {
                listId,
                product,
                product_param_type: typeof product,
                expected_type: 'ProductDocument'
            },
            "Parameter error, check parameter type!"
        )
    }

    async getProductList (listId){

        let list = await db.Get(`shoppingList/${listId}/products/{}`);



    }

    //TODO metode for å oppdatere et eksisterende dokuemnt
}


module.exports = new ShoppingList();