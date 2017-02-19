var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('moderate', { title: 'moderate' });
});

module.exports = router;