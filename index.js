/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

var GOALS = [
  "Ask someone how their day is going.",
  "Get to know something new about an old friend.",
  "Give your neighbor a small present.",
  "Call a relative that you haven't talked to in a while.",
  "Buy a small cup of coffee for someone you think needs it.",
  "Appreciate a coworker you know works very hard.",
  "Take the stress away from someone and offer to help with an errand.",
  "Make plans to meet with a friend later in the week.",
  "Invite someone special for dinner tonight.",
  "Give your barista a compliment today.",
  "Ask someone about a hobby that they're passionate about, and see what you can do to support them.",
  "Go the extra mile if someone asks you for help.",
  "Hold the door open for someone else; try not to make it an awkward distance away.",
  "Write someone a handwritten letter through the mail. It will make their day a little brighter.",
  "Bake pastries with a friend or family member.",
  "Ask someone if they want to hear a fun story. If they say yes tell them a fun tale!",
  "Make a playlist and share it with your friends.",
  "Bring little treats for your coworkers to enjoy.",
  "Offer to teach another person a skill that you're good at.",
  "Say hello to your neighbors with a smile.",
  "Start a book club with your close friends even if they're far away. It's a nice way to keep in touch.",
  "Put a smile on for anyone you meet today.",
  "Compliment someone's clothing. Make sure it doesn't sound condescending.",
  "Start a photo album for your family to show how they're special to you.",
  "Talk to an elderly person, it will brighten their day, and you might learn some life lessons.",
  "Thank someone in the military for their service for the country.",
  "Make it a goal to say please and thank you whenever applicable.",
  "Share a funny video with someone. Remember to keep it work safe if in the office.",
  "Pay for a friends lunch or coffe.",
  "Be kind to people on the road, let someone go in front of you.",
  "If you have above par service at an establishment make sure to let the manager know so that they can get recognized.",
  "Offer to return a cart for an elderly person in a parking lot.",
  "Give someone a hug that might need it.",
  "Wish someone a happy May the fourth be with you.",
  "Wish someone a Merry Christmas.",
  "Wish someone a Happy Hanukkah.",
  "Wish someone a Happy Kwanzaa.",
  "Start a project with a friend and see what you all can create.",
  "Take a funny picture and send it to your friends and family.",
  "Ask someone if they need some help around their house, or something with their personal life.",
  "Record a fun video to share with your friends.",
  "Take iniciative at work and do something without being asked.",
  "This is a choose your own adventure day. Pick a random act of kindness to do for another person.",
  "Let someone go in front of you in line today.",
  "Try watching a show that a friend has been telling you to watch.",
  "If someone you know if sick, put togehter a get well soon basket.",
  "Get to know that new coworker over food or coffee.",
  "Buy a bag of chocolates and pass them out to your friends and coworkers.",
  "Pick a random person in your phonebook and listen to anything they have to say.",
  "Try to make someone laugh today!",
  "Let someone take the credit for a small thing you did.",
  "Let another person pick what show to watch today.",
  "Give your server a nice tip, they'll appreciate it.",
  "Learn the name of your favorite server at a restaurant or coffee shop if you didn't already.",
  "Buy a small plant for your neighbor. It looks nice and livens any place up.",
  "Plan a boardgame night with friends and invite someone new along as well.",
  "Write little thank you cards for anyone you'd like.",
  "Comfort someone that might be going through rough times.",
  "Clean up a little litter around your area to keep things looking nice.",
  "Take some time out of your day to help a coworker who is under stress.",
  "Be spontaneous and do something you'd not often do for someone else."
]

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

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

PayItForward.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("PayItForward onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

PayItForward.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("PayItForward onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Better Day, you can recieve a goal to make someones day better today.";
    var repromptText = "You can recieve a goal to make someones day better.";
    response.ask(speechOutput, repromptText);
};

PayItForward.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("PayItForward onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

PayItForward.prototype.intentHandlers = {
    // register custom intent handlers
    "PayItForwardIntent": function (intent, session, response) {
        handleNew;
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask pay it forward to give you a goal to make someones day a little brighter.", "You can ask pay it forward to give you a goal for the day.");
    }
};

function handleNewPayItForwardRequest(response) {
	// Get a random affirmation from the affirmations list
	var payItForwardIndex = Math.floor(Math.random() * GOALS.length);
	var payItForward = GOALS[payItForwardIndex];

	// Create speech output
	var speechOutput = "Here is Your Pay it Forward goal for today: " + payItForward;

	response.tellWithCard(speechOutput, "Here's Your Pay it Forward goal: ", speechOutput);
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the PayItForward skill.
    var PayItForward = new PayItForward();
    PayItForward.execute(event, context);
};
