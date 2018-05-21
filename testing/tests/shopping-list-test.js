const assert       = require('assert');
const unit         = require('../unit');
const db           = require('../../bin/database');
const shoping_list = require('../../bin/shopping-list');
const DBRes        = require('../../models/database-response');

/**
 * ## Test data
*/

const user_id = 's0m3Tes7U5er';
const list_name = 'Some shopping list';
const date = Date.now();

/**
 * ## Unit Tests
*/

// -------------

async function TestCreateShoppingListNotShared () {

	await shoping_list.createShoppingList(user_id, list_name, date);

	let res = await db.GetDocument(`shoppingLists/{"name": "${list_name}"}`);

	assert(DBRes.OK(res));

	res = await db.GetDocument(`customers/${user_id}`);

	assert(DBRes.OK(res));

}
TestCreateShoppingListNotShared.description = 'Test ShoppingList::CreateShoppingList(); The list is not shared.';
