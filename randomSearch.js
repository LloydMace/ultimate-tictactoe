class RandomSearch {
    findBestMove(board, player) {
        return random(board.getAvailableMoves(player));
    }
}

