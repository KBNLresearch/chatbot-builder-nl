const
    bodyParser = require('body-parser'),
    express = require('express'),
    request = require('request');

const app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});