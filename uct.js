class UCT {
    constructor(coefficient) {
        this.coefficient = coefficient;
    }

    uctValue(parentVisitCount,  childVisitScore,  childVisitCount) {
        if (childVisitCount == 0) {
            return Infinity;
        }
        return (childVisitScore / childVisitCount + this.coefficient *  Math.sqrt(Math.log(parentVisitCount) / childVisitCount));
    }
    
    findPromisingNodeWithUCT(node) {
        let parentVisitCount = node.state.visitCount;
        let promisingNode = null;
        let promisingNodeValue = -Infinity;

        for (let child of node.children) {
            let childValue = this.uctValue(parentVisitCount, child.state.visitScore, child.state.visitCount, this.coefficient); 
            if (childValue > promisingNodeValue) {
                promisingNodeValue = childValue;
                promisingNode = child;
            }
        }
        return promisingNode;
    }
}
    