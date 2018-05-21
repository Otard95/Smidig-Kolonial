const db = require('./../database');
const ShoppingListDocument = require('../models/ShoppingListDocument');
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

        const docRef = db.CreateDocument("shoppingLists", listObj);

        let userObj = {
            shoppingListId : docRef,
            sharedWith : []
        };

        if (users.length() > 0) {
            userObj.sharedWith = users;
            users.forEach( (user) => {
                db.CreateDocument(`customers/${user}/sharedShoppingLists`,
                    {shoppingListID : docRef, owner : userId});
            })
        }

        db.CreateDocument(`customers/${docRef}/shoppingLists`, userObj);
    }
    
    
    async addProductToList(listId, product){
        //product : kolonialId, amount, groupId
        if (listId && product) {
            return await db.CreateDocument(`shoppingLists/${listId}/products`, product);
        }
    }
}