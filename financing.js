export function getLenders() {
    return [
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
            url: `https://www.cetelem.es/`,
            imgUrl: 'https://s3.eu-west-1.amazonaws.com/alda-images/cetelem.png'
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
            url: 'https://www.cofidis.es/',
            imgUrl: 'https://s3.eu-west-1.amazonaws.com/alda-images/cofidis.png'
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
            url: 'https://creditea.com/',
            imgUrl: 'https://s3.eu-west-1.amazonaws.com/alda-images/creditea.png'
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
            url: 'https://www.evofinance.com/',
            imgUrl: 'https://s3.eu-west-1.amazonaws.com/alda-images/evofinance.png'
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
            url: 'https://www.ing.es/',
            imgUrl: 'https://s3.eu-west-1.amazonaws.com/alda-images/ing.png'
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
            url: 'https://www.quebueno.es/',
            imgUrl: 'https://s3.eu-west-1.amazonaws.com/alda-images/quebueno.png'
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
            url: 'https://www.solcredito.es/',
            imgUrl: 'https://s3.eu-west-1.amazonaws.com/alda-images/solcredito.png'
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
            url: 'https://www.vivus.es/',
            imgUrl: 'https://s3.eu-west-1.amazonaws.com/alda-images/vivus.png'
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
            url: 'https://www.wonga.es/',
            imgUrl: 'https://s3.eu-west-1.amazonaws.com/alda-images/wonga.png'
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
            url: 'https://es.younited-credit.com/',
            imgUrl: 'https://s3.eu-west-1.amazonaws.com/alda-images/younited.png'
        }
    ];
};

function translateTermUnit(term) {
    const dict = {
        day: 'dias',
        month: 'meses',
        year: 'años'
    };

    return dict[term];
}

export function aldaFinancingLoan(agent, lenders) {
    const amount = agent.parameters.amount;
    let foundLender = false;
    let totalMinAmount;
    let totalMaxAmount;
    agent.addTextMessage(`Perfecto, a continuación te muestro los mejores préstamos que ofrecen ${amount}€`);
    agent.addTextMessage('Además de las opciones que te ofrezco, es posible que tu banco te ofrezca un préstamo preconcedido: este tipo de préstamo es el más rápido pero también es el más caro!');

    function urlToMarkdown(url, displayText) {
        return `[${__(displayText)}](${url})`;
    }

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
                text: urlToMarkdown(url, 'See offer')
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
