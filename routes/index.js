var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("current global token ");
    console.log(global.token);
    res.render('index', { title: 'GrowingIO', host: req.host, loginToken: global.token ? global.token.loginToken : "" });
});

module.exports = router;
