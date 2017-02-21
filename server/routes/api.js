var express = require('express');
var { ObjectID } = require('mongodb');
var router = express.Router();

/*
讓參加者申請上台
*/
router.post('/attendee', function(req, res, next) {

    console.log('GET /api/attendee');

    // Check post body data
    if (req.body.attendee_name === undefined ||
        req.body.summary === undefined) {
        console.log(req.body);
        console.log('Bad Request');
        res.status(400).send('Bad Request');
    }

    var moment = require('moment');

    var attendee = {
        attendee_name: req.body.attendee_name,
        summary: req.body.summary,
        created_at: moment().unix(),
        recognized: false, // To be toggled by moderators
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
        //console.log("Connected successfully to server");

        insertAttendee(attendee, db, function(ret) {

            console.log('Insert attendee success');
            console.log(ret.ops);

            // Emit Event to moderate
            res.io.emit('apply', ret.ops[0]);

            res.send({
                status: ret.result.ok
            });
        });
    });
});

/*
給 moderate 拿到所有 (removed = false && recognized = false) attendee
*/
router.get('/attendee', function(req, res, next) {

    console.log('GET /api/attendee');

    var MongoClient = require('mongodb').MongoClient,
        assert = require('assert');

    // Connection URL
    var url = 'mongodb://localhost:27017/pdmod';

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {

        assert.equal(null, err);
        var collection = db.collection('attendee');

        collection.find({
            removed: false,
            recognized: false
        }).toArray(function(err, ret) {
            console.log('get attendee list success');
            assert.equal(null, err);
            db.close();
            res.send(ret);
        });
    });
});

/*
1. 認可講者
    - `recognized` = true
    - `recognized_at` = timestamp
2. 刪除講者
    - `removed` = true
    - `removed_at` = timestamp
*/
router.put('/attendee', function(req, res, next) {

    console.log('PUT /api/attendee');

    var payload = JSON.parse(req.body.payload);

    var MongoClient = require('mongodb').MongoClient,
        assert = require('assert');

    // Connection URL
    var url = 'mongodb://localhost:27017/pdmod';

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {

        assert.equal(null, err);
        var collection = db.collection('attendee');

        collection.updateOne({
            _id: ObjectID(req.body._id)
        }, {
            $set: payload
        }, function(err, ret) {
            console.log('update attendee success');
            assert.equal(null, err);
            assert.equal(1, ret.result.n);
            db.close();
            res.send({
                status: ret.result.ok
            });
        });
    });
});

module.exports = router;