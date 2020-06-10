class RandomAI {
    constructor(board, playerId) {
        this.board = board;
        this.playerId = playerId;
    }

    findBestMove() {
        return random(this.board.getAvailableMoves(this.playerId));
    }

    updateBoard(board) {
        this.board = board;
    }
}

