var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var fetch = require('node-fetch');
// var Grant = require('grant-express'),
//     grant = new Grant({
//         "server": {
//             "protocol": "http",
//             "host": "localhost:3000",
//             "transport": "session",
//             "state": true
//         },
//         "gio": {
//             "authorize_url": "https://accounts.growingio.com/oauth/authorize",
//             "access_url": "https://accounts.growingio.com/oauth/access_token",
//             "oauth": 2,
//             "key": "MU6U1pi9U1FQPbNbaZZSZzG8WgErKxuB",
//             "secret": "17a00fbe97061ced8966ec24c21c3f1c2dea384a346d5b96d031c0d353bae7b9",
//             "callback": "/growingio/callback"
//         },
//     });

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(session({
//     secret: 'grant'
// }))
// app.use(grant)
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.get('/growingio/code_callback', function(req, res, next) {
    console.log(req.query);
    fetch('https://accounts.growingio.com/oauth/access_token', {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Accept-Type': 'application/json'
        // },
        body: JSON.stringify({
            grantType: "authorization_code",
            code: req.query.code,
            clientId: 'MU6U1pi9U1FQPbNbaZZSZzG8WgErKxuB',
            clientSecret: '17a00fbe97061ced8966ec24c21c3f1c2dea384a346d5b96d031c0d353bae7b9'
        })
    }).then((result) => {
        console.log("got result " + result.body);
        if (result.ok) {
            return result.json().then((json) => {
                console.log(json);
                // res.end(JSON.stringify(json));
                res.redirect("/?token=" + json.accessToken);
            });
        }
    });
});
// res.end(req.query.code);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
