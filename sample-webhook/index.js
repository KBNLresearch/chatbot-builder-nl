

const
    bodyParser = require('body-parser'),
    express = require('express'),
    gvn = require('./gvn'),
    dailyDigest = require('./daily-digest');

const app = express();
app.set('port', process.env.PORT || 5002);
app.use(bodyParser.json());

const register = (recipientID, params, res) => {
    const [_a, _b, time] = params;
    dailyDigest.register(recipientID, time);
    res.end(JSON.stringify([{
        responseType: "text",
        responseDelay: 500,
        responseText: `Dank je wel. Vanaf nu stuur ik je elke dag om ${time} een afbeelding uit het Geheugen van Nederland.`
    }]));
};

const unregister = (recipientID, res) => {
    dailyDigest.unregister(recipientID);
    res.end(JSON.stringify([{
        responseType: "text",
        responseDelay: 500,
        responseText: `Dank je wel. Vanaf nu stuur ik je geen afbeeldingen meer.`
    }]));
};


const surprise = (payload, params, res) => {

    gvn.surpise({payload: payload, params: params, onSucces: (answers) => {
        res.end(JSON.stringify(answers));
    }});
};

const search = (payload, params, { query }, res) => {
    gvn.search({payload: payload, params: params, query: query, res: res, onSucces: (answers) => {
        res.end(JSON.stringify(answers));
    }})
};

app.post('/', (req, res) => {
    const { body: { payload, params, recipientID }, query: {operation}  } = req;

    console.log("webhook reached: ", operation, recipientID);
    switch (operation) {
        case "unregister":
            return unregister(recipientID, res);
        case "register":
            return register(recipientID, params, res);
        case "surprise":
            return surprise(payload, params, res);
        case "search":
            return search(payload, params, req.query, res);
    }

    res.end(JSON.stringify([]));
});

app.listen(app.get('port'), () => {
    console.log('Sample web hook is running on port', app.get('port'));
});