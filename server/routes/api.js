var express = require('express');
var router = express.Router();
var { ObjectID } = require('mongodb'); // MongoDB _id
var config = require('../../common-config.json');

/*
 * POST /api/attendee
 *
 * Accpet application from attendee
 * 
 * Websocket Emit: newAttendee(attendee_obj)
 */
router.post('/attendee', function(req, res, next) {

  // Check post body data
  if (req.body.attendee_name === undefined ||
    req.body.summary === undefined ||
    req.body.email === undefined ||
    req.body.g_recaptcha_response === undefined) {

    console.log(req.body);
    console.log('Bad Request');
    res.status(400).send('Bad Request');
  }

  var request = require('request');
  var moment = require('moment');
  var md5 = require('md5');

  // Check recaptcha response
  request.post({
    url: 'https://www.google.com/recaptcha/api/siteverify',
    form: {
      secret: config.reCAPTCHA['secret'],
      response: req.body.g_recaptcha_response,
      remoteip: req.client.remoteAddress
    }
  }, function(err, post_res, post_body) {

    if ((post_res && post_res.statusCode == 200 &&
        JSON.parse(post_body).success == true) ||
      !(config.reCAPTCHA['enabled'])) {

      var attendee = {
        attendee_name: req.body.attendee_name,
        summary: req.body.summary,
        email: req.body.email,
        gravatar: `https://www.gravatar.com/avatar/${md5(req.body.email)}`,
        created_at: moment().unix(),
        recognized_at: 0, // To be toggled by moderators
        spoken_at: 0,
        removed_at: 0
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
      var url = config.mongodb;

      // Use connect method to connect to the server
      MongoClient.connect(url, function(err, db) {

        assert.equal(null, err);

        insertAttendee(attendee, db, function(ret) {

          console.log('Insert attendee success');
          console.log(ret.ops);

          // Emit Event to moderate
          res.io.emit('newAttendee', ret.ops[0]);

          res.send({
            status: ret.result.ok
          });
        });
      });
    } else {
      console.log('Bad reCAPTCHA');
      console.log(post_body);
      res.status(418).send('Bad reCAPTCHA, I\'m a teapot!');
    }
  });
});

/*
 * GET /api/attendee (AUTH)
 * 
 * Get all unprocessed attendee
 * removed_at == 0 && recognized_at == 0
 * 
 * Websocket Emit: null
 */
router.get('/attendee', function(req, res, next) {

  console.log('GET /api/attendee');

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
  console.log('PUT /api/attendee/%s', req.params.id);

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
    console.log('Bad Request');
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
      console.log('update attendee success');
      assert.equal(null, err);
      assert.equal(1, ret.result.n);
      db.close();

      // Emit websocket
      res.io.emit(op_type, op_type);

      res.send({
        status: ret.result.ok
      });
    });
  });
});

/*
 * GET /api/queue
 * 
 * Get all attendee in the queue
 * 
 * Websocket Emit: null
 */
router.get('/queue', function(req, res, next) {

  var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

  // Connection URL
  var url = config.mongodb;

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {

    assert.equal(null, err);
    var collection = db.collection('attendee');

    collection.find({
      recognized_at: { $gt: 0 }, // > 0
      removed_at: 0,
      spoken_at: 0
    }).sort({
      recognized_at: 1,
      created_at: 1
    }).toArray(function(err, ret) {
      assert.equal(null, err);
      db.close();
      res.send(ret);
    });
  });
});

/*
 * GET /api/subject
 * 
 * Get latest subject
 * 
 * Websocket Emit: null
 */
router.get('/subject', function(req, res, next) {

  var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

  // Connection URL
  var url = config.mongodb;

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {

    assert.equal(null, err);
    var collection = db.collection('subject');

    collection.find({}).sort({
      'created_at': -1
    }).limit(1).toArray(function(err, ret) {
      assert.equal(null, err);
      db.close();
      res.send(ret[0].subject);
    });
  });
});

/*
 * POST /api/subject
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

      console.log('Subject changed');
      console.log(ret.ops);

      // Emit Event
      res.io.emit('subjectChange', req.body.subject);

      res.send({
        status: ret.result.ok
      });
    });
  });
});

module.exports = router;
