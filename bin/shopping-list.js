const db = require('./database');
const DBResponse = require('../models/database-response');
const ShoppingListDocument = require('../models/shopping-list-document');
const ShoppingListResponse = require('../models/shopping-list-response');
const ProductDocument = require('../models/product-document');
const GroupDocument = require('../models/group-document')

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
            return await db.Create(`shoppingLists/${listId}/products`, product.getData());
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

    async getShoppingList(listId){
        if (listId){
            return await db.Get(`shoppingLists/${listId}`)
        }
        throw new ShoppingListResponse(
            ShoppingListResponse.status_codes.NOT_FOUND,
            listId,
            `Parameter error, could not find list with id: ${listId}`
        );
    }

    async getShoppingListContent (listId){

        if (listId) {

            let meta = await this.getShoppingList(listId);
            let products = await db.Get(`shoppingLists/${listId}/products/{}`);
            let groups = await db.Get(`shoppingLists/${listId}/groups/{}`);

            let res = new ShoppingListDocument(
                meta.data[0].data().name, 
                meta.data[0].data().date,
                products.data.map( (e) => new ProductDocument(e.data().kolonialId, e.data().amount, e.data().groupId)), 
                groups.data.map( (e) => new GroupDocument(e.data().color, e.data().name))
            )
            
            return new ShoppingListResponse(
                ShoppingListResponse.status_codes.OK,
                res,
                "Document found"
            )
        }

        throw new ShoppingListResponse(
            ShoppingListResponse.status_codes.NOT_FOUND,
            listId,
            `Parameter error, could not find list with id: ${listId}`
        );
    }


    async upDateShoppingList (listId,listObj) {

        if (listObj && listObj instanceof ProductDocument) {

            let res;

            try {
                res = db.Update(`shoppingList/${listId}`, listObj.getData())
            }catch (e) {
                throw new ShoppingListResponse(
                    ShoppingListResponse.status_codes.NOT_FOUND,
                    listId,
                    `Parameter error, could not find list with id: ${listId}`
                );
            }

            if (res !== undefined) {
                throw new ShoppingListResponse(
                    ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                    {
                        listId,
                        listObj,
                        LIST_OBJ_TYPE: typeof listObj,
                        EXPECTED_OBJ_TYPE: "ShoppingListDocument"

                    },
                    `Error while updating list with id: ${listId}`
                )
            }
        }
    }
}


module.exports = new ShoppingList();