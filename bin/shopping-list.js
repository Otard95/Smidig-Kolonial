const db = require('./../database');
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

        const docRef = await db.CreateDocument("shoppingLists", listObj);

        let userObj = {
            shoppingListId : docRef,
            sharedWith : []
        };

        if (users.length() > 0) {
            userObj.sharedWith = users;
            users.forEach( (user) => {
                await db.CreateDocument(`customers/${user}/sharedShoppingLists`,
                    {shoppingListID : docRef, owner : userId});
            })
        }

        await db.CreateDocument(`customers/${docRef}/shoppingLists`, userObj);
    }
}

module.exports = new ShoppingList();