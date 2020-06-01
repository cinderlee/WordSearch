const express = require("express");
const fs = require('fs');
const app = express();
const ws = require('./wordSearch.js')

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

app.get('/createBoard', function(req, res){
	fs.readFile('../../words_full.txt', 'utf8', function(err,data){
		if(err){
			console.log("Uh Oh! Where's the file?\n", err);
		}
		else{
			const arr = data.split('\r\n');
			const wsBoard = new ws.WordSearch(arr, 20);
			wsBoard.fill();
			
			const boardArr = [];
			for (const row of wsBoard.board){
				for (const col of row){
					boardArr.push(col);
				}
			}
			// console.log(wsBoard.wordBank);
			const bank = [];
			for (const word of wsBoard.wordBank){
				bank.push(word);
			}
			console.log(bank);
			res.json({ wordBank: wsBoard.wordBank, board: wsBoard.board});
		}
	});
});

const port = process.env.PORT || 3000;

app.listen(port, () => {console.log(`Server is listening on ${port}`);});