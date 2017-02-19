var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.ws('/echo', function(ws, req) {
    ws.on('message', function(msg) {
        console.log(msg);
    });
});

module.exports = router;