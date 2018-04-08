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
        this.removeFirstTextMessage = this.removeFirstTextMessage.bind(this);
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
        return this.response;
    }
}

const lenders = [
    {
        name: 'Cetelem',
        minAmount: 3000,
        maxAmount: 50000,
        url: '[Cetelem](https://www.cetelem.es/)',
        imgUrl: 'https://www.cetelem.es/documents/34437/103701/mr_credito.png/f85e937c-c1e1-24f5-498c-d54b0741a33a?t=1493977286630'
    }, {
        name: 'Cofidis',
        minAmount: 4000,
        maxAmount: 50000,
        url: '[Confidis](https://www.cofidis.es/)',
        imgUrl: 'https://logos-download.com/wp-content/uploads/2016/08/Cofidis_logo.png'
    }, {
        name: 'Creditea',
        minAmount: 100,
        maxAmount: 3000,
        url: '[Creditea](https://creditea.com/)',
        imgUrl: 'https://www.portalprestamos.es/wp-content/uploads/2016/09/creditea5.png'
    }, {
        name: 'Quebueno',
        minAmount: 50,
        maxAmount: 300,
        url: '[Quebueno](https://www.quebueno.es/)',
        imgUrl: 'http://www.agenciasdecomunicacion.org/wp-content/uploads/quebueno-hr-shadow.png'
    }, {
        name: 'Solcredito',
        minAmount: 100,
        maxAmount: 1000,
        url: '[Solcredito](https://www.solcredito.es/)',
        imgUrl: 'https://www.busconomico.com/images/logo/logo-solcredito.png'
    }, {
        name: 'Vivus',
        minAmount: 50,
        maxAmount: 300,
        url: '[Vivus](https://www.vivus.es/)',
        imgUrl: 'http://prestamondo.es/wp-content/uploads/thumbs_dir/vivus300-n9g0fqo4l4ve2if7ga5lx3t69urs2e76iyiiz33ekm.png'
    }, {
        name: 'Wonga',
        minAmount: 50,
        maxAmount: 300,
        url: '[Wonga](https://www.wonga.es/)',
        imgUrl: 'https://www.underconsideration.com/brandnew/archives/wonga_logo_detail.png'
    }, {
        name: 'Younited',
        minAmount: 1000,
        maxAmount: 40000,
        url: '[Younited](https://es.younited-credit.com/)',
        imgUrl: 'https://www.investitin.com/wp-content/uploads/2017/04/logo_younited-1.png'
    },
];


function aldaFinancingPrestamo(agent) {
    const amount = agent.contexts[0].parameters.amount;
    let foundLender = false;
    let totalMinAmount;
    let totalMaxAmount;
    agent.addTextMessage(`Perfecto, a continuación te muestro los mejores préstamos que ofrecen ${amount}€`);

    for (const lender of lenders) {
        const { name, minAmount, maxAmount, url, imgUrl } = lender;
        if (minAmount <= amount && amount <= maxAmount) {
            foundLender = true;
            agent.addCard(name, 'subtitle', imgUrl, [{
                postback: 'url',
                text: url
            }]);
        }
        if (typeof totalMinAmount === 'undefined' || totalMinAmount > minAmount) {
            totalMinAmount = minAmount;
        }
        if (typeof totalMaxAmount === 'undefined' || totalMaxAmount < maxAmount) {
            totalMaxAmount = maxAmount;
        }
    }

    if (!foundLender) {
        agent.removeFirstTextMessage();
        agent.addTextMessage(`Por ${amount} € no he encontrado un prestamista 😔`);
        if (amount < totalMinAmount) {
            agent.addQuickReplies(`Tendrias que pedir por lo minimum:`, [`${totalMinAmount}€`]);
        }
        if (amount > totalMaxAmount) {
            agent.addQuickReplies(`Tendrias que pedir menos que:`, [`${totalMaxAmount}€`]);
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
