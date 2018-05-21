/*jshint esversion: 6 */ 
/*jshint node: true */ 
 
const express = require('express'); 
const router = express.Router(); 
 
const key = require('./../configs/tokens.json'); 
const interface = require('kolonial_api_wrapper'); 
const api = new interface(key.kolonial.user_agent, key.kolonial.token); 
 
/* GET home page. */ 
router.get('/', async function(req, res, next) { 
 
    let recipe = await api.GetRecipeBySearch('Mango'); 
 
  res.render('oppskrifter', { 
    title: 'Oppskrifter', 
    recipe 
  }); 
 
 
}); 
 
module.exports = router; 
