const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require("mysql");

const bearerToken = require('express-bearer-token');
const helper = require('./helper.js');
// const indexRouter = require('./routes/index');
const mainRouter = require('./routes/main');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ayumi123",
    database: "easypark",
    multipleStatements: true
});
con.connect(function(err) {
    if (err) {
    	// https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
        console.log('connecting error');
        return;
    }
    console.log('connecting success');
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bearerToken());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// db state
app.use(function(req, res, next) {
    req.con = con;
    next();
});

app.use('/', mainRouter);
// app.use('/user', helper.tokenCheck, usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

  	// render the error page
  	res.status(err.status || 500);
  	// res.render('error');
  	res.render('error', {
  		message: err.message,
  		error: err
    });
});

module.exports = app;
