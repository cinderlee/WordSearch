class WordSearch{
    constructor(wordsFull, boardSize = 10){
        this.wordsFull = wordsFull;
        this.wordBank = [];
        this.wordsPossible = wordsFull.filter(word => word.length <= Math.floor(boardSize * 0.75));
        this.boardSize = boardSize;
        this.board = [];
        this.createBoard();
    }

    createBoard(){
        for (let row = 0 ; row < this.boardSize ; row++){
            const rowArray = [];
            for (let col = 0; col < this.boardSize; col++){
                rowArray.push('-');
            }
            this.board.push(rowArray);
        }
    }


    toString(){
        let s = "";
        for (let row = 0; row < this.boardSize; row ++){
            for (let col = 0; col < this.boardSize; col++){
                if (this.board[row][col] === '-'){
                    s += ' - ';
                } else{
                    s += this.board[row][col] + " ";
                }
            }
            s += '\n';
        }

        s += "\n  WORDS IN SEARCH: \n";
        let count = 0;
        for (const word of this.wordBank){
            s += word + "\t";
            count += 1;
            if (count % 4 === 0){
                s += "\n";
            }
        }
        return s;
    }

    reverse(word){
        return word.split( '' ).reverse( ).join( '' );
    }

    fillGrid(){
        for (let row = 0 ; row < this.boardSize; row++){
            for (let col = 0; col < this.boardSize; col++){
                if (this.board[row][col] === '-'){
                    const randomLetter = String.fromCharCode(65+Math.floor(Math.random() * 26));
                    this.board[row][col] = randomLetter;
                }
            }
        }
    }

    checkAddPossible(row, col, word, hDisplace, vDisplace){
        for ( let index = 0 ; index < word.length; index++){
            if(this.board[row][col] !== '-'){
                if (this.board[row][col] !== word[index]){
                    return false;
                }
            }
            row += hDisplace;
            col += vDisplace;
        }
        return true;
    }

    addWordLetters(row, col, word, hDisplace, vDisplace){
        for ( let index = 0 ; index < word.length; index++){
            this.board[row][col] = word[index];
            row += hDisplace;
            col += vDisplace;
        }
    }

    addWordToBoard(row, col, word, rDisp, cDisp, reverse=false){
        const upperWord = word.toUpperCase();
        if (this.boardSize - col >= word.length && this.boardSize - row >= word.length) {
            if (this.checkAddPossible(row, col, upperWord, rDisp, cDisp)){
                this.addWordLetters(row, col, upperWord, rDisp, cDisp);
                if (reverse){
                    this.wordBank.push(this.reverse(upperWord));
                } else {
                    this.wordBank.push(upperWord);
                }
                return true;
            }
        }
        return false;
    }

    addWordInDirection(rowNum, colNum, word, direction){
        const wordForm = [word, this.reverse(word)];
        const wordDir = Math.floor(Math.random() * 2);
        let rDisp = 1; 
        let cDisp = 1;
        let r = rowNum;
        let c = colNum;
        if (direction === 'H'){
            rDisp = 0;
        } else if (direction === 'V'){
            cDisp = 0;
        }

        while (r >= Math.floor(rowNum / 2) && c >= Math.floor(colNum / 2)){
            if (this.addWordToBoard(r, c, wordForm[wordDir], rDisp, cDisp, wordDir)){
                return true;
            } else {
                const otherIndex = wordDir === 1 ? 0 : 1;
                if (this.addWordToBoard(r, c, wordForm[otherIndex], rDisp, cDisp, !wordDir)){
                    return true;
                }
            }
            r -= rDisp;
            c -= cDisp;
        }

        return false;
    }

    addWords(){
        const tracker = [];
        while (this.wordBank.length < Math.floor(this.boardSize * 0.75)) {
            
            let index = Math.floor(Math.random() * this.wordsPossible.length);
            while (tracker.includes(index)){
                index = Math.floor(Math.random() * this.wordsPossible.length);
            }
            const rowNum = Math.floor(Math.random() * this.boardSize);
            const colNum = Math.floor(Math.random() * this.boardSize);
            const word = this.wordsPossible[index];

            const direction = ['H', 'V', 'D'];
            let firstDir, secondDir, lastDir; 
            while (!lastDir){
                const randomDir = Math.floor(Math.random() * direction.length);
                if (!firstDir){
                    firstDir = direction[randomDir];
                } else if (!secondDir){
                    secondDir = direction[randomDir];
                } else{
                    lastDir = direction[randomDir];
                }
                direction.splice(randomDir, 1);
            }

            if (this.addWordInDirection(rowNum, colNum, word, firstDir)){
                tracker.push(index);
            } else if (this.addWordInDirection(rowNum, colNum, word, secondDir)){
                tracker.push(index);
            } else if (this.addWordInDirection(rowNum, colNum, word, lastDir)){
                tracker.push(index);
            }
        }
    }

    fill(){
        this.addWords();
        this.fillGrid();
    }
}

module.exports = {
	WordSearch
};