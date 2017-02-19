var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {

    // Check post body data
    if (req.body.attendee_name === undefined ||
        req.body.summary === undefined) {
        res.status(400).send('Bad Request');
    }

    var moment = require('moment');

    var attendee = {
        attendee_name: req.body.attendee_name,
        summary: req.body.summary,
        created_at: moment().unix(),
        state: false, // To be toggled by moderators
        removed: false
    };

    var MongoClient = require('mongodb').MongoClient,
        assert = require('assert');

    var insertAttendee = function(attendeeObj, db, callback) {
        // get collection
        var collection = db.collection('attendee');
        // insert attendee
        collection.insertOne(attendeeObj, function(err, ret) {
            assert.equal(err, null);
            assert.equal(1, ret.result.n);
            assert.equal(1, ret.ops.length);
            callback(ret);
            db.close();
        });
    };

    // Connection URL
    var url = 'mongodb://localhost:27017/pdmod';

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {

        assert.equal(null, err);
        console.log("Connected successfully to server");

        insertAttendee(attendee, db, function(ret) {
            console.log(ret);
            res.send({
                status: true
            });
        });
    });

});

module.exports = router;