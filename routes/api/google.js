/**
 * Created by HP on 18/10/2017.
 */
var express = require('express');
var router = express.Router();
const https = require("https");
/* GET home page. */
router.get('/', function(req, res, next) {
    // var data = '';
    // https.get('https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJ3eH0BhwvdTERPZpT1PEAOQQ&' +
    //     'key=AIzaSyCqG55x6-7BVevi2doMzzPFqmmATL55iPU',function (res) {
    //
    //     res.on('data',function (chunk) {
    //         data += chunk;
    //     });
    //     res.on('end',function () {
    //         console.log(data);
    //     });
    // }).on('error',function (err) {
    //     console.log("Error: " + err.message);
    // });
    var place = ["aaaaa","vvvvvv","aaaaa"];
    res.render('index', { title: 'hello', nameuser: 'Intasgram' ,place: place});
});

module.exports = router;
