'use strict';

console.log("Starting");

// import dotenv from 'dotenv';
const dotenv = require('dotenv');
const lenders = require('./lenders');
const utf8 = require('utf8');

// export const index = (event, context, callback) => {
exports.index = (event, context, callback) => {
    
    console.log(JSON.stringify(JSON.parse(event.body), null, 4));

    let body = process.env.IS_LOCAL ? event.body : JSON.parse(event.body);

    processV2Request(body, callback);
};

/*
* Function to handle v2 webhook requests from Dialogflow
*/
function processV2Request(body, callback) {
    // An action is a string used to identify what needs to be done in fulfillment
    let action = (body.queryResult.action) ? body.queryResult.action : 'default';
    // Parameters are any entities that Dialogflow has extracted from the request.
    let parameters = body.queryResult.parameters || {}; // https://dialogflow.com/docs/actions-and-parameters
    let amount = (body.queryResult.parameters.Amount.number) ? body.queryResult.parameters.Amount.number :  0;
    // Contexts are objects used to track and store conversation state
    let inputContexts = body.queryResult.contexts; // https://dialogflow.com/docs/contexts
    // Get the request source (Google Assistant, Slack, API, etc)
    let requestSource = (body.originalDetectIntentRequest) ? body.originalDetectIntentRequest.source : undefined;
    // Get the session ID to differentiate calls from different users
    let session = (body.session) ? body.session : undefined;

    // Create handlers for Dialogflow actions as well as a 'default' handler
    const actionHandlers = {
        // The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent)
        'smalltalk.greetings.hello': (callback) => {
            sendResponse('Hello, Welcome to my Dialogflow agent!', callback); // Send simple response to user
        },
        // The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents)
        'input.unknown': (callback) => {
            // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
            sendResponse('I\'m having trouble, can you try that again?', callback); // Send simple response to user
        },
        'alda.loan.application': (callback) => {
            let responseToUser = {
                    fulfillmentMessages: richResponsesV2, // Optional, uncomment to enable
                    //outputContexts: [{ 'name': `${session}/contexts/weather`, 'lifespanCount': 2, 'parameters': {'city': 'Rome'} }], // Optional, uncomment to enable
                    fulfillmentText: 'This is from Dialogflow' // displayed response
            };
            sendResponse(responseToUser, callback);
        },
        // Default handler for unknown or undefined actions
        'default': (callback) => {
            sendResponse('I\'m having trouble, can you try that again?', callback); // Send simple response to user
        }
    };

    // If undefined or unknown action use the default handler
    if (!actionHandlers[action]) {
        action = 'default';
    }

    // Run the proper handler function to handle the request from Dialogflow
    actionHandlers[action](callback);

    // Function to send correctly formatted responses to Dialogflow which are then sent to the user
    function sendResponse (responseToUser, callback) {
        // if the response is a string send it as a response to the user
        if (typeof responseToUser === 'string') {
            let responseJson = {fulfillmentText: responseToUser}; // displayed response
            respondOK(callback, JSON.stringify(responseJson));
        } else {
            // If the response to the user includes rich responses or contexts send them to Dialogflow
            let responseJson = {};

            // Define the text response
            responseJson.fulfillmentText = responseToUser.fulfillmentText;
            // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
            if (responseToUser.fulfillmentMessages) {
                responseJson.fulfillmentMessages = responseToUser.fulfillmentMessages;
            }
            // Optional: add contexts (https://dialogflow.com/docs/contexts)
            if (responseToUser.outputContexts) {
                responseJson.outputContexts = responseToUser.outputContexts;
            }

            // Send the response to Dialogflow
            respondOK(callback, JSON.stringify(responseJson));
        }
    }
}

const richResponsesV2 = [
    {
        'platform': 'FACEBOOK',
        'card': lenders.WongaRichResponseV2Card
    },
    {
        'platform': 'FACEBOOK',
        'card': lenders.VivusRichResponseV2Card
    },
    {
        'platform': 'FACEBOOK',
        'card': lenders.QueBuenoRichResponseV2Card
    }
]; 

const respondOK = (callback, body) => {
    const response = { statusCode: 200, body };
    console.log(JSON.stringify(response));
    callback(null, response);
};

const respondError = (callback) => {
    const response = {
        statusCode: 500,
        body: JSON.stringify({
            message: 'Failure'
        })
    };

    callback(null, response);
};
