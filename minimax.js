class Minimax {
    constructor(board, playerId, depth) {
        this.board = board;
        this.playerId = playerId;
        this.depth = depth;
    }

    updateBoard(board) {
        this.board = board;
    }

    heuristic() {
        let score = 0;
        let winner = this.board.grid3x3.whoWon();
        let whoWonGrid;

        //center square
        let centerSquare = 200;
        if (this.board.grid9x9[1][1].grid[1][1] == this.playerId) {
            score += centerSquare;
        }
        if (this.board.grid9x9[1][1].grid[1][1] == -this.playerId) {
            score += -centerSquare;
        }

        //win/lose game
        let winGame = 1000;
        if (winner == this.playerId) {
            score += winGame;
        }
        //
        if (winner == -this.playerId) {
            score += -winGame;
        }

        //win/lose sub-grids
        let centerGrid = 100;
        let cornerGrid = 50;
        let sideGrid = 20;
        let gridScores = {
            "0 0" : cornerGrid,
            "0 1" : sideGrid,
            "0 2" : cornerGrid,
            "1 0" : sideGrid,
            "1 1" : centerGrid,
            "1 2" : sideGrid,
            "2 0" : cornerGrid,
            "2 1" : sideGrid,
            "2 2" : cornerGrid,
        };

        for (let i=0; i<this.board.rows; i++) {
            for (let j=0; j<this.board.rows; j++) {
                whoWonGrid = this.board.grid9x9[i][j].whoWon();
                if (whoWonGrid == this.playerId) {
                    score += gridScores[i + " " + j];
                }
                else if (whoWonGrid == -this.playerId) {
                    score += -gridScores[i + " " + j];
                }
            }
        }

        //in a given grid
        let center = 0;
        let corner = 5;
        let side = 2;
        let scores = {
            "0 0" : corner,
            "0 1" : side,
            "0 2" : corner,
            "1 0" : side,
            "1 1" : center,
            "1 2" : side,
            "2 0" : corner,
            "2 1" : side,
            "2 2" : corner,
        };

        for (let i=0; i<this.board.rows; i++) {for (let j=0; j<this.board.rows; j++) {
            for (let m=0; m<this.board.rows; m++) {for (let n=0; n<this.board.rows; n++) {
               if (this.board.grid3x3.grid[i][j] == 0) {
                if (this.board.grid9x9[i][j].grid[m][n] == this.playerId) {
                    score += scores[m + " " + n];
                }
                else if (this.board.grid9x9[i][j].grid[m][n] == -this.playerId) {
                    score += -scores[m + " " + n];
                }
               }
            }}
        }}
        
        //alignment


        return score;
    }

    minimax(depth, maximizingPlayer, alpha, beta) {
        let value;
        let lastMove;
        if (depth == 0 || this.board.isGameFinished()) {
            return this.heuristic();
        }
        else if (maximizingPlayer) {
            value = -Infinity;
            let availableMoves = this.board.getAvailableMoves(this.playerId);
            for (let move of availableMoves) {
                lastMove = this.board.lastMove;
                this.board.playMove(move);
                this.board.checkGrids();
                value = max(value, this.minimax(depth-1, false, alpha, beta));
                this.board.grid9x9[move.xPos][move.yPos].grid[move.x][move.y] = 0;
                this.board.checkGrids();
                this.board.lastMove = lastMove;
                alpha = max(alpha, value);
                if (alpha >= beta) {
                    break;
                }
            }
            return value;
        }
        else if (!maximizingPlayer) {
            value = Infinity;
            let availableMoves = this.board.getAvailableMoves(-this.playerId);
            for (let move of availableMoves) {
                lastMove = this.board.lastMove;
                this.board.playMove(move);
                this.board.checkGrids();
                value = min(value, this.minimax(depth-1, true, alpha, beta));
                this.board.grid9x9[move.xPos][move.yPos].grid[move.x][move.y] = 0;
                this.board.checkGrids();
                this.board.lastMove = lastMove;
                beta = min(beta, value);
                if (alpha >= beta) {
                    break;
                }
            }
            return value;
        }
    }

    findBestMove() {
        let score = -Infinity
        let bestScore = score;
        let bestMove = null;
        let lastMove;
        let getAvailableMoves = this.board.getAvailableMoves(this.playerId);
        for (let move of getAvailableMoves) {
            lastMove = this.board.lastMove;
            this.board.playMove(move);
            score = this.minimax(this.depth, false, -Infinity, Infinity);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
            this.board.grid9x9[move.xPos][move.yPos].grid[move.x][move.y] = 0;
            this.board.lastMove = lastMove;
        }
        return bestMove;
    }
}