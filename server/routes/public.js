var express = require('express');
var router = express.Router();
var { ObjectID } = require('mongodb'); // MongoDB _id
var wcwidth = require('wcwidth');
var config = require('../../common-config.json');
var srvConfig = require('../../server-config.json');

/*
 * POST /public/attendee
 *
 * Accpet application from attendee
 * 
 * Websocket Emit: newAttendee(attendee_obj)
 */
router.post('/attendee', function(req, res, next) {

  var moment = require('moment');
  const now = moment().unix();

  // Check post body data
  if (req.body.attendee_name === undefined ||
    req.body.summary === undefined ||
    req.body.email === undefined ||
    req.body.g_recaptcha_response === undefined ||
    req.body.attendee_name === '' ||
    req.body.summary === '' ||
    req.body.email === '' ||
    req.body.g_recaptcha_response === '') {

    //console.log(req.body);
    //console.log('Bad Request');
    res.status(400).send('Bad Request, lack of args');

  } else if ((now < config.allow_speaker_ts.start || now > config.allow_speaker_ts.end) && 
              !config.allow_speaker_ts.force_ignore) { 
    
    res.status(403).send('Forbidden, system not open');

  } else if (wcwidth(req.body.attendee_name) > 20 ||
    wcwidth(req.body.summary) > 200 ) {

    //console.log(req.body);
    //console.log('Bad Request, attendee_name > 20 || summary > 200');
    res.status(400).send('Bad Request, attendee_name > 20 || summary > 200');

  } else {

    //console.log('config.direct_to_queue: %s', config.direct_to_queue);
    //console.log('config.reCAPTCHA.enabled: %s', config.reCAPTCHA.enabled);

    var request = require('request');
    var md5 = require('md5');

    // Check recaptcha response
    request.post({
      url: 'https://www.google.com/recaptcha/api/siteverify',
      form: {
        secret: srvConfig.reCAPTCHA['secret'],
        response: req.body.g_recaptcha_response,
        remoteip: req.client.remoteAddress
      }
    }, function(err, post_res, post_body) {

      if ((post_res && post_res.statusCode == 200 &&
          JSON.parse(post_body).success == true) ||
        !(config.reCAPTCHA['enabled'])) {

        var timestamp = moment().unix();
        
        var hash = '';
        if (req.body.email !== null)
          hash = md5(req.body.email);

        var attendee = {
          attendee_name: req.body.attendee_name,
          summary: req.body.summary,
          email: req.body.email,
          gravatar: `https://www.gravatar.com/avatar/${hash}`,
          created_at: timestamp,
          recognized_at: config.direct_to_queue ? timestamp : 0, // To be toggled by moderators or direct
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

            //console.log('Insert attendee success');
            //console.log(ret.ops);

            // Emit Event to moderate
            // Only emit to secret room
            res.io.to(srvConfig.websocket.secret).emit('newAttendee', ret.ops);

            res.send({
              status: ret.result.ok
            });
          });
        });
      } else {
        //console.log('Bad reCAPTCHA');
        //console.log(post_body);
        res.status(418).send('Bad reCAPTCHA, I\'m a teapot!');
      }
    });
  }
});

/*
 * GET /public/queue
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
 * GET /public/subject
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
      if (ret.length === 0)
        res.send('(No Subject)');
      else
        res.send(ret[0].subject);
    });
  });
});

module.exports = router;