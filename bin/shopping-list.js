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

    async createShoppingList (userId, listObj) {

        let DBres = await db.Create("shoppingLists", listObj.getData());

        if (!DBResponse.OK(DBres)) {
            // error
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                DBres,
                "Error while creating shopping list"
            );
        }

        if (listObj.users && listObj.users.length() > 0) {
            users.forEach((user) => {
                db.Create(`customers/${user}/sharedShoppingLists`,
                    { shoppingListID: DBres.data.id, owner: userId });
            })
        }

        DBres = await db.Create(`customers/${userId}/shoppingLists`, { shoppingListId : DBres.data.id });

        if (!DBResponse.OK(DBres)) {
            // error
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                DBres,
                "Error while creating shopping list"
            );
        }

        let snappshot = await DBres.data.get();

        let response = new ShoppingListDocument(
            snappshot.data().name,
            snappshot.data().date,
            [],
            [],
            snappshot.data().sharedWith
        )

        return new ShoppingListResponse(
            ShoppingListResponse.status_codes.OK,
            response,
            'Successfuly created shopping list'
        );
    }

    async addDocumentToList(listId, doc) {
        
        let res;

        if (listId && doc instanceof ProductDocument) {
           
            res = await db.Create(`shoppingLists/${listId}/products`, doc.getData());
        
        } else if (listId && doc instanceof GroupDocument) {
            
            res = await db.Create(`shoppingLists/${listId}/groups`, doc.getData());

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
            res.data,
            'Successful response'
        )
    }

    async addGroupToProduct (listId, productId, groupId) {

        if (!listId || !productId || !groupId ) {

            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.INVALID_PARAMETER,
                {},
                'Missing parameters'
            );
        }

        let product = await db.Get(`shoppingLists/${listId}/products/${productId}`);

        if (!DBResponse.OK(product)) {
        
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                product,
                'Failed to get product'
            );
        }

        let new_doc = product.data[0].data();
        new_doc.groupId = groupId;
        let res = await db.Update(`shoppingLists/${listId}/products/${product.data[0].id}`, new_doc, false);

        if (!DBResponse.OK(res)) {
        
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                res,
                'Failed to get product'
            );
        }

        return new ShoppingListResponse(
            ShoppingListResponse.status_codes.OK,
            res,
            'Successfuly added group from product'
        );

    }

    async removeGroupFromProduct(listId, productId) {

        let product = await db.Get(`shoppingLists/${listId}/products/${productId}`);

        if (!DBResponse.OK(product)) {
        
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                product,
                'Failed to get product'
            );
        }

        let new_doc = product.data[0].data();
        delete new_doc.groupId;
        let res = await db.Update(`shoppingLists/${listId}/products/${product.data[0].id}`, new_doc, false);

        if (!DBResponse.OK(res)) {
        
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                res,
                'Failed to get product'
            );
        }

        return new ShoppingListResponse(
            ShoppingListResponse.status_codes.OK,
            res,
            'Successfuly removed group from product'
        );

    }

    async getShoppingList(listId){
        
        if (listId){
            let res = await db.Get(`shoppingLists/${listId}`)

            if (!DBResponse.OK(res)) {
                throw new ShoppingListResponse(
                    ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                    res,
                    `Error while deleting element with id: ${listId}`
                );
            }

            return new ShoppingListResponse(
                ShoppingListResponse.status_codes.OK,
                new ShoppingListDocument(
                    res.data[0].data().name,
                    res.data[0].data().date,
                    [],
                    [],
                    res.data[0].data().sharedWith
                ),
                'Successful response'
            )
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

            products = (DBResponse.OK(products) ? products.data.map( (e) => new ProductDocument(e.data().kolonialId, e.data().amount, e.data().groupId, e.id)): undefined);
            groups = (DBResponse.OK(groups) ? groups.data.map( (e) => new GroupDocument(e.data().color, e.data().name, e.id)): undefined);

            let res = new ShoppingListDocument(
                meta.data.name, 
                meta.data.date,
                products, 
                groups,
                meta.data.sharedWith
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
                throw new ShoppingListResponse(
                    ShoppingListResponse.status_codes.INVALID_PARAMETER,
                    {},
                    'Invalid parameters'
                )
            }
        }

        if (data instanceof ShoppingListDocument) {
            return await this.updateShoppingListMetaData(listId, data);

        } else if (data instanceof ProductDocument || data instanceof GroupDocument) {
            return await this.updateShoppingListContent(listId, sub_id, data);

        } else {
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.INVALID_PARAMETER,
                listObj,
                ""
            );
        }

    }

    async updateShoppingListMetaData(listId, listObj){
        
        if (listId && listObj && listObj instanceof ShoppingListDocument) {

            let res;

            try {
                res =  await db.Update(`shoppingLists/${listId}`, listObj.getData());

            }catch (e) {
                throw new ShoppingListResponse(
                    ShoppingListResponse.status_codes.NOT_FOUND,
                    listId,
                    `Parameter error, could not find list with id: ${listId}`
                );
            }

            if (!DBResponse.OK(res)) {
                throw new ShoppingListResponse(
                    ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                    {
                        listId,
                        listObj,
                        LIST_OBJ_TYPE: typeof listObj,
                        EXPECTED_OBJ_TYPE: "ShoppingListDocument"

                    },
                    `Error while updating list with id: ${listId}`
                );
            }

            return new ShoppingListResponse(
                ShoppingListResponse.status_codes.OK,
                {},
                'Successfuly updated list'
            );
        }
    }

    async updateShoppingListContent(listId, docId, data){
       
        if (listId && docId && data){

            let res;

            if (data instanceof ProductDocument){
                res = await db.Update(`shoppingLists/${listId}/products/${docId}`, data.getData());

            } else if(data instanceof GroupDocument){
                res = await db.Update(`shoppingLists/${listId}/groups/${docId}`, data.getData());

            } else {
                throw new ShoppingListResponse(
                    ShoppingListResponse.status_codes.INVALID_PARAMETER,
                    {
                        data,
                        PARAMETER_DATA_TYPE: typeof data,
                        EXPECTED_DATA_TYPE : "ProductDocument || GroupDocument"
                    },
                    "Parameter error, not supported type"
                );
            }

           if (!DBResponse.OK(res)) {
                throw new ShoppingListResponse(
                    ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                    {
                        listId,
                        listObj,
                        LIST_OBJ_TYPE: typeof listObj,
                        EXPECTED_OBJ_TYPE: "ShoppingListDocument"

                    },
                    `Error while updating list with id: ${listId} and product with id: ${docId}`
                )
            }
            
            return new ShoppingListResponse(
                ShoppingListResponse.status_codes.OK,
                {},
                'Successfuly updated list item'
            )

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

    async removeItemFromList(listId, itemId){

        let res;

        if (typeof listId === 'string' && typeof itemId === 'string'){
            res = await db.Delete(`shoppingLists/${listId}/products/${itemId}`);

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

    async deleteGroup(listId, groupId) {

        let res = await db.Get(`shoppingLists/${listId}/products/{ "groupId":"${groupId}" }`);

        if (DBResponse.OK(res)) {
            
            let prom = [];
            res.data.forEach( doc => {
                let new_doc = doc.data();
                delete new_doc.groupId;
                prom.push(db.Update(`shoppingLists/${listId}/products/${doc.id}`, new_doc, false));
            });
            await Promise.all(prom);

        } else if (res.status !== DBResponse.status_codes.DOCUMENT_NOT_FOUND) {
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                res,
                `Error while getting document with id: ${listId}`
            );
        }
        
        await db.Delete(`shoppingLists/${listId}/groups/${groupId}`);

    }

    async deleteShoppingList(costumerId, listId){

        if (typeof costumerId !== 'string' || typeof listId !== 'string') {

            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.INVALID_PARAMETER,
                {
                    costumerId: `exprected 'string' but was '${typeof customerId}'`,
                    listId: `expected 'string' but was '${typeof listId}'`
                },
                'Parameter error'
            );
        };

        // delete from users
        let customerListDocument = await db.Get(`shoppingLists/${listId}`);

        if (!DBResponse.OK(customerListDocument)) {
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                customerListDocument,
                `Error while getting document with customer id: ${customerId} and list with key: ${listId}`
            );
        }

        if (customerListDocument.data.length !== 1) {
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                customerListDocument,
                `Response with multi match expected 1`
            );
        }

        let doc = customerListDocument.data[0].data();
        
        while (doc.sharedWith.length > 0) {
            let user = doc.sharedWith.shift();
            let res = await db.Delete(`customers/${user}/sharedLists/{"shoppingListId": "${listId}"}`);

            if (!DBResponse.OK(res)) {
                throw new ShoppingListResponse(
                    ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                    res,
                    `Error while deleting shared list document with id: ${listId} from customer with id: ${user}`
                );
            }
        }

        let res = await db.Delete(`customers/${costumerId}/shoppingLists/{"shoppingListId": "${listId}"}`);
        
        if (!DBResponse.OK(res)) {
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                res,
                `Error while deleting list document with id: ${listId} from customer with id: ${customerId}`
            );
        }

        let products = await db.Get(`shoppingLists/${listId}/products/{}`);
        let groups = await db.Get(`shoppingLists/${listId}/groups/{}`);

        products = (DBResponse.OK(products) ? products.data.map( (e) => e.id): undefined);
        groups = (DBResponse.OK(groups) ? groups.data.map( (e) => e.id): undefined);

        let prom = [];
        if (products) products.forEach((e) => prom.push(this.removeItemFromList(listId, e)));
        if (groups) groups.forEach((e) => prom.push(this.deleteGroup(listId, e)));

        await Promise.all(prom);

        res = await db.Delete(`shoppingLists/${listId}`);

        if (!DBResponse.OK(res)) {
            throw new ShoppingListResponse(
                ShoppingListResponse.status_codes.UNKNOWN_ERROR,
                res,
                `Error while deleting list document with id: ${listId}`
            );
        }

        return new ShoppingListResponse(
            ShoppingListResponse.status_codes.OK,
            {},
            `Successfuly deleted shopping list`
        );
    }

}
module.exports = new ShoppingList();