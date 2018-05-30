const assert       = require('assert');
const unit         = require('../unit');
const db           = require('../../bin/database');
const shoping_list = require('../../bin/shopping-list');
const DBRes        = require('../../models/database-response');
const ShoppingListDoc = require('../../models/shopping-list-document');
const ProductDoc = require('../../models/product-document');
const ShoppingListResponse = require('../../models/shopping-list-response')

/**
 * ## Test data
*/

const user_id = 'cEx6uZdHs5K7KfUfz6cT';
const list_name = 'Some shopping list';
let list_id;
let product_id;
const date = Date.now();
const productName = "juice";
const kolonialId = '469';
const amount = 3;
const groupId = 'someGroupId';
const color = '#someHex';

/**
 * ## Tests
*/

// -------------

async function TestCreateShoppingListNotShared () {

	await shoping_list.createShoppingList(user_id, list_name, date);

	let res = await db.Get(`shoppingLists/{"name": "${list_name}"}`);

	assert(DBRes.OK(res), res);
    assert.strictEqual(res.data.length, 1, 'Multiple matches.');
    
    list_id = res.data[0].id;

	res = await db.Get(`customers/${user_id}/shoppingLists/{"shoppingListId": "${res.data[0].id}"}`);
	
	assert(DBRes.OK(res), res);

}
TestCreateShoppingListNotShared.description = 'Test ShoppingList::CreateShoppingList(); The list is not shared.';

/**
 * ## Unit Test
*/

async function TestAddItemToShoppingList(){

    let product = new ProductDoc(kolonialId, amount, groupId);

    let productRes = await shoping_list.addProductToList(list_id, product);

    assert(ShoppingListResponse.OK(productRes));

    product_id = productRes.data.id;

}
TestAddItemToShoppingList.description = 'Test ShoppingList::AddProductTOList(); using already created list to add item'

/**
 * ## Unit Test
 */

async function TestGetShoppingListFromService() {

	let res = await shoping_list.getShoppingList(list_id);
    assert(ShoppingListResponse.OK(res));

}
TestGetShoppingListFromService.description = 'Test ShoppingList::GetShoppingList(); using already created list and getting it'


/**
 * ## Unit Test
 */
async function TestGetContentFromShoppingList(){

    let res = await shoping_list.getShoppingListContent(list_id);

    assert.strictEqual(kolonialId, res.data.products[0].kolonialId, `kolonial id not equal`);

}
TestGetContentFromShoppingList.description = 'Test ShoppingList::GetShoppingListContent(); using already created list with content';

/**
 * ## Unit Test
 */
async function TestUpdateShoppingListMeta(){

    let res = await shoping_list.getShoppingListContent(list_id);

    let timeNow = Date.now();

    let updatedResDoc = new ShoppingListDoc(
        res.data.name,
        timeNow,
        res.data.products,
        res.data.groups
    )

    await shoping_list.updateShoppingList(list_id, updatedResDoc);

    let updatedRes = await shoping_list.getShoppingListContent(list_id);
    
    assert.strictEqual(timeNow, updatedRes.data.date, 'Date was not updated');

}
TestUpdateShoppingListMeta.description = 'Test ShoppingList::UpdateShoppingList(); with meta data'

/**
 * ## Unit Test
 */
async function TestUpdateProductInList () {

    let res = await shoping_list.getShoppingListContent(list_id);

    let amount = res.data.products[0].amount;

    let updatedDoc = new ProductDoc(
        res.data.products[0].kolonialId,
        res.data.products[0].amount + 1,
        res.data.products[0].groupId
    )

    await shoping_list.updateShoppingList(list_id, product_id, updatedDoc);

    let updatedRes = await shoping_list.getShoppingListContent(list_id);

    assert.strictEqual(amount + 1, updatedRes.data.products[0].amount);
}
TestUpdateProductInList.description = 'Test ShoppingList::UpdateShoppingContent(); with meta data'

async function TestDeleteProductsFromList (){

    let res = await shoping_list.removeItemFromList(list_id, product_id);

    assert(ShoppingListResponse.OK(res), res);

    let failRes = await shoping_list.getShoppingListContent(list_id);

    assert.strictEqual(0, failRes.data.products.length, 'expected empty list but was not');

}
TestDeleteProductsFromList.description = 'Test ShoppingList::removeItemFromList(); deleting 1 document'


async function TestDeleteList () {

    let res = await shoping_list.deleteShoppingList(user_id, list_id);

    assert(ShoppingListResponse.OK(res), res);

    try {
        let failRes = await shoping_list.getShoppingList(list_id);
        assert.fail('Found document, but expected not to');
    } catch (e) {
        assert.strictEqual(ShoppingListResponse.status_codes.UNKNOWN_ERROR, e.status, 'Document still exists')
    }

}

let addToList = unit.series(
    TestCreateShoppingListNotShared, 
    TestAddItemToShoppingList, 
    TestGetShoppingListFromService, 
    TestGetContentFromShoppingList,
    TestUpdateShoppingListMeta,
    TestUpdateProductInList,
    TestDeleteProductsFromList,
    TestDeleteList);
    
module.exports = unit.test(addToList);