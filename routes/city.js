const config = require('../config/config.js');
const helper = require('../helper.js');



module.exports.city = function consume(req, res, next) {
	let db = req.con;
	let sql = `SELECT * FROM CITY`;

	db.query(sql, function(err, rows) {
        if (err) {
            error = err;
            res.status(500);
            res.json({ 
                message: 'Query error',
                error: error
            });
            console.log(err);
        }else{
            let result = rows.filter(row => row.City_city != 'City_city').map(row => {
                return {
                	city : row.City_city
                };
            });
            res.json({ 
                data : result
            });
        }

    });
}

module.exports.dist = function consume(req, res, next) {
	let db = req.con;
	let city = req.query.city;
	let sql = `SELECT * FROM DIST WHERE Dist_city = '${city}'`;


	db.query(sql, function(err, rows) {
        if (err) {
            error = err;
            res.status(500);
            res.json({ 
                message: 'Query error',
                error: error
            });
            console.log(err);
        }else{
            let result = rows.map(row => {
                return {
                	dist : row.Dist_dist
                };
            });
            res.json({ 
                data : result
            });
        }

    });
}

module.exports.road = function consume(req, res, next) {
	let db = req.con;
	let dist = req.query.dist;
	let sql = `SELECT * FROM ROAD WHERE Road_dist = '${dist}'`;

	db.query(sql, function(err, rows) {
        if (err) {
            error = err;
            res.status(500);
            res.json({ 
                message: 'Query error',
                error: error
            });
            console.log(err);
        }else{
            let result = rows.filter(row => row.Road_dist != 'Road_dist').map(row => {
                return {
                	road : row.Road_road
                };
            });
            res.json({ 
                data : result
            });
        }

    });
}