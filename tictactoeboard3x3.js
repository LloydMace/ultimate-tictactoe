class TicTacToeBoard3x3 {
    constructor(rows, length, xPos, yPos, xMargin, yMargin) {
        this.rows = rows;
        this.squareLength = length;
        this.xPos = xPos;
        this.yPos = yPos;
        this.xMargin = xMargin;
        this.yMargin = yMargin;
        this.grid = [];
    }

    init() {
        for (let i=0; i<this.rows; i++) {
            this.grid[i] = Array(this.rows).fill(0);
        }
    }

    show() {
        strokeWeight(5);
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.rows; j++) {
                let ratio = 1/5;
                if (this.grid[i][j] == - 1) {
                    line((i + ratio) * this.squareLength + this.xMargin, (j + ratio) * this.squareLength + this.yMargin, 
                    (i + 1 - ratio) * this.squareLength + this.xMargin, (j + 1 - ratio) * this.squareLength + this.yMargin);
                    line((i + ratio) * this.squareLength + this.xMargin, (j + 1 - ratio) * this.squareLength + this.yMargin, 
                    (i + 1 - ratio) * this.squareLength + this.xMargin, (j + ratio) * this.squareLength + this.yMargin);
                }
                else if (this.grid[i][j] == 1) {
                    circle((i + 1/2) * this.squareLength + this.xMargin, (j + 1/2) * this.squareLength + this.yMargin, (1 - 2 * ratio) * this.squareLength);
                }
                else {
                    line((i + ratio) * this.squareLength + this.xMargin, (j + 1/2) * this.squareLength + this.yMargin, 
                    (i + 1 - ratio) * this.squareLength + this.xMargin, (j + 1/2) * this.squareLength + this.yMargin);
                }
            }
        }
        for (let i=1; i<this.rows; i++) {
            line(i * this.squareLength + this.xMargin, this.yMargin, i * this.squareLength + this.xMargin, this.squareLength*this.rows + this.yMargin);
            
        }
        for (let j=1; j<this.rows; j++) {
            line(this.xMargin, j * this.squareLength + this.yMargin, this.squareLength*this.rows + this.xMargin, j * this.squareLength + this.yMargin);
        }
    }

    placeToken(mouseX, mouseY, player, humanPlayer) {
        let i = floor(mouseX / this.squareLength);
        let j = floor(mouseY / this.squareLength);
        if (i>=0 && i<this.rows && j>=0 && j<this.rows && this.grid[i][j] == 0 && player == humanPlayer) {
            this.grid[i][j] = player;
            return -player;
        }
        return player;
    }

    getAvailableMoves(player) {
        let availableMoves = [];
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.rows; j++) {
                if (this.grid[i][j] == 0) {
                    availableMoves.push({x : i, y : j, xPos : this.xPos, yPos : this.yPos, p : player});
                }
            }
        }
        return availableMoves;
    }

    playMove(move) {
        this.grid[move.x][move.y] = move.p;
    }
    
    checkLine(count, winner) {
        if (count == 3) {
            return 1;
        }
        else if (count == -3) {
            return -1;
        }
        else {
            return winner;
        }
    }

    whoWon() {
        let count = 0;
        let winner = 0;
        
        //column scanning
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.rows; j++) {
                count += this.grid[i][j];
            }
            winner = this.checkLine(count, winner);
            count = 0;
        }
        //row scanning
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.rows; j++) {
                count += this.grid[j][i];
            }
            winner = this.checkLine(count, winner);
            count = 0;
        }
        //downwards diagonal scanning
        for (let i=0; i<this.rows; i++) {
            count += this.grid[i][i];
        }
        winner = this.checkLine(count, winner);
        count = 0;
        //upwards diagonal scanning
        for (let i=0; i<this.rows; i++) {
            count += this.grid[i][(this.rows - 1) - i];
        }

        return this.checkLine(count, winner);
    }
    
    isGameFinished() {
        if (this.whoWon() != 0 || this.getAvailableMoves(1).length == 0) {
            return true;
        }
        else {
            return false;
        }
    }
}