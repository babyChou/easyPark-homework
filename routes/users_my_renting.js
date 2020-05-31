const config = require('../config/config.js');
const helper = require('../helper.js');
const toTimestamp = helper.toTimestamp;

module.exports.myRenting = function myRenting(req, res, next) {
    let db = req.con;
    let user_id = req.tkAsset.user_id;
    let username = req.tkAsset.username;

    let sql = 'SELECT * FROM PARKING_SPACE AS P LEFT JOIN USER_ACCOUNT AS U ';
        sql += 'ON P.Parking_Owner_Id = U.User_Id ';
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
            let result = rows.map(row => {
                return {
                    parking_lot_id : row.Parking_Lot_Id,
                    renting_status : row.Parking_Lot_Status,
                    lessor : row.User_Name,
                    lessor_mobile : row.mobile,
                    use_start : toTimestamp(row.Parking_Use_Start),
                    start_time : toTimestamp(row.Parking_Rent_Start),
                    end_time : toTimestamp(row.Parking_Rent_End)
                };
            });

            res.json({
                data : result
            });

        }

    });
    
};

module.exports.stopRenting = function stopRenting(req, res, next) {
    const db = req.con;
    const user_id = req.tkAsset.user_id;
    const username = req.tkAsset.username;
    const parking_lot_id = req.body.parking_lot_id;
    // INSERT CONSUME_RECORD
    let sql = `INSERT INTO CONSUME_RECORD (Cos_User_Id, Cos_Parking_Owner_Id, Cos_Parking_Space_Id, Cos_Start_Time, Cos_End_Time, Cos_Consume_Point)
                SELECT Parking_User_Id, Parking_Owner_Id, Parking_Space_Id, Parking_Use_Start, now(), TIMESTAMPDIFF(HOUR, Parking_Use_Start, now())
                FROM PARKING_SPACE
                WHERE Parking_Space_Id =${parking_lot_id} AND Parking_User_Id=${user_id}`;
    // Update USER_ACCOUNT (User_Parking_Point) lessor
    let sqlEncrePoint = `UPDATE USER_ACCOUNT AS U INNER JOIN (SELECT Cos_Parking_Owner_Id, Cos_Consume_Point FROM CONSUME_RECORD WHERE Cos_Id={COS_ID}) AS C
                        ON U.User_Id=C.Cos_Parking_Owner_Id
                        SET U.User_Parking_Point=(U.User_Parking_Point + C.Cos_Consume_Point)
                        WHERE U.User_Id IN (SELECT Parking_Owner_Id FROM PARKING_SPACE WHERE Parking_Space_Id=${parking_lot_id});`;
    // Update USER_ACCOUNT (User_Parking_Point) lessee
    let sqlDecrePoint = `UPDATE USER_ACCOUNT AS U INNER JOIN (SELECT Cos_Parking_Owner_Id, Cos_Consume_Point FROM CONSUME_RECORD WHERE Cos_Id={COS_ID}) AS C
                        ON U.User_Id=C.Cos_Parking_Owner_Id
                        SET U.User_Parking_Point=(U.User_Parking_Point - C.Cos_Consume_Point)
                        WHERE U.User_Id IN (SELECT Parking_User_Id FROM PARKING_SPACE WHERE Parking_User_Id=${user_id});`;
    // Update PARKING_SPACE (Parking_Lot_Status, Parking_User_Id=null, Parking_Use_Start=null)
    let sqlResetParkingSpace = `UPDATE PARKING_SPACE SET Parking_Lot_Status='vacant', Parking_User_Id=NULL, Parking_Use_Start=NULL
                                WHERE Parking_Space_Id =${parking_lot_id} AND Parking_User_Id=${user_id};`;

    (new Promise((resolve, reject) => {

        db.query(sql, function(err, rows) {
            if (err) {
                reject(err)
            }else{
                resolve(rows);
            }
        });

    })).then(rows => {
        let sql = '';
        sqlEncrePoint = sqlEncrePoint.replace('{COS_ID}', rows.insertId);
        sqlDecrePoint = sqlDecrePoint.replace('{COS_ID}', rows.insertId);

        sql = sqlEncrePoint + sqlDecrePoint + sqlResetParkingSpace;

        db.query(sql, function(err, rows) {
            if (err) {
                res.status(500);
                res.json({ 
                    message: 'Query space error',
                    error: err
                });
            }else{
                res.json({ 
                    message: "Success"
                });
            }
        });



    }).catch(err => {
        res.status(500);
        res.json({ 
            message: 'Query space error',
            error: err
        });
        console.log(err);
    });    
};



module.exports.renting = function renting(req, res, next) {
    let db = req.con;
    let user_id = req.tkAsset.user_id;
    let username = req.tkAsset.username;
    let parking_lot_id = Number(req.body.parking_lot_id);

    let sql = `UPDATE PARKING_SPACE SET Parking_Lot_Status='occupied', Parking_Use_Start=now(), Parking_User_Id=${user_id} `;
        sql += 'WHERE Parking_Space_Id = ' + parking_lot_id;

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
            res.json({ 
                message: 'Success'
            });
        }
    });


};

