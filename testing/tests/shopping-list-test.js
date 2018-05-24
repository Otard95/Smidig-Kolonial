const assert       = require('assert');
const unit         = require('../unit');
const db           = require('../../bin/database');
const shoping_list = require('../../bin/shopping-list');
const DBRes        = require('../../models/database-response');
const ShoppingListDoc = require('../../models/shopping-list-document');
const ProductDoc = require('../../models/product-document');

/**
 * ## Test data
*/

const user_id = 'cEx6uZdHs5K7KfUfz6cT';
const list_name = 'Some shopping list';
const list_id = '7vaXLgq3hDZ3luAnYXPv';
const product_id = 'sVwseIGDd7uNTwjpiQ42';
const date = Date.now();
const productName = "juice";
const kolonialId = '3rwr3wbw3krb3wkrb3jbrjw3r';
const amount = 3;
const groupId = '4t4ete4te4gfe4t4';
const color = '#someHex';

/**
 * ## Tests
*/

// -------------

async function TestCreateShoppingListNotShared () {

	await shoping_list.createShoppingList(user_id, list_name, date);

	let res = await db.Get(`shoppingLists/{"name": "${list_name}"}`);

	assert(DBRes.OK(res));
	assert(res.data.length == 1, 'Multiple matches.');

	res = await db.Get(`customers/${user_id}/shoppingLists/{"shoppingListId": "${res.data[0].id}"}`);
	
	assert(DBRes.OK(res));

}
TestCreateShoppingListNotShared.description = 'Test ShoppingList::CreateShoppingList(); The list is not shared.';

/**
 * ## Unit Test
*/

async function TestAddItemToShoppingList(){

    let res = await db.Get(`shoppingLists/{"name": "${list_name}"}`);

    assert(DBRes.OK(res));
    assert(res.data.length == 1, 'Multiple matches.');

    let product = new ProductDoc(kolonialId, amount, groupId);

    let productRes = await shoping_list.addProductToList(res.data[0].id, product);

    assert(DBRes.OK(productRes));
}
TestAddItemToShoppingList.description = 'Test ShoppingList::AddProductTOList(); using already created list to add item'

/**
 * ## Unit Test
 */

async function TestGetShoppingListFromService() {

	let res = await shoping_list.getShoppingList(list_id);
    assert(DBRes.OK(res));

	assert.strictEqual(list_id, res.data[0].id, `Id not equal`)
}
TestGetShoppingListFromService.description = 'Test ShoppingList::GetShoppingList(); using already created list and getting it'


/**
 * ## Unit Test
 */
async function TestGetContentFromShoppingList(){

    let res = await shoping_list.getShoppingListContent(list_id);

    assert.strictEqual(kolonialId, res.data.products[0].kolonialId, `kolonial id not equal`)
    assert.strictEqual(color, res.data.groups[0].color, `color not equal`)
}
TestGetContentFromShoppingList.description = 'Test ShoppingList::GetShoppingListContent(); using already created list with content';



let addToList = unit.series(TestCreateShoppingListNotShared, TestAddItemToShoppingList, TestGetShoppingListFromService, TestGetContentFromShoppingList);
module.exports = unit.test(addToList);