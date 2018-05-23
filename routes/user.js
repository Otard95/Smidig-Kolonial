
const router = require('express').Router();
const url    = require('url');
const OAuth  = require('../bin/OAuth');

router.get('/login', (req, res) => {

	action = '/user/login/auth';
	if (req.query.redirect)
		action += '?redirect=' + encodeURIComponent(req.query.redirect);

	res.render('login', {
		title: 'Login',
		message: req.query.m,
		action
	});

});

router.post('/login/auth', OAuth.Authenticate('email', 'password'), (req, res) => {

	if (!req.authenticated) {
		req.query.m = 'Pass på at du skriver inn brukernavn og passord riktig.';
		res.redirect(url.format({
			pathname: '/user/login',
			query: req.query
		}));
	} else {
		res.redirect(url.format({
			pathname: req.query.redirect || '/',
			query: { m: 'Velkommen tilbake!' }
		}));
	}

});

router.get('/logout', OAuth.Logout());

module.exports = router;