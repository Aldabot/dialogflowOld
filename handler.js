'use strict';

import dotenv from 'dotenv';


class DialogflowV1 {
    constructor() {
        this.platform = 'facebook';
        this.response = {
            messages: [
            ]
        };

        this.addTextMessage = this.addTextMessage.bind(this);
        this.addQuickReplies = this.addQuickReplies.bind(this);
        this.getResponse = this.getResponse.bind(this);
    }

    // https://dialogflow.com/docs/reference/agent/message-objects
    addTextMessage(text) {
        this.response.messages.push({
            platform: this.platform,
            speech: text,
            type: 0
        });
    }

    addCard(title, subtitle, imageUrl, buttons) {
        this.response.messages.push({
            buttons,
            imageUrl,
            platform: this.platform,
            subtitle,
            title,
            type: 1
        });
    }

    // https://dialogflow.com/docs/reference/agent/message-objects
    addQuickReplies(title, quickReplies) {
        this.response.messages.push({
            platform: this.platform,
            replies: quickReplies,
            title,
            type: 2
        });
    }

    getResponse() {
        return this.response;
    }
}


export const index = (event, context, callback) => {
    // console.log(JSON.stringify(JSON.parse(event.body), null, 4));

    const body = process.env.IS_LOCAL ? event.body : JSON.parse(event.body);

    console.log(JSON.stringify(body, null, 4));

    const dialogflowV1Response = {
        speech: 'joojojo',
        displayText: 'joojojo'
    };

    const agent = new DialogflowV1();
    agent.addTextMessage('lol');
    agent.addTextMessage('non');
    agent.addQuickReplies('title', ['lol', 'ok', 'nice']);
    agent.addCard('title', 'subtitle', 'https://www.w3schools.com/howto/img_forest.jpg', [{
        postback: 'lol',
        text: 'ok'
    }]);

    const response = {
        statusCode: 200,
        body: JSON.stringify(agent.getResponse())
    };
    callback(null, response);
};
