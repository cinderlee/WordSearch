const express = require("express");
const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
	console.log(req.method, req.path, req.body);
	next();
});

app.get('/', function(req, res){
	res.redirect('index.html');
});

app.get('/home', function(req, res){
	res.redirect('/');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {console.log(`Server is listening on ${port}`);});