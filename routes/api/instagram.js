/**
 * Created by HP on 18/10/2017.
 */
var express = require('express');
var router = express.Router();
var request = require("request");
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'hello', nameuser: 'Intasgram' ,place: place});
});
router.get('/locations', function(req, res, next) {
    var lat = req.query.lat;
    var lng = req.query.lng;
    var option = {
        url : 'https://api.instagram.com/v1/locations/search?lat=' + lat + '&lng=' + lng +
        '&access_token=6079293844.e029fea.3d779429f5ad4b0fba9d206abacc3e1c',
        method: 'GET'
    };
    //start request
    request(option,function (error, resp, body) {
        if(!error && resp.statusCode ===200){
            //console.log(body);
            res.send(JSON.parse(body));
        }else{
            res.sendStatus(404);
        }
    })
});
router.get('/media', function(req, res, next) {
    var lat = req.query.lat;
    var lng = req.query.lng;
    // console.log(lat + '   ' + lng);
    var option = {
        url : 'https://api.instagram.com/v1/media/search?lat=' + lat + '&lng=' + lng +
        '&access_token=6079293844.e029fea.3d779429f5ad4b0fba9d206abacc3e1c',
        method: 'GET'
    };
    //start request
    request(option,function (error, resp, body) {
        if(!error && resp.statusCode === 200){
            //console.log(body);
            res.send(JSON.parse(body));
        }else{
            res.sendStatus(404);
        }
    })
});
router.get('/id', function(req, res, next) {
    var id = req.query.id;
    var option = {
        url : 'https://api.instagram.com/v1/media/' + id +
        '?access_token=6079293844.e029fea.3d779429f5ad4b0fba9d206abacc3e1c',
        method: 'GET'
    };
    //start request
    request(option,function (error, resp, body) {
        if(!error && resp.statusCode ===200){
            //console.log(body);
            res.send(JSON.parse(body));
        }else{
            res.sendStatus(404);
        }
    })
});
module.exports = router;
