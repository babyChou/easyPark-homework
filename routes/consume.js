let config = require('../config/config.js');
let helper = require('../helper.js');

module.exports = function user(req, res, next) {
    let db = req.con;
    let user_id = req.tkAsset.user_id;
    let username = req.tkAsset.username;

    let sql = 'SELECT User_mobile, User_Parking_Point FROM USER_ACCOUNT WHERE ';
    sql += `User_id = '${user_id}'`;


    db.query(sql, function(err, rows) {
        if (err) {
            error = err;
            res.status(500);
            res.json({ 
                message: 'Query user error',
                error: error
            });
            console.log(err);
        }else{
            if (rows.length > 0) {
                res.json({ 
                    username: username,
                    user_id : user_id,
                    mobile : rows[0].User_mobile,
                    parking_point : rows[0].User_Parking_Point,
                });
            }else{
                res.json({ 
                    message: 'Get user failed',
                    error: 'No user data match this request.'
                });
            }
        }

    });
    
}



