let md5 = require('md5');
let config = require('../config/config.js');
let helper = require('../helper.js');
let defaultPoint = 5;
// https://juejin.im/post/5dc379b5e51d456e35627383
// https://medium.com/karinsu/express-%E7%B0%A1%E6%98%93-passport-jwt-%E8%AA%8D%E8%AD%89-9472e35b5d43
// https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status
module.exports = function login(req, res, next) {
    let db = req.con;
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        res.status(400);
        res.json({ 
            message: 'Create user error',
            error: 'Parameters error.'
        });
        return false;

    }

    // console.log()
    // console.log(md5(config.HASH_KEY, 'qwertyui'))
    let sql = 'SELECT User_Id, User_Name, User_Password FROM USER_ACCOUNT WHERE ';
    sql += `User_Name = '${username}' AND User_Password = '${md5(config.HASH_KEY, password)}'`;


    db.query(sql, function(err, rows) {
        if (err) {
            error = err;
            res.status(500);
            res.json({ 
                message: 'Create user error',
                error: error
            });
            console.log(err);
        }else{
            if (rows.length > 0) {
                const tokens = helper.tokenGen({
                            "user_id": rows[0].User_Id,
                            "username": username
                        });
                res.json({ 
                    message: 'success',
                    user_id : rows[0].User_Id,
                    token : tokens.token
                });
            }else{
                res.json({ 
                    message: 'Login failed',
                    error: 'No user data match this request.'
                });
            }
        }

    });
    
}



