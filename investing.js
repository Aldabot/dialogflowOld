const investDict = {
    A: [
        {
            assetClass: 'Acciones Globales',
            investment: 'Vanguard Global Stk Idx Eur -Ins',
            percentage: 61
        },
        {
            assetClass: 'Bonos Globales a Largo Plazo',
            investment: 'Vanguard Global Bnd Idx -Ins',
            percentage: 39
        }
    ],
    B: [
        {
            assetClass: 'Acciones Globales',
            investment: 'Vanguard Global Stk Idx Eur -Ins',
            percentage: 52
        },
        {
            assetClass: 'Bonos Globales a Largo Plazo',
            investment: 'Vanguard Global Bnd Idx -Ins',
            percentage: 48
        }
    ],
    E: [
        {
            assetClass: 'Bonos Globales a Largo Plazo',
            investment: 'Vanguard Global Bnd Idx -Ins',
            percentage: 71
        },
        {
            assetClass: 'Acciones Globales',
            investment: 'Vanguard Global Stk Idx Eur -Ins',
            percentage: 29
        }
    ],
    L: [
        {
            assetClass: 'Bonos Gobiernos Europeos',
            investment: 'Vanguard Eur Gv Bnd Idx -Ins',
            percentage: 28
        },
        {
            assetClass: 'Bonos Empresas Europeas',
            investment: 'Vanguard Euro Inv Gr Idx -Ins',
            percentage: 23
        },
        {
            assetClass: 'Bonos Europeos ligados a la Inflación',
            investment: 'Vanguard Euroz Inf Lk Idx -Ins',
            percentage: 20
        },
        {
            assetClass: 'Acciones Estados Unidos',
            investment: 'Vanguard US 500 Stk Idx -Ins',
            percentage: 17
        }, {
            assetClass: 'Acciones Europa',
            investment: 'Pictet Europe Idx -I',
            percentage: 8
        },
        {
            assetClass: 'Acciones Economías Emergentes',
            investment: 'Vanguard Emrg Mk Stk Idx -Ins',
            percentage: 4
        }
    ],
    S: [
        {
            assetClass: 'Bonos Gobiernos Europeos',
            investment: 'Vanguard Eur Gv Bnd Idx -Ins',
            percentage: 28
        },
        {
            assetClass: 'Bonos Empresas Europeas',
            investment: 'Vanguard Euro Inv Gr Idx -Ins',
            percentage: 22
        },
        {
            assetClass: 'Bonos Europeos ligados a la Inflación',
            investment: 'Vanguard Euroz Inf Lk Idx -Ins',
            percentage: 19
        },
        {
            assetClass: '',
            investment: '',
            percentage: 0
        },
        {
            assetClass: '',
            investment: '',
            percentage: 0
        },
        {
            assetClass: '',
            investment: '',
            percentage: 0
        },
    ]
};

function addInvestDictMesssages(agent, option) {
    for(const asset of investDict[option]) {
        const { assetClass, investment, percentage } = asset;
        agent.addTextMessage(`${assetClass}, ${investment}, ${percentage}%`);
    }
}

export function investingResult(agent) {
    let amount;
    let riskimeter;
    for (const context of agent.contexts) {
        if (context.name === 'investing-followup') {
            amount = context.parameters.amount;
            riskimeter = context.parameters.riskimeter;
        }
    }

    switch(riskimeter) {
    case 1:
        if(amount < 10000) {
            agent.addTextMessage('Bonos Globales a Largo Plazo,	Vanguard Global Bnd Idx -Ins,	86.0%');
            agent.addTextMessage('Acciones Globales	Vanguard Global Stk Idx Eur -Ins	14,0%');
        } else if( amount < 100000) {
            agent.addTextMessage('Bonos Gobiernos Europeos	Vanguard Eur Gv Bnd Idx -Ins	35,0%');
            agent.addTextMessage('Bonos Empresas Europeas	Vanguard Euro Inv Gr Idx -Ins	35,0%');
            agent.addTextMessage('Bonos Europeos ligados a la Inflación	Vanguard Euroz Inf Lk Idx -Ins	16,0%');
            agent.addTextMessage('Acciones Estados Unidos	Vanguard US 500 Stk Idx -Ins	10,0%');
            agent.addTextMessage('Acciones Europa	Pictet Europe Idx -I	4,0%');
        } else {
            agent.addTextMessage('Bonos Empresas Europeas	Vanguard Euro Inv Gr Idx -Ins	34,0%');
            agent.addTextMessage('Bonos Gobiernos Europeos	Vanguard Eur Gv Bnd Idx -Ins	34,0%');
            agent.addTextMessage('Bonos Europeos ligados a la Inflación	Vanguard Euroz Inf Lk Idx -Ins	16,0%');
            agent.addTextMessage('Acciones Estados Unidos	Vanguard US 500 Stk Idx -Ins	10,0%');
            agent.addTextMessage('Bonos Países Emergentes Cubiertos a Euro	iShares EM Gov Bnd Idx -I2 Eur Hdg	3,0%');
            agent.addTextMessage('Acciones Europa	Pictet Europe Idx -I	3,0%');
        }
        break;
    case 2:
        if(amount < 10000) {
            agent.addTextMessage('Bonos Globales a Largo Plazo	Vanguard Global Bnd Idx -Ins	81,0%');
            agent.addTextMessage('Acciones Globales	Vanguard Global Stk Idx Eur -Ins	19,0%');
        } else if ( amount < 100000) {
            agent.addTextMessage('Bonos Empresas Europeas	Vanguard Euro Inv Gr Idx -Ins	32,0%');
            agent.addTextMessage('Bonos Gobiernos Europeos	Vanguard Eur Gv Bnd Idx -Ins	31,0%');
            agent.addTextMessage('Bonos Europeos ligados a la Inflación	Vanguard Euroz Inf Lk Idx -Ins	18,0%');
            agent.addTextMessage('Acciones Estados Unidos	Vanguard US 500 Stk Idx -Ins	11,0%');
            agent.addTextMessage('Acciones Europa	Pictet Europe Idx -I	5,0%');
            agent.addTextMessage('Acciones Economías Emergentes	Vanguard Emrg Mk Stk Idx -Ins	3,0%');
        } else {
            agent.addTextMessage('Bonos Empresas Europeas	Vanguard Euro Inv Gr Idx -Ins	31,0%');
            agent.addTextMessage('Bonos Gobiernos Europeos	Vanguard Eur Gv Bnd Idx -Ins	30,0%');
            agent.addTextMessage('Bonos Europeos ligados a la Inflación	Vanguard Euroz Inf Lk Idx -Ins	18,0%');
            agent.addTextMessage('Acciones Estados Unidos	Vanguard US 500 Stk Idx -Ins	14,0%');
            agent.addTextMessage('Acciones Europa	Pictet Europe Idx -I	4,0%');
            agent.addTextMessage('Bonos Países Emergentes Cubiertos a Euro	iShares EM Gov Bnd Idx -I2 Eur Hdg	3,0%');
        }
        break;
    case 3:
        if(amount < 10000) {
            addInvestDictMesssages(agent, 'E');
        } else if ( amount < 100000) {
            addInvestDictMesssages(agent, 'L');
        } else {
            addInvestDictMesssages(agent, 'S');
        }
        break;
    default:
        switch(amount) {
        default:
            agent.addTextMessage('Bonos Globales a Largo Plazo, Vanguard Global Bnd Idx -Ins,	60,0%');
            agent.addTextMessage('Bonos Globales a Largo Plazo,	Vanguard Global Bnd Idx -Ins,	60,0%');
        }
    }
}
