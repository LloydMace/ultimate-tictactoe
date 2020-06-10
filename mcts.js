class MCTS {
    constructor(board, playerId, iterations, time) {
        this.board = board;
        this.playerId = playerId;
        this.iterations = iterations;
        this.time = time;
        this.root = new Node(new State(0, playerId, null), null);
        this.node = this.root;
        this.uct = new UCT(Math.sqrt(2));
        this.board.saveBoard();
    }

    updateBoard(board) {
        this.board = board;
        this.board.saveBoard();
        this.root = new Node(new State(0, this.playerId, null), null);
        this.node = this.root;
    }

    findBestMove() {
        const endTime = Date.now() + this.time;
        while (endTime > Date.now()) {
        //for (let i=0; i < this.iterations; i++) {
            this.selection();
            if (this.board.isGameFinished()) {
                this.backPropagation();
            }
            else {
                this.expansion();
                this.simulation();
                this.backPropagation();
            }
        }
        let score;
        let bestScore = -Infinity;
        for (let child of this.root.children) {
            score = child.state.visitScore / child.state.visitCount;
            if (score > bestScore) {
                bestScore = score;
                this.node = child;
            }
        }
        return this.node.state.lastMove;
    }
    
    selection() {
        while (this.node.children.length != 0) {
            this.node = this.uct.findPromisingNodeWithUCT(this.node);
            this.board.playMove(this.node.state.lastMove);
        }
    }
    
    expansion() {
        let availableMoves = this.board.getAvailableMoves(this.node.state.playerId);
        let newDepth = this.node.state.depth + 1;
        for (let move of availableMoves) {
            this.node.children.push(new Node(new State(newDepth, -this.node.state.playerId, move), this.node));
        }
        this.node = random(this.node.children);
        this.board.playMove(this.node.state.lastMove);
    }
    
    simulation() {
        let tempPlayerId = this.node.state.playerId;
        while (!this.board.isGameFinished()) {
            this.board.playMove(random(this.board.getAvailableMoves(tempPlayerId)));
            tempPlayerId = -tempPlayerId;
        }
    }
    
    backPropagation() {
        let winner = this.board.grid3x3.whoWon();
        while (this.node != null) {
            this.node.state.updateVisitCount();
            if (winner == 0) {
                this.node.state.updateVisitScore(0.5);
            }
            else if (this.node.state.playerId == -winner) {
                this.node.state.updateVisitScore(1);
            }
            this.node = this.node.parent;
        }
        this.node = this.root;
        this.board.restoreBoard();
    }
}