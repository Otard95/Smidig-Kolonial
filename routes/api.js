/*jshint esversion: 6 */
/*jshint node: true */

const express = require('express');
const router = express.Router();

const key = require('./../configs/tokens.json');
const interface = require('kolonial_api_wrapper');
const api = new interface(key.kolonial.user_agent, key.kolonial.token);

/* GET home page. */
router.get('/', (req, res) => {

	res.json({
		routes: [
			'/',
			'/categories',
			'/category/:id',
			'/item/:id',
			'/item/search?name=<item name>',
			'/recipe/search?name=<name query>',
			'/recipe/suggested',
			'/recipe/:id'
		]
	})

});

router.get('/categories', async function (req, res, next) {

	try {

		let categories = await api.GetAllCategories();
		res.json(categories);

	} catch (e) {

		res.status(500);
		res.json({ error: e });

	}
	
});

router.get('/category/:id', async (req, res) => {

	let id = parseInt(req.params.id);
	if (id === NaN || ('' + id) !== req.params.id) {

		res.status(404);
		res.json({ message: 'Can only get category by id.' });
		return;

	}

	try {

		let api_res = await api.GetCategoryById(id);
		res.json(api_res);

	} catch (e) {

		res.status(404);
		res.json(e);

	}

});

router.get('/item/search', async (req, res) => {

	let item_name = req.query.name;

	if (typeof item_name !== 'string') {

		res.status(400);
		res.json({ message: 'Query string "name" required.' });
		return;

	}

	try {

		let items = await api.GetItemBySearch(item_name);
		res.json(items);

	} catch (e) {

		res.status(404);
		res.json(e);

	}

});

router.get('/item/:id', async (req, res) => {

	let id = parseInt(req.params.id);
	if (id === NaN || ('' + id) !== req.params.id) {

		res.status(404);
		res.json({ message: 'Invalid id format or resouce.' });
		return;

	}

	try {

		let api_res = await api.GetItemById(id);
		res.json(api_res);

	} catch (e) {

		res.status(404);
		res.json(e);

	}

});

router.get('/recipe/search', async (req, res) => {

	let recipe_name = req.query.name;

	if (typeof recipe_name !== 'string') {

		res.status(400);
		res.json({ message: 'Query string "name" required.' });
		return;

	}

	try {

		let items = await api.GetRecipeBySearch(recipe_name);
		res.json(items);

	} catch (e) {

		res.status(404);
		res.json(e);

	}

});

router.get('/recipe/suggested', async (req, res) => {

	try {

		let items = await api.GetRecipeSuggestions();
		res.json(items);

	} catch (e) {

		res.status(404);
		res.json(e);

	}

});

router.get('/recipe/:id', async (req, res) => {

	let id = parseInt(req.params.id);
	if (id === NaN || ('' + id) !== req.params.id) {

		res.status(404);
		res.json({ message: 'Invalid id format or resource.' });
		return;

	}

	try {

		let api_res = await api.GetRecipeById(id);
		res.json(api_res);

	} catch (e) {

		res.status(404);
		res.json(e);

	}

});

module.exports = router;