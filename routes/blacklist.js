let config = require('../config/config.js');
let helper = require('../helper.js');


module.exports.add = function add(req, res, next) {
	let db = req.con;
    let user_id = req.tkAsset.user_id;
    let username = req.tkAsset.username;
    let add_user_id = req.body.user_id;
    let sql = `INSERT INTO BLACK_LIST (Black_User_id, Black_Owner_Id) VALUES (${add_user_id}, ${user_id})`;

    db.query(sql, function(err, rows) {
        if (err) {
            error = err;
            res.status(500);
            res.json({ 
                message: 'Add blacklist error',
                error: error
            });
            console.log(err);
        }else{
            res.json({ 
                message: 'Success'
            });
        }

    });
};

module.exports.cancel = function modify(req, res, next) {
	let db = req.con;
    let user_id = req.tkAsset.user_id;
    let username = req.tkAsset.username;
    let add_user_id = req.body.user_id;
    let sql = `DELETE FROM BLACK_LIST WHERE Black_User_id=${add_user_id} AND Black_Owner_Id=${user_id}`;

    db.query(sql, function(err, rows) {
        if (err) {
            error = err;
            res.status(500);
            res.json({ 
                message: 'cancel blacklist error',
                error: error
            });
            console.log(err);
        }else{
            res.json({ 
                message: 'Success'
            });
        }

    });
};

