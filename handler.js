'use strict';

class DialogflowV1 {
    constructor(req) {
        this.platform = 'facebook';

        console.log(req);
        this.contexts = req.result.contexts;

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

const lenders = [
    {
        name: 'Cetelem',
        minAmount: 3000,
        maxAmount: 50000
    }, {
        name: 'Cofidis',
        minAmount: 4000,
        maxAmount: 50000
    }, {
        name: 'Creditea',
        minAmount: 100,
        maxAmount: 3000
    }, {
        name: 'Quebueno',
        minAmount: 50,
        maxAmount: 300
    }, {
        name: 'Solcredito',
        minAmount: 100,
        maxAmount: 1000
    }, {
        name: 'Vivus',
        minAmount: 50,
        maxAmount: 300
    }, {
        name: 'Wonga',
        minAmount: 50,
        maxAmount: 300
    }, {
        name: 'Younited',
        minAmount: 1000,
        maxAmount: 40000
    },
]


function aldaFinancingPrestamo(agent) {
    const amount = agent.contexts[0].parameters.amount;
    for (const lender of lenders) {
        const { name, minAmount, maxAmount } = lender;
        if(minAmount <= amount && amount <= maxAmount) {
            agent.addTextMessage(name);
        }
    }
}


export const index = (event, context, callback) => {
    // console.log(JSON.stringify(JSON.parse(event.body), null, 4));

    const body = process.env.IS_LOCAL ? event.body : JSON.parse(event.body);

    console.log(body);
    console.log(JSON.stringify(body, null, 4));


    const agent = new DialogflowV1(body);
    // agent.addTextMessage('lol');
    // agent.addTextMessage('non');
    // agent.addQuickReplies('title', ['lol', 'ok', 'nice']);
    // agent.addCard('title', 'subtitle', 'https://www.w3schools.com/howto/img_forest.jpg', [{
    //     postback: 'lol',
    //     text: 'ok'
    // }]);

    aldaFinancingPrestamo(agent);

    const response = {
        statusCode: 200,
        body: JSON.stringify(agent.getResponse())
    };
    callback(null, response);
};
