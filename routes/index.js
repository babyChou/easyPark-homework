var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.redirect('/login.html');
	// res.render('index', { title: 'Hey', message: 'Hello there!'});
  	// res.send('respond with a resource');
});

module.exports = router;