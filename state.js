class State {
    constructor(depth, playerId, move) {
        this.visitCount = 0;
        this.visitScore = 0;
        this.depth = depth;
        this.playerId = playerId;
        this.lastMove = move; //Le coup qui a mené à la création de ce noeud
        //Les 2 variables suivantes sont utilisées pour l'amélioration RAVE (Rapid Action Value Estimation), que je n'ai pas réussi à finir. 
        //Le principe est qu'à partir d'un noeud donné, 
        //le nombre de coup identique (et le nombre de coup identique gagnant) rencontrés lors des 4 phases du MCTS 
        //sont gardés en mémoire dans les noeuds enfant qui possèdent le même 'dernierCoup'.
        this.lastMoveScore = 0; //nombre de coup identique gagnant pour le parent (même principe de d'alternance entre parant et enfant que dans le MCTS classique
        this.lastMoveCount = 0; //nombre de coup identique rencontrés lors de la phase du MCTS
    }
    
    updateVisitCount() {
        this.visitCount++;
    }
    
    updateVisitScore(score) {
        this.visitScore += score;
    }
    
    updateLastMoveCount() {
        this.lastMoveCount++;
    }
    
    updateLastMoveScore(score) {
        this.lastMoveScore += score;
    }
}
