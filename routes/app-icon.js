var express = require('express');
var router = express.Router();
var fs = require('fs');
var storage = require('node-persist');

var fetch = require('node-fetch');

var request = require('request');
var cheerio = require('cheerio');
var wandoujiaUrl = "http://www.wandoujia.com/apps/";
var yybUrl = "http://sj.qq.com/myapp/detail.htm?apkName=";
var androidDefaultImage = "/images/app-icons/android_default.png";
var iosDefaultImage = "/images/app-icons/ios_default.png";
storage.init();


/* GET users listing. */
router.get('/:platform/:spn', function(req, res, next) {
    console.log("fetch icon for " + req.params.spn);
    var spn = req.params.spn;
    var platform = req.params.platform;
    var android = req.params.platform == 'android';
    if (!android) {
        res.redirect(iosDefaultImage);
        return;
    }
    if (!spn.match(/[\w+\.]+/)) {
        res.redirect(androidDefaultImage);
        return;
    }
    var storaygeKey = spn + "@" + platform;
    var localSrc = storage.getItemSync(storaygeKey);
    if (localSrc) {
        res.redirect(localSrc);
        return;
    }
    request(wandoujiaUrl + spn, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var src = $(".app-icon > img").attr('src');
            console.log(src);
            if (src) {
                storage.setItem(storaygeKey, src);
                res.redirect(src);
                return;
            }
        }
        request(yybUrl + spn, function(error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);
                var src = $(".det-icon > img").attr('src');
                console.log(src);
                if (src) {
                    storage.setItem(storaygeKey, src);
                    res.redirect(src);
                    return;
                }
            }
            res.redirect(androidDefaultImage);
        });
    });

});

module.exports = router;
