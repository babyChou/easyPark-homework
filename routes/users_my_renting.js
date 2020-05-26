let config = require('../config/config.js');
let helper = require('../helper.js');

module.exports = function myRenting(req, res, next) {
    let db = req.con;
    let user_id = req.tkAsset.user_id;
    let username = req.tkAsset.username;

    //TODO: join
    let sql = 'SELECT Parking_User_Id FROM PARKING_SPACE WHERE ';
    sql += `User_id = '${user_id}'`;



    db.query(sql, function(err, rows) {
        if (err) {
            error = err;
            res.status(500);
            res.json({ 
                message: 'Query space error',
                error: error
            });
            console.log(err);
        }else{
            if (rows.length > 0) {
                // res.json({ 
                //     data : {
                //         parking_lot_id : 
                //         renting_status : 
                //         start_time : 
                //         end_time : 
                //         lessor : 
                //         lessor_mobile : 
                //     }

                // });

                // {
                //     "data" : [{
                //         "parking_lot_id" : 1,
                //         "renting_status" : "vacant",
                //         "start_time" : 1589385600,
                //         "end_time" : 1589385700,
                //         "lessor" : "Jhon",
                //         "lessor_mobile" : "0915368749",
                //     }]
                // }

            }else{
                res.json({ 
                    message: 'Get user failed',
                    error: 'No user data match this request.'
                });
            }
        }

    });
    
}



