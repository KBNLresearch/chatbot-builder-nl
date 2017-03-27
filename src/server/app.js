const config = {
        "appId": process.env.FB_APP_ID,
        "appSecret": process.env.MESSENGER_APP_SECRET,
        "pageId": process.env.FB_PAGE_ID,
        "pageAccessToken": process.env.MESSENGER_PAGE_ACCESS_TOKEN,
        "validationToken": process.env.MESSENGER_VALIDATION_TOKEN,
        "serverURL": process.env.SERVER_URL,
        "pathPrefix": "",
        "port": process.env.PORT
    };

const
    bodyParser = require('body-parser'),
    express = require('express'),
    dialogs = require('./dialogs'),
    fb = require("./fb/fb-lib")(config),
    botHandlers = require("./bot/handlers")(fb),
    webHook = require("./bot/webhook")(fb, botHandlers),
    rp = require('request-promise');

const app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json({verify: fb.verifyRequestSignature}));

app.get(`/webhook`, fb.validateWebhook);
app.post(`/webhook`, webHook);

const endResponse = (res) => {
    res.status(200);
    res.set("Content-type", "application/json");
    res.end(JSON.stringify(dialogs.listDialogs()));
};

app.post('/add-dialog', (req, res) => {
    const { body: { userText } } = req;

    dialogs.addDialog(userText, (id) => {

        res.set("x-uuid", id);
        endResponse(res);
    });
});

app.put('/dialogs/set-greeting', (req, res) => {
    const { body: { greeting } } = req;

    rp.post({
        uri: `https://graph.facebook.com/v2.6/me/thread_settings?access_token=${config.pageAccessToken}`,
        json: true,
        body: {
            setting_type: "greeting",
            greeting: {
                text: greeting
            }
        }
    }).then(data => {
        endResponse(res);
    }).catch(err => {
        console.error("Failed to change greeting!", err);
        endResponse(res);
    })

});



app.put('/dialogs/:id/update', (req, res) => {
    const { body: { userText } } = req;

    dialogs.updateDialog(userText, req.params.id, () => endResponse(res));

});


app.post('/add-start-dialog', (req, res) => {

    dialogs.addStartDialog();

    endResponse(res);

});

app.get('/dialogs', (req, res) => {
    endResponse(res);
});

app.get('/dialogs/download', (req, res) => {
    res.set('Content-Disposition', 'attachment; filename="dialog-export.txt"')
    endResponse(res);
});

app.post('/dialogs/import', (req, res) => {

    dialogs.importFile(req.body);

    endResponse(res);
});

app.delete('/dialogs/:id', (req, res) => {

    dialogs.removeDialog(req.params.id);

    endResponse(res)
});

app.put('/dialogs/:id/toggle-phrase-part', (req, res) => {
    const { body: { word } } = req;

    dialogs.togglePhrasePart(req.params.id, word);

    endResponse(res);
});

app.put('/dialogs/:id/add-answer', (req, res) => {
    const { body: { data, parentId } } = req;

    dialogs.addAnswer(req.params.id, data, parentId);

    endResponse(res);
});

app.put('/dialogs/:id/swap-answer', (req, res) => {
    const { body: { answerId, direction } } = req;

    dialogs.swapAnswer(req.params.id, answerId, direction);

    endResponse(res);
});

app.put('/dialogs/:id/remove-answer', (req, res) => {
    const { body: { answerId } } = req;

    dialogs.removeAnswer(req.params.id, answerId);

    endResponse(res);
});

app.put('/dialogs/:id/update-answer', (req, res) => {
    const { body: { answerId, data } } = req;

    dialogs.updateAnswer(req.params.id, answerId, data);
    endResponse(res);
});

app.get('/login', (req, res) => {
    res.status(301);
    res.set('Location', `https://www.facebook.com/v2.8/dialog/oauth?` +
        `client_id=${config.appId}` +
        `&redirect_uri=${encodeURI(config.serverURL + "/auth")}` +
        `&response_type=code`);
    res.end();
});

app.get('/auth', (req, res) => {
    rp.get({
        uri: `https://graph.facebook.com/v2.8/oauth/access_token?` +
            `client_id=${config.appId}` +
            `&redirect_uri=${encodeURI(config.serverURL + "/auth")}` +
            `&client_secret=${config.appSecret}` +
            `&code=${req.query.code}`,
        json: true
    }).then(data => {
        res.status(301);
        res.set('Location', `/?token=${data.access_token}`);
        res.end()
    }).catch(err => {
        console.error(err);
        res.end()
    });
});

app.get('/check-token', (req, res) => {
    res.set('Content-type', 'application/json');
    rp.get({
       uri: `https://graph.facebook.com/me/?fields=name,accounts&access_token=${req.query.token}`,
       json: true
    }).then(data => {
        try {
            if (data.accounts.data.map(p => p.id).indexOf(config.pageId) > -1) {
                res.status(200);
                res.end(JSON.stringify({
                    tokenOk: true,
                    name: data.name
                }));
            } else {
                res.status(401);
                res.end('{"tokenOk": false}');
            }
        } catch (e) {
            res.end('{"tokenOk": false}');
        }
    }).catch(err => {
        console.error(err);
        res.status(401);
        res.end('{"tokenOk": false}');
    })
});


app.get('*', (req, res) => {
    res.render('index', {token: req.query.token});
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});