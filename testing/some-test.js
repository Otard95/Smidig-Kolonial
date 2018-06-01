
const db = require('../bin/database');

async function test () {
	
	let res = await db.Get('customers/cEx6uZdHs5K7KfUfz6cT/shoppingLists/{"key": "get_me"}');

	let doc = await res.data[0].data().ref.get();

	console.log(doc);

}

test().then( process.exit ).catch( err => {
	console.log(err);
	process.exit();
});