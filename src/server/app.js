const
    bodyParser = require('body-parser'),
    express = require('express'),
    dialogs = require('./dialogs');

const app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));

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

app.get('/dialogs', (req, res) => {
    endResponse(res);
});

app.del('/dialogs/:id', (req, res) => {

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

app.get('*', (req, res) => {
    res.render('index');
});


app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});