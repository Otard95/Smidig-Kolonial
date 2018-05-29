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
            );
            
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


    async updateShoppingList (listId, data, opt) {    
	    let sub_id;

        if (opt) {
            if (typeof data === 'string') {
                sub_id = data;
                data = opt;
            } else {
                // parameter error
            }
        }

        if (data instanceof ShoppingListDocument) {
            await this.updateShoppingListMetaData(listId, data)
        } else if (data instanceof ProductDocument || data instanceof GroupDocument) {
            await this.updateShoppingListContent(listId, sub_id, data)
        } else {
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.INVALID_PARAMETER,
                listObj,
                ""
            )
        }
    }


    async updateShoppingListMetaData(listId, listObj){
        if (listId && listObj && listObj instanceof ShoppingListDocument) {

            let res;

            try {
                res =  await db.Update(`shoppingLists/${listId}`, listObj.getData())
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

    async updateShoppingListContent(listId, docId, data){
        if (listId && docId && data){

            let res;

            if (data instanceof ProductDocument){
                res = await db.Update(`shoppingLists/${listId}/products/${docId}`, data.getData())
            } else if(data instanceof GroupDocument){
                res = await db.Update(`shoppingLists/${listId}/groups/${docId}`, data.getData())
            } else {
                throw new ShoppingListResponse(
                    ShoppingListResponse.status_codes.INVALID_PARAMETER,
                    {
                        data,
                        PARAMETER_DATA_TYPE: typeof data,
                        EXPECTED_DATA_TYPE : "ProductDocument || GroupDocument"
                    },
                    "Parameter error, not supported type"

                )
            }

            if (res !== undefined){
                throw new ShoppingListResponse(
                    ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                    {
                        listId,
                        docId,
                        data,
                        LIST_OBJ_TYPE: typeof data,
                        EXPECTED_OBJ_TYPE: "ProductDocument || GroupDocument"

                    },
                    `Error while updating list with id: ${listId}`
                )
            }
        } else {
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.PARAMETER_DATA_TYPE,
                {
                    listId,
                    docId,
                    data
                },
                `One or more paramters was undefined`
            )
        }
    }


    async deleteListOrItem(listId, itemId){

        let res;

        if (typeof listId === 'string' && typeof itemId === 'string'){
            res = await db.Delete(`shoppingLists/${listId}/products/${itemId}`);
        } else if (typeof listId === 'string' && itemId === undefined) {

            // delete from users

            res = await db.Delete(`shoppingLists/${listId}`);
        } else {
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.INVALID_PARAMETER,
                {
                    listId,
                    itemId
                },
                "Invalid parameters"
            );
        }

        if (!DBResponse.OK(res)) {
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                res,
                `Error while deleting element with id: ${listId}`
            );
        }

        return new ShoppingListResponse(
            ShoppingListResponse.status_codes.OK,
            { params: { listId, itemId } },
            'Shopping list deleted'
        );
    }

}
module.exports = new ShoppingList();