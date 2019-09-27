var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

import { getJSONfromRpository } from './cvmfs/cvmfs';
// import express from 'express';
require('dotenv').config();

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;

const bodyParser = require('body-parser');

// const app = express();
// for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Controle");
    next();
});

const port = process.env.OPENSHIFT_NODEJS_PORT
const server_ip_address = process.env.OPENSHIFT_NODEJS_IP
app.listen(port, () => `Server running on port ${port}`);

app.listen(port, server_ip_address, function() {
    console.log("Listening on " + server_ip_address + ", port " + port);
})

app.get(process.env.OPENSHIFT_NODEJS_API, async (req, res) => {
    let repositoryName = req.query.name;
    let repositoryWebsite = req.query.website

    try {
        console.log(`Fetching repository ${repositoryName} from ${repositoryWebsite}`);
        const reposonseJSON = await getJSONfromRpository(repositoryWebsite, repositoryName);
        // console.log("reposonseJSON",reposonseJSON)
        res.json(reposonseJSON);
    } catch (error) {
        console.log(error)
        res.status(404).send(error.message);
    }
});