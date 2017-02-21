var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('queue', { title: 'queue' });
});

module.exports = router;