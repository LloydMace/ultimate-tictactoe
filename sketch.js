//canvas
let canvasX = 0;
let canvasY = 50;

//buttons
let playerX;
let playerO;
let firstTurn;
let secondTurn;
let playGame;
let pauseGame;
let restartGame;

//dropdown menus
let youSelect;
let opponentSelect;
let manualSelect;

//boolean
let isPlaying = false;
let isShowing = false;
let isManual = false;

//board
let board;

//players: -1 <-> "X", 1 <-> "O"
let humanPlayer;
let opponentPlayer;
let currentPlayer;
let firstPlayer;

//texts
let humanText;
let opponentText;

//AIs
mctsIterations = 4000;
mctsTime = 1000; // ms
minimaxDepth = 6;

//global mousePressed function
function mousePressed() {
    if (isManual) {
        currentPlayer = board.placeToken(mouseX, mouseY, currentPlayer, humanPlayer, opponentPlayer);
    }
}

//functions
function swapPlayers(currentPlayer, P1, P2) {
    if (currentPlayer.id == P1.id) {
        return P2;
    }
    else if (currentPlayer.id == P2.id) {
        return P1;
    }
}

function selectAI(board, playerId, str) {
    if (str == 'random') {
        return new RandomAI(board, playerId);
    }
    else if (str == 'minimax') {
        return new Minimax(board, playerId, minimaxDepth);
    }
    else if (str == 'mcts') {
        return new MCTS(board, playerId, mctsIterations, mctsTime);
    }
}

function intToChar(int) {
    if (int == 1) {
        return 'O';
    }
    else if (int == -1) {
        return 'X';
    }
    else {
        return '-';
    }
}

function updateBoards(board) {
    currentPlayer.ai.updateBoard(board);
    opponentPlayer.ai.updateBoard(board);
    humanPlayer.ai.updateBoard(board);
}

//functions for initializing
function chooseSymbol() {
    playerX.remove();
    playerO.remove();

    //choose turn
    textSize(100);
    text("Play", 150, 350);
    text("move", 800, 350);

    firstTurn = createButton("1st");
    firstTurn.position(400, 300);
    firstTurn.size(150, 150);
    firstTurn.style('font-size', '80px');
    firstTurn.mousePressed(() => {
        currentPlayer = humanPlayer;
        firstPlayer = currentPlayer;
        humanText = "played 1st";
        opponentText = "played 2nd";
        chooseTurn();
    });

    secondTurn = createButton("2nd");
    secondTurn.position(600, 300);
    secondTurn.size(150, 150);
    secondTurn.style('font-size', '80px');
    secondTurn.mousePressed(() => {
        currentPlayer = opponentPlayer;
        firstPlayer = currentPlayer;
        humanText = "played 2nd";
        opponentText = "played 1st";
        chooseTurn();
    });
}

function chooseTurn() {
    firstTurn.remove();
    secondTurn.remove();

    setTimeout(() => {
        isShowing = true;
    }, 10);

    youSelect = createSelect();
    youSelect.position(100, 200);
    youSelect.option('mcts');
    youSelect.option('rave');
    youSelect.option('minimax');
    youSelect.option('random');
    youSelect.selected('mcts');
    youSelect.changed(() => {
        humanPlayer.ai = selectAI(board, humanPlayer.id, youSelect.value());
        if (currentPlayer.id == humanPlayer.id) {
            currentPlayer = humanPlayer;
        }
    });

    opponentSelect = createSelect();
    opponentSelect.position(100, 400);
    opponentSelect.option('mcts');
    opponentSelect.option('rave');
    opponentSelect.option('minimax');
    opponentSelect.option('random');
    opponentSelect.selected('mcts');
    opponentSelect.changed(() => {
    opponentPlayer.ai = selectAI(board, opponentPlayer.id, opponentSelect.value());
        if (currentPlayer.id == opponentPlayer.id) {
            currentPlayer = opponentPlayer;
        }
    });

    playGame = createButton("Play");
    playGame.position(1000, 200);
    playGame.mousePressed(() => {
        isPlaying = true;
        isManual = (playManually.value() == 'yes' ? true : false);
    });

    pauseGame = createButton("Pause");
    pauseGame.position(1000, 250);
    pauseGame.mousePressed(() => {
        isPlaying = false;
    });

    restartGame = createButton("Restart");
    restartGame.position(1000, 300);
    restartGame.mousePressed(() => {
        currentPlayer = swapPlayers(firstPlayer, humanPlayer, opponentPlayer);
        firstPlayer = currentPlayer;
        isPlaying = false;
        board.init();
        loop();
    });

    playManually = createSelect();
    playManually.position(150, 275);
    playManually.option('yes');
    playManually.option('no');
    playManually.selected('yes');
    playManually.changed(() => {
        if (isPlaying) {
            isManual = (playManually.value() == 'yes' ? true : false);
        }
    });

    let div = createDiv('').size(1000, 100);
    
    div.html('Press Play to start playing !');
    div.position(335, 50);
    div.style('font-size', '50px'); 
    
}

//setup and draw 

//setup
function setup() {
    let cnv = createCanvas(1200, 800);
    cnv.position(canvasX, canvasY);

    board = new TicTacToeBoard9x9(3, 200, 4/5, 300, 100);
    board.init();

    //choosing symbol
    playerX = createButton("X");
    playerX.position(400, 300);
    playerX.size(150, 150);
    playerX.style('font-size', '110px');
    playerX.mousePressed(() => {
        humanPlayer = {id : -1, ai : new MCTS(board, -1, mctsIterations, mctsTime)};
        opponentPlayer = {id : 1, ai : new MCTS(board, 1, mctsIterations, mctsTime)}; 
        chooseSymbol();
    });

    playerO = createButton("O");
    playerO.position(600, 300);
    playerO.size(150, 150);
    playerO.style('font-size', '110px');
    playerO.mousePressed(() => {
        humanPlayer = {id : 1, ai : new MCTS(board, 1, mctsIterations, mctsTime)};
        opponentPlayer = {id : -1, ai : new MCTS(board, -1, mctsIterations, mctsTime)}; 
        chooseSymbol();
    });
}

//draw
function draw() {
    if (isShowing) {
        background(255);

        //text for dropdown menus
        let txtSize = 20;
        let xSpacing = 5;
        let ySpacing = 25;
        let youPos = {x:xSpacing, y:200};
        let oppPos = {x:xSpacing, y:400};
        textSize(txtSize);
        textAlign(LEFT, TOP);
        text("you: ", youPos.x - canvasX, youPos.y - canvasY);
        text("symbol: " + intToChar(humanPlayer.id), youPos.x - canvasX, youPos.y + ySpacing - canvasY);
        text(humanText, youPos.x - canvasX, youPos.y + 2 * ySpacing - canvasY);
        text("play manually : ", youPos.x - canvasX, youPos.y + 3 * ySpacing - canvasY);
        
        text("opponent: ", oppPos.x - canvasX, oppPos.y - canvasY);
        text("symbol: " + intToChar(opponentPlayer.id), oppPos.x - canvasX, oppPos.y + ySpacing - canvasY);
        text(opponentText, oppPos.x - canvasX, oppPos.y + 2 * ySpacing - canvasY);

        //showing the board
        board.show(2, 4);
    }
        
    if (isPlaying) {
        if (board.isGameFinished()) {
            let winner = board.grid3x3.whoWon();
            if (winner == 0) {
                console.log("It's a tie !");
            }
            else {
                console.log(intToChar(winner) + " won !");
            }
            noLoop();
        }
        
        else if (isManual) {
            if (currentPlayer.id == opponentPlayer.id) {
                updateBoards(board);
                let move = currentPlayer.ai.findBestMove();
                board.playMove(move);
                currentPlayer = swapPlayers(currentPlayer, humanPlayer, opponentPlayer);
            }
        }
        else if (!isManual) {
            updateBoards(board);
            let move = currentPlayer.ai.findBestMove();
            board.playMove(move);
            currentPlayer = swapPlayers(currentPlayer, humanPlayer, opponentPlayer);
        }
    }
}