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
			'/category/:id'
		]
	})

});

router.get('/categories', async function (req, res, next) {

	let categories = await api.GetAllCategories();

	res.json({
		categories
	});

});

router.get('/category/:id', async (req, res) => {

	let int = parseInt(req.params.id);
	if (int !== NaN && ('' + int) === req.params.id) {

		try {
			let api_res = await api.GetCategoryById(int);
			res.json(api_res);
		} catch (e) {
			res.status(404);
			res.json(e);
		}

	} else {

		res.status(404);
		res.json({ message: 'Can only get category by id.' });

	}

});

module.exports = router;