'use strict';

var AWS = require("aws-sdk");
var moment = require('moment');

var storage = (function () {
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    // GMT -5:00 or 5 hours
    var today = moment().subtract(8, 'hours').format('l');

    function Goal(session, data) {
        if (data) {
            this.data = data;
        } else {
            this.data = {
              Description: {
                SSML: "<speak>Something went wrong. Please try again soon.</speak>",
                Text: "Something went wrong. Please try again soon."
              },
              Image: {
                largeURL: "na",
                smallURL: "na"
              },
              InvocationName: "na",
              goalForToday: today,
              Goal: "na"
            };
        }
        this._session = session;
    }

    return {
        loadGoal: function (session, callback) {
            if (session.attributes.currentGoal) {
                console.log('get goal from session=' + session.attributes.currentGoal);
                callback(new Goal(session, session.attributes.currentGoal));
                return;
            }

            dynamodb.getItem({
                TableName: 'payItForward',
                Key: {
                    'goalForTheDay' : {
                        S: today
                    }
               }
            }, function (err, data) {
                var currentGoal;
                if (err) {
                    console.log(err, err.stack);
                    //WTF!
                    currentGoal = new Goal(session);
                    session.attributes.currentGoal = currentGoal.data;
                    callback(currentGoal);
                } else if (data) {
                    //console.log(data);
                    //onsole.log(moment());
                    currentGoal = new Goal(session, data);
                    callback(currentGoal);
                } else {
                    // This should nevere ever happen!!!
                    console.log(data);
                    currentGoal = new Goal(session);
                    session.attributes.currentGoal = currentGoal.data;
                    callback(currentGoal);
                }
            });
        },
    };
})();
module.exports = storage;
