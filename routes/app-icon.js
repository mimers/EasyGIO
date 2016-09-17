var express = require('express');
var router = express.Router();
var fs = require('fs');

var fetch = require('node-fetch');

var request = require('request');
var cheerio = require('cheerio');


/* GET users listing. */
router.get('/:spn', function(req, res, next) {
    console.log("fetch icon for " + req.params.spn);
    var spn = req.params.spn;
    if (!spn.match(/[\w+\.]+/)) {
        res.send(null);
        return;
    }
    request("http://www.wandoujia.com/apps/" + req.params.spn, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var src = $(".app-icon > img").attr('src');
            console.log(src);
            if (src) {
                res.redirect(src);
                return;
            }
        }
        res.redirect("/images/app-icons/android_default.png");
    });

});

module.exports = router;
