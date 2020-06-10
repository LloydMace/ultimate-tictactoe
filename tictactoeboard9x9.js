
class TicTacToeBoard9x9 {
    constructor(rows, length, smallGridRatio, xMargin, yMargin) {
        this.rows = rows;
        this.length = length;
        this.ratio = smallGridRatio; //how small will the 3x3 grids be in the 9x9 grid
        this.xMargin = xMargin;
        this.yMargin = yMargin;
        this.grid3x3;
        this.grid9x9 = [];
        //this.lastMove = {x : 1, y : 1, xPos : 1, yPos : 1, p : 0};
        this.lastMove = null;
    }

    init() {
        this.grid3x3 = new TicTacToeBoard3x3(this.rows, this.ratio / 2 * this.length / this.rows, 3, 3, 5, 0);
        this.grid3x3.init();
        for (let i=0; i<this.rows; i++) {
            this.grid9x9[i] = [];
            for (let j=0; j<this.rows; j++) {
                this.grid9x9[i][j] = new TicTacToeBoard3x3(this.rows, this.ratio * this.length / this.rows, i, j, 
                    (i + (1 - this.ratio)/2) * this.length + this.xMargin, 
                    (j + (1 - this.ratio)/2) * this.length + this.yMargin);
                this.grid9x9[i][j].init();
            }
        }
        this.lastMove = null;
    }

    show(strokeWeight3x3, strokeWeight9x9) {
        strokeWeight(strokeWeight3x3);
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.rows; j++) {
                strokeWeight(strokeWeight9x9);
                this.grid9x9[i][j].show();
                strokeWeight(strokeWeight9x9 * 2);
                if (this.grid3x3.grid[i][j] == 1) {
                    noFill();
                    circle(this.grid9x9[i][j].xMargin + this.length*this.ratio/2, 
                        this.grid9x9[i][j].yMargin + this.length*this.ratio/2, 
                        this.length * this.ratio);
                    fill(0);
                }
                else if (this.grid3x3.grid[i][j] == -1) {
                    line(this.grid9x9[i][j].xMargin, this.grid9x9[i][j].yMargin,
                        this.grid9x9[i][j].xMargin + this.ratio * this.length,
                        this.grid9x9[i][j].yMargin + this.ratio * this.length);
                    line(this.grid9x9[i][j].xMargin, this.grid9x9[i][j].yMargin + this.ratio * this.length,
                        this.grid9x9[i][j].xMargin + this.ratio * this.length, this.grid9x9[i][j].yMargin);
                }
            }
        }
        strokeWeight(strokeWeight9x9);
        for (let i=1; i<this.rows; i++) {
            line(i * this.length + this.xMargin, this.yMargin, i * this.length + this.xMargin, this.length*this.rows + this.yMargin);
            line(this.xMargin, i * this.length + this.yMargin, this.length*this.rows + this.xMargin, i * this.length + this.yMargin);
        }
    }

    placeToken(mouseX, mouseY, currentPlayer, player, opponentPlayer) {
        let i = floor((mouseX - this.xMargin) / this.length);
        let j = floor((mouseY - this.yMargin) / this.length);
        if (i>=0 && i<this.rows && j>=0 && j<this.rows && currentPlayer.id == player.id) {
            if (this.lastMove == null) {
                return this.grid9x9[i][j].placeToken(mouseX, mouseY, currentPlayer, player, opponentPlayer, this);
            }
            else if (this.grid3x3.grid[i][j] == 0) {
                if (this.grid3x3.grid[this.lastMove.x][this.lastMove.y] != 0) {
                    return this.grid9x9[i][j].placeToken(mouseX, mouseY, currentPlayer, player, opponentPlayer, this);
                }
                else if (this.lastMove.x == i && this.lastMove.y == j) {
                    return this.grid9x9[i][j].placeToken(mouseX, mouseY, currentPlayer, player, opponentPlayer, this);
                } else {return currentPlayer;}
            } else {return currentPlayer;}
        } else {return currentPlayer;}
    }

    getAvailableMoves(playerId) {
        let availableMoves = [];
        if (this.lastMove == null) {
            for (let i=0; i<this.rows; i++) {
                for (let j=0; j<this.rows; j++) {
                    availableMoves = availableMoves.concat(this.grid9x9[i][j].getAvailableMoves(playerId));
                }
            }
        }
        else if (this.grid3x3.grid[this.lastMove.x][this.lastMove.y] == 0 
            && this.grid9x9[this.lastMove.x][this.lastMove.y].getAvailableMoves(playerId).length > 0) {
            availableMoves = availableMoves.concat(this.grid9x9[this.lastMove.x][this.lastMove.y].getAvailableMoves(playerId));
        }
        else {
            for (let i=0; i<this.rows; i++) {
                for (let j=0; j<this.rows; j++) {
                    if (this.grid3x3.grid[i][j] == 0) {
                        availableMoves = availableMoves.concat(this.grid9x9[i][j].getAvailableMoves(playerId));
                    }
                }
            }
        }
        return availableMoves;
    }

    playMove(move) {
        this.grid9x9[move.xPos][move.yPos].playMove(move);
        this.lastMove = move;
        this.checkGrids();
    }

    checkGrids() {
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.rows; j++) {
                this.grid3x3.grid[i][j] = this.grid9x9[i][j].whoWon();
            }
        }
    }
    
    isGameFinished() {
        if (this.grid3x3.whoWon() != 0 || this.getAvailableMoves(1).length == 0) {
            return true;
        }
        else {
            return false;
        }
    }

    saveBoard() {
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.rows; j++) {
                this.grid9x9[i][j].saveBoard();
            }
        }
    }

    restoreBoard() {
        for (let i=0; i<this.rows; i++) {
            for (let j=0; j<this.rows; j++) {
                this.grid9x9[i][j].restoreBoard();
            }
        } 
    }
}
