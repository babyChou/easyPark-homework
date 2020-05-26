let md5 = require('md5');
let config = require('../config/config.js');
let defaultPoint = 5;

// https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status
module.exports = function create(req, res, next) {
    let db = req.con;
    let username = req.body.username;
    let password = req.body.password;
    let mobile = req.body.mobile;

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
    let sql = 'INSERT INTO USER_ACCOUNT (User_Name, User_Password, User_mobile, User_Parking_Point) VALUES ';
    sql += `('${username}','${md5(config.HASH_KEY, password)}', '${mobile}', ${defaultPoint})`;


    db.query(sql, function(err, rows) {
        if (err) {
            error = err;
            res.status(500);
            if (err.code == 'ER_DUP_ENTRY') {
                error = 'Duplicated username';
            }
            res.json({ 
                message: 'Create user error',
                error: error
            });
            console.log(err);
        }else{      
            // use index.ejs
            // res.render('index', { title: 'Account Information', data: data});
            res.json({ 
                message: 'success',
                user_id : rows.insertId
            });
        }

    });


    // db.query('SELECT * FROM account', function(err, rows) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     let data = rows;

    //     // use index.ejs
    //     res.render('index', { title: 'Account Information', data: data});
    // });

    // res.render('index', { title: 'Express' });
    
}



