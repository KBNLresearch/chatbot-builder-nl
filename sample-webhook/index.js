const
    bodyParser = require('body-parser'),
    express = require('express');

const app = express();
app.set('port', process.env.PORT || 5002);
app.use(bodyParser.json());

app.post('/', (req, res) => {
    const { body: { payload, params } } = req;

    console.log(payload, params);

    if (params.indexOf('I understand') > -1) {
        res.end(JSON.stringify([{
            responseType: "url",
            responseDelay: 0,
            responseText: "Meer informatie: ",
            url: "https://github.com/KBNLresearch/chatbot-builder-nl"
    }]));
    } else if (params.indexOf('I do not understand') > -1) {
        res.end(JSON.stringify([{
            responseType: "buttons",
            responseDelay: 50,
            responseText: `Probeer het nog eens`,
            buttons: [{
                text: "Ok",
                payload: `${payload}|I understand`
            }]
        }]));
    } else {
        res.end(JSON.stringify([{
            responseType: "text",
            responseDelay: 0,
            responseText: `Webhook heeft deze parameters ontvangen: ${JSON.stringify(params)}`
        }, {
            responseType: "buttons",
            responseDelay: 50,
            responseText: `Webhook kan knoppen genereren met de payload parameter`,
            buttons: [{
                text: "Ok",
                payload: `${payload}|I understand`
            }, {
                text: "Niet Ok",
                payload: `${payload}|I do not understand`
            }]
        }]));
    }
});

app.listen(app.get('port'), () => {
    console.log('Sample web hook is running on port', app.get('port'));
});