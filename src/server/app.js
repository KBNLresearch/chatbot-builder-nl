const
    bodyParser = require('body-parser'),
    express = require('express'),
    dialogs = require('./dialogs');

const app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));


app.post('/add-dialog', (req, res) => {
    const { body: { userText } } = req;

    dialogs.addDialog(userText);

    res.status(200);
    res.set("Content-type", "application/json");
    res.end(JSON.stringify(dialogs.listDialogs()));
});

app.get('/dialogs', (req, res) => {

    res.status(200);
    res.set("Content-type", "application/json");
    res.end(JSON.stringify(dialogs.listDialogs()));
});

app.del('/dialogs/:id', (req, res) => {

    dialogs.removeDialog(req.params.id);

    res.status(200);
    res.set("Content-type", "application/json");
    res.end(JSON.stringify(dialogs.listDialogs()));
});

app.get('*', (req, res) => {
    res.render('index');
});


app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});