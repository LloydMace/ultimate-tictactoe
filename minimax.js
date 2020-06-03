class Minimax {
    constructor(depth) {
        this.depth = depth;
    }

    heuristic(board, humanPlayer) {
        let winner = board.whoWon();
        let score = 0;
        //win or lose
        let win = 10;
        if (winner == humanPlayer) {
            score += win;
        }
        if (winner == -humanPlayer) {
            score += -win;
        }
        //middle
        let middle = 2;
        if (board.grid[1][1] == humanPlayer) {
            score += middle;
        }
        if (board.grid[1][1] == -humanPlayer) {
            score += -middle;
        }
        //corners
        let corner = 1;
        if (board.grid[0][0] == humanPlayer) {
            score += corner;
        }
        if (board.grid[2][0] == humanPlayer) {
            score += corner;
        }
        if (board.grid[0][2] == humanPlayer) {
            score += corner;
        }
        if (board.grid[2][2] == humanPlayer) {
            score += corner;
        }
        //
        if (board.grid[0][0] == -humanPlayer) {
            score += -corner;
        }
        if (board.grid[2][0] == -humanPlayer) {
            score += -corner;
        }
        if (board.grid[0][2] == -humanPlayer) {
            score += -corner;
        }
        if (board.grid[2][2] == -humanPlayer) {
            score += -corner;
        }
        return score;
    }

    minimax(depth, maximizingPlayer, board, player) {
        if (depth == 1) {
        }
        let value;
        if (depth == 0 || board.isGameFinished()) {
            return this.heuristic(board, player);
        }
        
        else if (maximizingPlayer) {
            value = -Infinity;
            let availableMoves = board.getAvailableMoves(player);
            for (let move of availableMoves) {
                board.playMove(move);
                value = max(value, this.minimax(depth-1, false, board, player));
                board.grid[move.x][move.y] = 0;
            }
            return value;
        }
        else if (!maximizingPlayer) {
            value = Infinity;
            let availableMoves = board.getAvailableMoves(-player);
            for (let move of availableMoves) {
                board.playMove(move);
                value = min(value, this.minimax(depth-1, true, board, player));
                board.grid[move.x][move.y] = 0;
            }
            return value;
        }
        
    }

    findBestMove(board, player) {
        let score = -Infinity
        let bestScore = score;
        let bestMove = null;
        let getAvailableMoves = board.getAvailableMoves(player);
        for (let move of getAvailableMoves) {
            board.playMove(move);
            score = this.minimax(this.depth, false, board, player);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
            board.grid[move.x][move.y] = 0;
        }
        return bestMove;
    }
}