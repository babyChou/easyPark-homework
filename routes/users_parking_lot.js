const config = require('../config/config.js');
const helper = require('../helper.js');

module.exports.add = function add(req, res, next) {
    const db = req.con;
    const user_id = req.tkAsset.user_id;
    const username = req.tkAsset.username;
    const city = req.body.city;
    const dist = req.body.dist;
    const road = req.body.road;
    const addr = req.body.addr;
    const start_time = req.body.start_time;
    const end_time = req.body.end_time;

    let sql = 'INSERT INTO PARKING_SPACE(Parking_Owner_Id, Parking_City, Parking_Dist, Parking_Addr, Parking_Rent_Start, Parking_Rent_End) VALUES';
        sql += `(${user_id},'${city}','${}','${}','${}','${}')`;

    db.query(sql, function(err, rows) {
        if (err) {
            error = err;
            res.status(500);
            res.json({ 
                message: 'Add space error',
                error: error
            });
            console.log(err);
        }else{      
            // use index.ejs
            // res.render('index', { title: 'Account Information', data: data});
            res.json({ 
                message: 'success',
                parking_lot_id : rows.insertId
            });
        }

    });

    "city" : "xxx",
            "area" : "xxx",
            "road" : "xxx",
            "start_time" : 1589385600,
            "end_time" : 1589385700,
}

module.exports.get = function get(req, res, next) {}
module.exports.modify = function modify(req, res, next) {}
module.exports.delete = function mydelete(req, res, next) {}
module.exports.search = function search(req, res, next) {}