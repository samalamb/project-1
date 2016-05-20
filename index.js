/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Goal requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the Goal
 */
var APP_ID = 'amzn1.echo-sdk-ams.app.8e1cf101-6851-41ca-baf2-a267513bd6f5'; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var storage = require('./storage');
var express = require('express');
var request = require('request');
/**
 * PayItForward is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var PayItForward = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
PayItForward.prototype = Object.create(AlexaSkill.prototype);
PayItForward.prototype.constructor = PayItForward;

var app = express();

var GA_TRACKING_ID = 'UA-76518247-2';

function trackEvent(category, action, label, value, cb) {
  var data = {
    v: '1', // API Version.
    tid: GA_TRACKING_ID, // Tracking ID / Property ID.
    // Anonymous Client Identifier. Ideally, this should be a UUID that
    // is associated with particular user, device, or browser instance.
    cid: '555',
    t: 'event', // Event hit type.
    ec: category, // Event category.
    ea: action, // Event action.
    el: label, // Event label.
    ev: value, // Event value.
  };

  request.post(
    'http://www.google-analytics.com/collect', {
      form: data
    },
    function(err, response) {
      if (err) { return cb(err); }
      if (response.statusCode !== 200) {
        return cb(new Error('Tracking failed'));
      }
      cb();
    }
  );
}


PayItForward.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
  getTodaysGoal(session, response);
};

var getTodaysGoal = function (session, response) {

  storage.loadGoal(session, function (currentGoal) {
      var speechText = '';
      var repromptText = 'Placeholder';
      if (currentGoal.data.Goal === "na") {
          response.tell('There is no Goal for today.');
          return;
      } else {
          speechText += "<speak>Todays Pay It Forward goal is<break time='.206s'/>" + currentGoal.data.Item.Goal.S;
          speechText += "</speak>"

          var speechOutput = {
              speech: speechText,
              type: AlexaSkill.speechOutputType.SSML
          };
          var repromptOutput = {
              speech: repromptText,
              type: AlexaSkill.speechOutputType.PLAIN_TEXT
          };
          session.attributes.help = 'NO';
          response.askWithCard(speechOutput, repromptOutput, "Here is your goal for today: ", currentGoal.data.Item.Card.S, currentGoal.data.Image.s);
      }
  });
};


PayItForward.prototype.intentHandlers = {
    // register custom intent handlers
    "PayItForward": function (intent, session, response) {
      trackEvent(
      'Intent',
      'PayItForward',
      'na',
      '100', // Event value must be numeric.
      function(err) {
        if (err) {
            return next(err);
        }
        getTodaysGoal(session, response);
      });
    },
    "AMAZON.YesIntent": function (intent, session, response) {
      trackEvent(
      'Intent',
      'AMAZON.YesIntent',
      'na',
      '100', // Event value must be numeric.
      function(err) {
        if (err) {
            return next(err);
        }
        if (session.attributes.help === 'YES') {
            getTodaysGoal(session, response);
          } else {
            storage.loadGoal(session, function (currentGoal) {
              var speechText = '';
              if (currentGoal.data.Goal === "na") {
                  response.tell('There is no goal for today.');
                  return;
              } else {
                speechText += currentGoal.data.Item.Speak.S;

                var speechOutput = {
                    speech: speechText,
                    type: AlexaSkill.speechOutputType.SSML
                };
                response.tell(speechOutput)
              }
            });
          }
      });
    },
    "AMAZON.NoIntent": function (intent, session, response) {
      trackEvent(
      'Intent',
      'AMAZON.NoIntent',
      'na',
      '100', // Event value must be numeric.
      function(err) {
        if (err) {
            return next(err);
        }
        var speechOutput = "Okay.";
        response.tell(speechOutput);
      });
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
      var speechOutput = "Pay it forward is a skill that will help make peoples days better one little goal at a time.";
      response.tell(speechOutput);
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
      trackEvent(
      'Intent',
      'AMAZON.CancelIntent',
      'na',
      '100', // Event value must be numeric.
      function(err) {
        if (err) {
            return next(err);
        }
        var speechOutput = "Okay.";
        response.tell(speechOutput);
      });
    },
    "AMAZON.RepeatIntent": function (intent, session, response) {
      trackEvent(
      'Intent',
      'AMAZON.RepeatIntent',
      'na',
      '100', // Event value must be numeric.
      function(err) {
        if (err) {
            return next(err);
        }
        getTodaysGoal(session, response);
      });
    },
    "AMAZON.StopIntent": function (intent, session, resposne) {
      trackEvent(
      'Intent',
      'AMAZON.StopIntent',
      'na',
      '100', // Event value must be numeric.
      function(err) {
        if (err) {
            return next(err);
        }
        var speechOutput = "Okay.";
        response.tell(speechOutput);
      });
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the PayItForward Goal.
    var payItForward = new PayItForward();
    payItForward.execute(event, context);
};
