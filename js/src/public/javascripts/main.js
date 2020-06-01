let letterPos = [];
let dirLeft = null;
let dirRight = null;
let select = false;

async function fetchUrl(url, paramObj){
	const response = await fetch(url, paramObj);
	if (response.status >= 200 && response.status < 300){
		return await response.json();
	}
	throw new Error(`Response status was ${response.status}`);
}

function handleSelect(row, col){
    if (letterPos.length === 0){
        letterPos.push([row, col]);
        return true;
    } else {
        const lastPos = letterPos[letterPos.length - 1];
        if (lastPos[0] === row && lastPos[1] === col){
            return false;
        }
        // console.log(lastPos);
        if (dirLeft !== null){
            if (lastPos[0] + dirLeft === row && lastPos[1] + dirRight === col){
                letterPos.push([row, col]);
                return true;
            }
        }
        else{
            dirLeft = row - lastPos[0];
            dirRight = col - lastPos[1];
            letterPos.push([row, col])
            return true;
        }
    }
    return false;
}

function loadBoard(){
	fetchUrl('/createBoard', {
		method: "GET"
	}).then(boardInfo => {
		if (boardInfo.hasOwnProperty('error')){
			console.log(boardInfo.error);
		}
		else{
            const board = boardInfo.board;
            const wordBank = boardInfo.wordBank;
            const boardRows = boardInfo.size;
            const boardDiv = document.querySelector('.board');
            const bankDiv = document.querySelector('.wordBank');
            for (let row = 0; row < board.length; row++){
                for (let col = 0; col < board.length; col++){
                    const cell = document.createElement('div');
                    cell.setAttribute('class', 'cell')
                    cell.setAttribute('id', (row * board.length + col).toString());
                    cell.addEventListener('mousedown', function(event){
                        // letterPos.push([row, col]);
                        this.style.backgroundColor = '#54c0ff';
                        select = true;
                    })
                    cell.addEventListener('mousemove', function(event){
                        event.preventDefault();
                        if (select){
                            const selectDone = handleSelect(row, col);
                            if (selectDone){
                                this.style.backgroundColor = '#54c0ff';
                            }
                        }
                        // const lastPos = letterPos[letterPos.length - 1];
                        // // console.log(lastPos);
                        // if (dirLeft){
                        //     console.log(dirLeft, dirRight);
                        //     if (lastPos[0] + dirLeft === row && lastPos[1] + dirRight === col){
                        //         letterPos.push([row, col]);
                        //         this.style.backgroundColor = '#54c0ff';
                        //     }
                        // }
                        // else{
                        //     dirLeft = row - lastPos[0];
                        //     dirRight = col - lastPos[1];
                        //     letterPos.push([row, col])
                        //     this.style.backgroundColor = '#54c0ff';
                        // }
                    })
                    cell.addEventListener('mouseup', function(event){
                        let letters = "";
                        for (const [row, col] of letterPos){
                            letters += board[row][col];
                        }
                        console.log(letters);
                        console.log(wordBank)
                        if (!(wordBank.includes(letters))){
                            for (const [row, col] of letterPos){
                                const box = document.getElementById((row * board.length + col).toString());
                                box.style.backgroundColor = "";
                            }
                        }
                        letterPos = [];
                        dirLeft = null;
                        dirRight = null;
                        select = false;
                    })
                    const letter = document.createTextNode(board[row][col]);
                    cell.appendChild(letter)
                    boardDiv.appendChild(cell)
                }
                boardDiv.appendChild(document.createElement('br'))
            }
            for (const word of wordBank){
                bankDiv.appendChild(document.createTextNode(word));
                bankDiv.appendChild(document.createElement('br'))
            }
        }
	}).catch((error) => {
		console.log('Error: ' + error);
	});
}

function main() {
   loadBoard();
}

document.addEventListener('DOMContentLoaded', main);