let express = require('express');
let helper = require('../helper.js');
let user_create = require('./users_create.js');
let user_login = require('./users_login.js');
let my_renting = require('./users_my_renting.js');
let user = require('./users_user.js');
let users_parking_lot = require('./users_parking_lot.js');
let consume = require('./consume.js');
let blacklist = require('./blacklist.js');
let router = express.Router();

/* GET home page. */
router.post('/create', user_create);
router.post('/login', user_login);
router.get('/', helper.tokenCheck, user);
router.post('/renting/parking', helper.tokenCheck, my_renting.renting);
router.get('/my/renting',helper.tokenCheck, my_renting.myRenting);
router.post('/my/renting/stop',helper.tokenCheck, my_renting.stopRenting);
router.get('/search/parking', helper.tokenCheck, users_parking_lot.search);
router.get('/parking', helper.tokenCheck, users_parking_lot.get); //parking?parking_lot_id=1
router.post('/parking', helper.tokenCheck, users_parking_lot.add);
router.put('/parking', helper.tokenCheck, users_parking_lot.modify);
router.delete('/parking', helper.tokenCheck, users_parking_lot.delete);

router.post('/blacklist/add', helper.tokenCheck, blacklist.add);
router.post('/blacklist/cancel', helper.tokenCheck, blacklist.cancel);
router.get('/parking/consume/record', helper.tokenCheck, consume);

module.exports = router;

