const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('./config/config.js');

const jwtSecret = config.HASH_KEY;
const EXPIRES_DAY = 7;

/*
	algorithm : String,
	secret : String,
	password : password
	return : String
*/
function encrypt(algorithm, secret, password) {

	let cipher = crypto.createCipher(algorithm, secret);
	let crypted = cipher.update(password,'utf8','hex');

	crypted += cipher.final('hex');

	return crypted;

}

/*
	algorithm : String,
	secret : String,
	password : password
	return : String
*/
function decrypt(algorithm, secret, crypted) {
	let decipher = crypto.createDecipher(algorithm, secret);
	let dec = decipher.update(crypted,'hex','utf8');

	dec += decipher.final('utf8');

	return dec;

}

/*
	return : { token:String , refreshToken: String }
*/
function tokenGen(assets) {
	const buf = crypto.randomBytes(16);
	const refreshToken = buf.toString('hex');
	const payload = Object.assign({ refreshToken : refreshToken }, assets);
	const encrypted = { token: encrypt('aes-256-cbc', jwtSecret, JSON.stringify(payload)) };



	const token = jwt.sign(encrypted, jwtSecret, {
        expiresIn: (60*60*24)*EXPIRES_DAY, //expires In 7 Day
    });

    return { token, refreshToken };
}

/*
	return : { header:String , payload: String }
*/
function tokenDecrypt(token) {
	const decoded = jwt.decode(token, {complete: true});
	const header = decoded.header;
	const decryptToken = decrypt('aes-256-cbc', jwtSecret, decoded.payload.token);
	const payload = JSON.parse(decryptToken);

	return {
		header,
		payload
	};

}

// https://juejin.im/post/5dc379b5e51d456e35627383
// https://medium.com/karinsu/express-%E7%B0%A1%E6%98%93-passport-jwt-%E8%AA%8D%E8%AD%89-9472e35b5d43
// https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status
function tokenCheck(req, res, next) {
	const token = req.token || req.body.token || req.query.token || req.headers['x-access-token'];

	if (token) {
        jwt.verify(token, jwtSecret, function (err, decoded) {
        	if (err) {
            	return res.status(401).json({
            		"message": "Request error",
            		"error": "Token invaild"
            	});
            }else{
	        	const jwtData = tokenDecrypt(token);
	            req.decoded = decoded;
	            req.tkAsset = {
	            	user_id : jwtData.payload.user_id,
	            	username : jwtData.payload.username
	            };
	            next();
            }
        });
    }else{
    	return res.status(401).json({
    			"message": "Request error",
    			"error": "Token invaild"
            });
    }
}

/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
function toMysqlFormat(date) {
	console.log(date)
    return date.getUTCFullYear() + "-" + twoDigits(1 + date.getUTCMonth()) + "-" + twoDigits(date.getUTCDate()) + " " + twoDigits(date.getUTCHours()) + ":" + twoDigits(date.getUTCMinutes()) + ":" + twoDigits(date.getUTCSeconds());
};


function toTimestamp(datetime) {
	let currDate = new Date();
  	let n = currDate.getTimezoneOffset();
  	let offMillSec = n*60*1000;
  	let _datetime = datetime.getTime();
	return Math.round((_datetime - offMillSec)/1000);
}

module.exports = {
	tokenGen,
	tokenDecrypt,
	tokenCheck,
	toMysqlFormat,
	toTimestamp
};