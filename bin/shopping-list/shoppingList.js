const db = require('./../database');
const ListModel = require('../models/ShoppingList');
const moment = require('moment');


class ShoppingList {


    constructor(){

    }


    async createShoppingList(name, ...groups){
        let listObj = new ListModel;
        const date = moment('2016-03-12 13:00:00');

        listObj.name = name;
        listObj.date = date;

        if (groups){
            listObj.groups = groups;
        }

        //TODO get email from user to create path for this document
        db.CreateDocument()
    }
}