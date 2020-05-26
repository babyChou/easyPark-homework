let express = require('express');
let helper = require('../helper.js');
let user_create = require('./users_create.js');
let user_login = require('./users_login.js');
let user = require('./users_user.js');
let router = express.Router();

/* GET home page. */
router.post('/create', user_create);
router.post('/login', user_login);
router.get('/',helper.tokenCheck, user);

module.exports = router;

