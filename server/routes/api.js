var express = require('express');
var router = express.Router();
var { ObjectID } = require('mongodb'); // MongoDB _id
var config = require('../../common-config.json');
var srvConfig = require('../../server-config.json');

/*
 * GET /api/attendee (AUTH)
 * 
 * Get all unprocessed attendee
 * removed_at == 0 && recognized_at == 0
 * 
 */
router.get('/attendee', function(req, res, next) {

  //console.log('GET /api/attendee');

  var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

  // Connection URL
  var url = config.mongodb;

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {

    assert.equal(null, err);
    var collection = db.collection('attendee');

    collection.find({
      removed_at: 0,
      recognized_at: 0
    }).toArray(function(err, ret) {
      assert.equal(null, err);
      db.close();
      res.send(ret);
    });
  });
});

/*
 * PUT /api/attendee/{_id} (AUTH)
 * 
 * 1. Put attendee in/out queue
 *     - `recognized` = boolean
 * 2. Fake remove a attendee
 *     - `removed` = boolean
 * 3. Mark a attendee finished his speech (out queue)
 *     - `spoken` = boolean
 * 
 * Websocket Emit: recognized / removed / spoken
 */
router.put('/attendee/:id', function(req, res, next) {

  var moment = require('moment');
  //console.log('PUT /api/attendee/%s', req.params.id);

  var op = req.body,
    op_type = '',
    payload;

  if ('recognized' in op) {
    payload = { 'recognized_at': (op['recognized'] == 'true' ? moment().unix() : 0) };
    op_type = 'recognized';
  } else if ('removed' in op) {
    payload = { 'removed_at': (op['removed'] == 'true' ? moment().unix() : 0) };
    op_type = 'removed';
  } else if ('spoken' in op) {
    payload = { 'spoken_at': (op['spoken'] == 'true' ? moment().unix() : 0) };
    op_type = 'spoken';
  } else {
    console.log(req.body);
    //console.log('Bad Request');
    res.status(400).send('Bad Request');
  }

  var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

  // Connection URL
  var url = config.mongodb;

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {

    assert.equal(null, err);
    var collection = db.collection('attendee');

    collection.updateOne({
      _id: ObjectID(req.params.id)
    }, {
      $set: payload
    }, function(err, ret) {
      //console.log('update attendee success');
      assert.equal(null, err);
      assert.equal(1, ret.result.n);
      db.close();

      // Emit websocket
      res.io.to(srvConfig.websocket.secret).emit(op_type, op_type);

      res.send({
        status: ret.result.ok
      });
    });
  });
});

/*
 * POST /api/subject (AUTH)
 * 
 * Update subject
 * 
 * Websocket Emit: subjectChange(subject) 
 */
router.post('/subject', function(req, res, next) {

  var moment = require('moment');

  var subject = {
    subject: req.body.subject,
    created_at: moment().unix(),
  };

  var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

  var insertSubject = function(subject, db, callback) {
    // get collection
    var collection = db.collection('subject');
    // insert attendee
    collection.insertOne(subject, function(err, ret) {
      assert.equal(err, null);
      assert.equal(1, ret.result.n);
      assert.equal(1, ret.ops.length);
      callback(ret);
      db.close();
    });
  };

  // Connection URL
  var url = config.mongodb;

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {

    assert.equal(null, err);

    insertSubject(subject, db, function(ret) {

      //console.log('Subject changed');
      //console.log(ret.ops);

      // Emit Event
      res.io.to(srvConfig.websocket.secret).emit('subjectChange', req.body.subject);

      res.send({
        status: ret.result.ok
      });
    });
  });
});

/*
 * GET /api/auth (AUTH)
 * 
 * Get secret socket.io room key
 * 
 */
router.get('/auth', function(req, res, next) {
  return res.send({
    message: 'If you see this message without any auth, please protect route /api/* with HTTP basic authentication.',
    room: srvConfig.websocket.secret
  });
});

module.exports = router;
