const router = require('express').Router()

const key = require('./../configs/tokens.json');
const interface = require('kolonial_api_wrapper');
const api = new interface(key.kolonial.user_agent, key.kolonial.token);


router.get('/sok', async (req, res, next) => {
  let categories = await api.GetAllCategories()


  res.render('sok', {
    title: 'Sok',
    categories
  })
})

module.exports = router
