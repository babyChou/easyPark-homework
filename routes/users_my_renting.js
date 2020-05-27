let config = require('../config/config.js');
let helper = require('../helper.js');

module.exports.myRenting = function myRenting(req, res, next) {
    let db = req.con;
    let user_id = req.tkAsset.user_id;
    let username = req.tkAsset.username;
    // TODO: test

    // let sql = 'SELECT P.Parking_User_Id, U.User_Id FROM PARKING_SPACE AS P, USER_ACCOUNT AS U WHERE ';
    // sql += `U.User_id = '${user_id} AND U.User_id = P.Parking_User_Id'`;

    let sql = 'SELECT * FROM PARKING_SPACE AS P LEFT JOIN USER_ACCOUNT AS U ';
        sql += 'ON P.Parking_Owner_Id = U.User_Id';
        sql += 'WHERE P.Parking_User_Id = ' + user_id;


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
                let data = [];
                for(row in rows) {
                    data.push({
                        parking_lot_id : row.Parking_Lot_Id,
                        renting_status : row.Parking_Lot_Status,
                        start_time : row.Parking_Rent_Start,
                        end_time : row.Parking_Rent_End,
                        lessor : row.User_Name,
                        lessor_mobile : row.mobile
                    });
                }

                res.json({
                    data
                });


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
    
};

module.exports.stopRenting = function stopRenting(req, res, next) {
    let db = req.con;
    let user_id = req.tkAsset.user_id;
    let username = req.tkAsset.username;
    let parking_lot_id = req.body.parking_lot_id;
    // TODO: Update PARKING_SPACE (Parking_Lot_Status, Parking_User_Id=null, Parking_Use_Start=null)
    // TODO: Update CONSUME_RECORD (*)
    // TODO: Update USER_ACCOUNT (User_Parking_Point)

    let sql = 'Update * FROM PARKING_SPACE AS P LEFT JOIN USER_ACCOUNT AS U ';
        sql += 'ON P.Parking_Owner_Id = U.User_Id';
        sql += 'WHERE P.Parking_User_Id = ' + user_id;

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

        }
    });
};

module.exports.renting = function renting(req, res, next) {
    let db = req.con;
    let user_id = req.tkAsset.user_id;
    let username = req.tkAsset.username;
    let parking_lot_id = req.body.parking_lot_id;
    // TODO: Update PARKING_SPACE (Parking_Lot_Status, Parking_User_Id, Parking_Use_Start)


};
