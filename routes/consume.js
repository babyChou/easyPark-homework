const config = require('../config/config.js');
const helper = require('../helper.js');
const toTimestamp = helper.toTimestamp;

module.exports = function consume(req, res, next) {
    let db = req.con;
    let user_id = req.tkAsset.user_id;
    let username = req.tkAsset.username;

    let sql = `SELECT DISTINCT C.Cos_Parking_Space_Id, C.Cos_User_Id, C.Cos_Parking_Owner_Id, C.Cos_Start_Time, C.Cos_End_Time, C.Cos_Consume_Point,
                    (SELECT U.User_Name FROM USER_ACCOUNT AS U WHERE U.User_Id=C.Cos_Parking_Owner_Id) AS Parking_Owner_name, 
                    (SELECT U.User_Name FROM USER_ACCOUNT AS U WHERE U.User_Id=C.Cos_User_Id) AS Parking_User_name
                FROM CONSUME_RECORD AS C
                WHERE C.Cos_User_Id=${user_id} OR C.Cos_Parking_Owner_Id=${user_id}`;

    db.query(sql, function(err, rows) {
        if (err) {
            error = err;
            res.status(500);
            res.json({ 
                message: 'Query consume error',
                error: error
            });
            console.log(err);
        }else{
            let result = rows.map(row => {
                return {
                    parking_lot_id: row.Cos_Parking_Space_Id,
                    lessee : row.Parking_User_name,
                    lessee_user_id : row.Cos_User_Id,
                    lessor : row.Parking_Owner_name,
                    lessor_user_id : row.Cos_Parking_Owner_Id,
                    consume_point : row.Cos_Consume_Point,
                    start_time : toTimestamp(row.Cos_Start_Time),
                    end_time : toTimestamp(row.Cos_End_Time)
                };
            });
            res.json({ 
                data : result
            });
        }

    });
    
}



