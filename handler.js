'use strict';

class DialogflowV1 {
    constructor(req) {
        this.platform = 'facebook';

        this.parameters = req.result.parameters;

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
        // this.response.messages.push({
        //     type: 'custom_payload',
        //     platform: 'facebook',
        //     payload: {
        //         input: 'number'
        //     }
        // });
        return this.response;
    }
}

const lenders = [
    {
        name: 'Cetelem',
        type: 'Lending company',
        minAmount: 3000,
        maxAmount: 50000,
        minTAE: 6.12,
        maxTAE: 17.11,
        minTerm: 3,
        maxTerm: 96,
        termUnit: 'month',
        url: '[Ver oferta](https://www.cetelem.es/)',
        imgUrl: 'https://www.cetelem.es/documents/34437/103701/mr_credito.png/f85e937c-c1e1-24f5-498c-d54b0741a33a?t=1493977286630'
    }, {
        name: 'Cofidis',
        type: 'Lending company',
        minAmount: 4000,
        maxAmount: 50000,
        minTAE: 6.12,
        maxTAE: 10.41,
        minTerm: 12,
        maxTerm: 96,
        termUnit: 'year',
        url: '[Ver oferta](https://www.cofidis.es/)',
        imgUrl: 'https://logos-download.com/wp-content/uploads/2016/08/Cofidis_logo.png'
    }, {
        name: 'Creditea',
        type: 'Lending company',
        minAmount: 100,
        maxAmount: 3000,
        minTAE: 42.41,
        maxTAE: null,
        minTerm: 6,
        maxTerm: 36,
        termUnit: 'month',
        url: '[Ver oferta](https://creditea.com/)',
        imgUrl: 'https://www.portalprestamos.es/wp-content/uploads/2016/09/creditea5.png'
    }, {
        name: 'EVO Finance',
        type: 'Bank',
        minAmount: 6000,
        maxAmount: 30000,
        minTAE: 7.23,
        maxTAE: null,
        minTerm: 12,
        maxTerm: 96,
        termUnit: 'month',
        url: '[Ver oferta](https://www.evofinance.com/)',
        imgUrl: 'https://cdn.tradetracker.net/es/campaign_image_square/17655.png'
    }, {
        name: 'ING Direct',
        type: 'Bank',
        minAmount: 6000,
        maxAmount: 60000,
        minTAE: 6.11,
        maxTAE: 11.52,
        minTerm: 12,
        maxTerm: 72,
        termUnit: 'month',
        url: '[Ver oferta](https://www.ing.es/)',
        imgUrl: 'https://www.betterbanking.net.au/wp-content/uploads/2017/01/ing-direct.png'
    }, {
        name: 'Quebueno',
        type: 'Lending company',
        minAmount: 50,
        maxAmount: 300,
        minTAE: 0,
        maxTAE: null,
        minTerm: 1,
        maxTerm: 46,
        termUnit: 'day',
        url: '[Ver oferta](https://www.quebueno.es/)',
        imgUrl: 'http://www.agenciasdecomunicacion.org/wp-content/uploads/quebueno-hr-shadow.png'
    }, {
        name: 'Solcredito',
        type: 'Lending company',
        minAmount: 100,
        maxAmount: 1000,
        minTAE: 0,
        maxTAE: null,
        minTerm: 60,
        maxTerm: 90,
        termUnit: 'day',
        url: '[Ver oferta](https://www.solcredito.es/)',
        imgUrl: 'https://www.busconomico.com/images/logo/logo-solcredito.png'
    }, {
        name: 'Vivus',
        type: 'Lending company',
        minAmount: 50,
        maxAmount: 300,
        minTAE: 0,
        maxTAE: 0,
        minTerm: 7,
        maxTerm: 30,
        termUnit: 'day',
        url: '[Ver oferta](https://www.vivus.es/)',
        imgUrl: 'http://prestamondo.es/wp-content/uploads/thumbs_dir/vivus300-n9g0fqo4l4ve2if7ga5lx3t69urs2e76iyiiz33ekm.png'
    }, {
        name: 'Wonga',
        type: 'Lending company',
        minAmount: 50,
        maxAmount: 300,
        minTAE: 0,
        maxTAE: null,
        minTerm: 1,
        maxTerm: 60,
        termUnit: 'day',
        url: '[Ver oferta](https://www.wonga.es/)',
        imgUrl: 'https://www.underconsideration.com/brandnew/archives/wonga_logo_detail.png'
    }, {
        name: 'Younited',
        type: 'Lending company',
        minAmount: 1000,
        maxAmount: 40000,
        minTAE: 5.18,
        maxTAE: 7.07,
        minTerm: 2,
        maxTerm: 6,
        termUnit: 'year',
        url: '[Ver oferta](https://es.younited-credit.com/)',
        imgUrl: 'https://www.investitin.com/wp-content/uploads/2017/04/logo_younited-1.png'
    }
];

function translateTermUnit(term) {
    const dict = {
        day: 'dias',
        month: 'meses',
        year: 'años'
    };

    return dict[term];
}

function aldaFinancingPrestamo(agent) {
    const amount = agent.parameters.amount;
    let foundLender = false;
    let totalMinAmount;
    let totalMaxAmount;
    agent.addTextMessage(`Perfecto, a continuación te muestro los mejores préstamos que ofrecen ${amount}€`);

    for (const lender of lenders) {
        const { name, type, minAmount, maxAmount, minTAE, maxTAE, minTerm, maxTerm, termUnit, url, imgUrl } = lender;
        const title = `${name}`;
        const maxTAEField = (maxTAE) ? `${maxTAE}%` : `---`;
        const termUnitField = translateTermUnit(termUnit);

        const description = `|  | Min | Max
| ------ | ----------- |
| Cuota: | ${minAmount}€ | ${maxAmount}€ |
| TAE: | ${minTAE}% | ${maxTAEField} |
| Duracion: | ${minTerm} ${termUnitField} | ${maxTerm} ${termUnitField} |`;

        if (minAmount <= amount && amount <= maxAmount) {
            foundLender = true;
            agent.addCard(title, description, imgUrl, [{
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
