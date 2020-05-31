const config = require('../config/config.js');
const helper = require('../helper.js');

const toMysqlFormat = helper.toMysqlFormat;
const toTimestamp = helper.toTimestamp;


/*
Add parking lot:
{
    "city" : "xxx",
    "dist" : "xxx",
    "addr" : "xxx",
    "start_time" : 1589385600,
    "end_time" : 1589385700,
}*/
module.exports.add = function add(req, res, next) {
    const db = req.con;
    const user_id = req.tkAsset.user_id;
    const username = req.tkAsset.username;
    const city = req.body.city;
    const dist = req.body.dist;
    const addr = req.body.addr;
    const start_time = req.body.start_time;
    const end_time = req.body.end_time;
    
    let sql = 'INSERT INTO PARKING_SPACE(Parking_Owner_Id, Parking_City, Parking_Dist, Parking_Addr';
    let sqlVal = `${user_id},'${city}','${dist}','${addr}'`;

    if(!!start_time) {
        let t = new Date(start_time*1000);
        sql += ', Parking_Rent_Start';
        sqlVal += `,'${toMysqlFormat(t)}'`;
    }

    if(!!end_time) {
        let t = new Date(end_time*1000);
        sql += ', Parking_Rent_End';
        sqlVal += `,'${toMysqlFormat(t)}'`;
    }

    sql += ') VALUES';
    sql += `(${sqlVal});`;



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

}

// Get parking lot : http://localhost:3000/parking?parking_lot_id=1
module.exports.get = function get(req, res, next) {
    const db = req.con;
    const user_id = req.tkAsset.user_id;
    const username = req.tkAsset.username;
    const parking_lot_id = Number(req.query.parking_lot_id);

    let sql = 'SELECT * FROM PARKING_SPACE AS P LEFT JOIN USER_ACCOUNT AS U ';
        sql += 'ON P.Parking_User_Id= U.User_Id '
        sql += `WHERE Parking_Owner_Id = ${user_id}`;

    if(parking_lot_id) {
        sql += ` AND Parking_Space_Id = ${parking_lot_id};`;
    }

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
                let resData = {
                    parking_lot_id : row.Parking_Space_Id,
                    city : row.Parking_City,
                    dist : row.Parking_Dist,
                    addr : row.Parking_Addr,
                    renting_status : (!!row.Parking_Lot_Status ? row.Parking_Lot_Status: 'vacant'),
                    start_time : toTimestamp(row.Parking_Rent_Start),
                    end_time : toTimestamp(row.Parking_Rent_End),
                };
                if(row.Parking_User_Id) {
                    resData.lessee = row.User_Name;
                    resData.lessee_mobile = row.User_mobile;
                    resData.lessee_user_id = row.Parking_User_Id;
                    resData.use_start = toTimestamp(row.Parking_Use_Start);
                }
                return resData;
            });
            
            res.json({ 
                data: result
            });
        }

    });

}

module.exports.modify = function modify(req, res, next) {
    const db = req.con;
    const user_id = req.tkAsset.user_id;
    const username = req.tkAsset.username;
    const paramsColumns = {
        city : 'Parking_City',
        dist : 'Parking_Dist',
        addr : 'Parking_Addr',
        start_time : 'Parking_Rent_Start',
        end_time : 'Parking_Rent_End'
    };

    const parking_lot_id = Number(req.body.parking_lot_id);
   

    let sql = 'UPDATE PARKING_SPACE SET ';
    let sqlColumns = [];

    for(let param in req.body) {
        let sqlColumn = paramsColumns[param];
        if(!!sqlColumn) {
            if(param.match('_time')) {
                let t = new Date(req.body[param]*1000);
                sqlColumns.push(`${sqlColumn}='${toMysqlFormat(t)}'`);
            }else{
                sqlColumns.push(`${sqlColumn}='${req.body[param]}'`);
            }
        }

    }

    sql += sqlColumns.join(', ');
    sql += `WHERE Parking_Owner_Id = ${user_id} AND Parking_Space_Id = ${parking_lot_id};`;


    db.query(sql, function(err, rows) {
        if (err) {
            error = err;
            res.status(500);
            res.json({ 
                message: 'Modify space error',
                error: error
            });
            console.log(err);
        }else{      
            res.json({ 
                message: 'success',
                parking_lot_id : parking_lot_id
            });
        }

    });
}

module.exports.delete = function mydelete(req, res, next) {
    const db = req.con;
    const user_id = req.tkAsset.user_id;
    const username = req.tkAsset.username;
    const parking_lot_id = Number(req.query.parking_lot_id);

    let sql = `DELETE FROM PARKING_SPACE WHERE Parking_Owner_Id = ${user_id} AND Parking_Space_Id = ${parking_lot_id};`;

    db.query(sql, function(err, rows) {
        if (err) {
            error = err;
            res.status(500);
            res.json({ 
                message: 'DELETE space error',
                error: error
            });
            console.log(err);
        }else{
            
            res.json({ 
                message : "Success",
                parking_lot_id : parking_lot_id,
            });
        }

    });
}

// Search available parking lot
// http://localhost:3000/search/parking?city=xxx&area=xxxx&road=xxx&start=xxx&end=xxx
module.exports.search = function search(req, res, next) {
    const db = req.con;
    const user_id = req.tkAsset.user_id;
    const username = req.tkAsset.username;

    const city = req.query.city;
    const dist = req.query.dist;
    const addr = req.query.addr;
    const start_time = new Date(Number(req.query.start_time)*1000);
    const end_time = new Date(Number(req.query.end_time)*1000);

    // let sql = 'SELECT * FROM PARKING_SPACE AS P, USER_ACCOUNT AS U ';
    //     sql += 'WHERE P.Parking_Owner_Id = U.User_Id AND ';
    //     sql += `(P.Parking_Lot_Status IS NULL OR P.Parking_Lot_Status = '${'vacant'}') AND `;
    //     sql += `P.Parking_Rent_Start < '${toMysqlFormat(start_time)}' AND `;
    //     sql += `P.Parking_Rent_End > '${toMysqlFormat(end_time)}'`;

    let sql = `SELECT * FROM PARKING_SPACE AS P, USER_ACCOUNT AS U
                WHERE P.Parking_Owner_Id NOT IN (SELECT B.Black_Owner_Id FROM BLACK_LIST AS B WHERE B.Black_User_id=${user_id}) AND
                P.Parking_Owner_Id = U.User_Id AND 
                (P.Parking_Lot_Status IS NULL OR P.Parking_Lot_Status = '${'vacant'}') AND
                P.Parking_Rent_Start < '${toMysqlFormat(start_time)}' AND
                P.Parking_Rent_End > '${toMysqlFormat(end_time)}'
                `;

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
                    parking_lot_id : row.Parking_Space_Id,
                    lessor : row.User_Name,
                    lessor_mobile : row.User_mobile,
                    city : row.Parking_City,
                    dist : row.Parking_Dist,
                    addr : row.Parking_Addr,
                    start_time : toTimestamp(row.Parking_Rent_Start),
                    end_time : toTimestamp(row.Parking_Rent_End)
                };
            });
            
            res.json({ 
                data: result
            });
        }

    });
}