const db = require('./database');
const DBResponse = require('../models/database-response');
const ShoppingListDocument = require('../models/shopping-list-document');
const moment = require('moment');


class ShoppingList {


    constructor(){
        if (!ShoppingList._instance) {

            // construct

            ShoppingList._instance = this;
        }

        return ShoppingList._instance;

    }


    async createShoppingList(userId, name, date, users){
        let listObj = new ShoppingListDocument(name, date);
        listObj = {
            name: listObj.name,
            date: listObj.date
        }

        let DBres = await db.CreateDocument("shoppingLists", listObj);

        if (DBResponse.OK(DBres)) {
            let userObj = {
                shoppingListId: DBres.data.id,
                sharedWith: []
            };

            if (users && users.length() > 0) {
                userObj.sharedWith = users;
                users.forEach((user) => {
                    db.CreateDocument(`customers/${user}/sharedShoppingLists`,
                        { shoppingListID: DBres.data.id, owner: userId });
                })
            }

            await db.CreateDocument(`customers/${userId}/shoppingLists`, userObj);
        }

    }

    async addProductToList(listId, product) {
        //product : kolonialId, amount, groupId
        if (listId && product) {
            return await db.CreateDocument(`shoppingLists/${listId}/products`, product);
        }
    }
}


module.exports = new ShoppingList();