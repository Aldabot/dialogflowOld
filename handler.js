'use strict';
import financingLogic from './financing.js';
import investingLogic from './investing.js';
import i18n from 'i18n';
i18n.configure({
    directory: './locales',
    register: global
});

class DialogflowV1 {
    constructor(req) {
        this.platform = 'facebook';

        this.inputMessage = req.result.resolvedQuery;
        this.language = req.lang;
        this.parameters = req.result.parameters;
        this.intentName = req.result.metadata.intentName;
        this.contexts = (req.result.contexts.length > 0) ? req.result.contexts : [];

        this.response = {
            messages: [
            ],
            contextOut: this.contexts
        };

        this.addTextMessage = this.addTextMessage.bind(this);
        this.removeFirstTextMessage = this.removeFirstTextMessage.bind(this);
        this.addQuickReplies = this.addQuickReplies.bind(this);
        this.getResponse = this.getResponse.bind(this);
        this.addRiskimeter = this.addRiskimeter.bind(this);
    }

    // https://dialogflow.com/docs/reference/agent/message-objects
    addTextMessage(text) {
        this.response.messages.push({
            platform: this.platform,
            speech: text,
            type: 0
        });
    }
    removeFirstTextMessage() {
        this.response.messages.shift();
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
        // this.response.messages.push({
        //     type: 'custom_payload',
        //     platform: 'facebook',
        //     payload: {
        //         input: 'number'
        //     }
        // });
        console.log(JSON.stringify(this.response, null, 4));
        return this.response;
    }

    addRiskimeter(riskimeter) {
        for(const context of this.response.contextOut) {
            if(context.name === 'investment') {
                context.parameters.riskimeter = parseInt(context.parameters.riskimeter);
                context.parameters.riskimeter += riskimeter;
            }
        }
        // this.response.contextOut.push({ name: 'lol', lifespan: 2, parameters: { riskimeter: 2 } });
    }
}




export const index = (event, context, callback) => {
    // console.log(JSON.stringify(JSON.parse(event.body), null, 4));

    const body = process.env.IS_LOCAL ? event.body : JSON.parse(event.body);

    console.log(JSON.stringify(body, null, 4));

    const agent = new DialogflowV1(body);
    i18n.setLocale(agent.language);
    // agent.addTextMessage('lol');
    // agent.addTextMessage('non');
    // agent.addQuickReplies('title', ['lol', 'ok', 'nice']);
    // agent.addCard('title', 'subtitle', 'https://www.w3schools.com/howto/img_forest.jpg', [{
    //     postback: 'lol',
    //     text: 'ok'
    // }]);

    financingLogic(agent);
    investingLogic(agent);

    const response = {
        statusCode: 200,
        body: JSON.stringify(agent.getResponse())
    };
    callback(null, response);
};
