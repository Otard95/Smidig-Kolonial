const assert       = require('assert');
const unit         = require('../unit');
const db           = require('../../bin/database');
const shoping_list = require('../../bin/shopping-list');
const DBRes        = require('../../models/database-response');

/**
 * ## Test data
*/

const user_id = 'cEx6uZdHs5K7KfUfz6cT';
const list_name = 'Some shopping list';
const date = Date.now();

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

module.exports = unit.test(TestCreateShoppingListNotShared)