var express = require('express');
var router = express.Router();
var fs = require('fs');

var fetch = require('node-fetch');

var request = require('request');
var cheerio = require('cheerio');


/* GET users listing. */
router.get('/:platform/:spn', function(req, res, next) {
    console.log("fetch icon for " + req.params.spn);
    var spn = req.params.spn;
    var android = req.params.platform == 'android';
    if (!android) {
        res.redirect("/images/app-icons/ios_default.png");
        return;
    }
    if (!spn.match(/[\w+\.]+/)) {
        res.redirect("/images/app-icons/android_default.png");
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
