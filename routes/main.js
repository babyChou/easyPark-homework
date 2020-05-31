const express = require('express');
const helper = require('../helper.js');
const user_create = require('./users_create.js');
const user_login = require('./users_login.js');
const my_renting = require('./users_my_renting.js');
const user = require('./users_user.js');
const users_parking_lot = require('./users_parking_lot.js');
const consume = require('./consume.js');
const blacklist = require('./blacklist.js');

const indexRouter = require('./index');
let router = express.Router();

/* GET home page. */
router.get('/', indexRouter);

router.post('/user/create', user_create);
router.post('/user/login', user_login);
router.get('/user', helper.tokenCheck, user);
router.get('/my/renting',helper.tokenCheck, my_renting.myRenting);
router.post('/my/renting/stop',helper.tokenCheck, my_renting.stopRenting);
router.get('/search/parking', helper.tokenCheck, users_parking_lot.search);
router.post('/renting/parking', helper.tokenCheck, my_renting.renting);


router.get('/parking', helper.tokenCheck, users_parking_lot.get); //parking?parking_lot_id=1
router.post('/parking', helper.tokenCheck, users_parking_lot.add);
router.put('/parking', helper.tokenCheck, users_parking_lot.modify);
router.delete('/parking', helper.tokenCheck, users_parking_lot.delete);

router.post('/blacklist/add', helper.tokenCheck, blacklist.add);
router.post('/blacklist/cancel', helper.tokenCheck, blacklist.cancel);
router.get('/parking/consume/record', helper.tokenCheck, consume);

module.exports = router;

