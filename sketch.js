//buttons
let restart;
let playerX;
let playerO;
let firstTurn;
let secondTurn;
let botVSbot;

//boolean
let isPlaying = false;
let isManually = false;

//board
let board;

let players = [-1, 1]; //["X", "O"]
let humanPlayer;
let currentPlayer;

let randomAI = new RandomSearch();

let minimaxAI = new Minimax(8);

function mousePressed() {
    if (isManually) {
        currentPlayer = board.placeToken(mouseX, mouseY, currentPlayer, humanPlayer);
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

function chooseSymbol() {
    playerX.remove();
    playerO.remove();

    //choose turn
    firstTurn = createButton("1st");
    firstTurn.position(400, 300);
    firstTurn.size(150, 150);
    firstTurn.style('font-size', '80px');
    firstTurn.mousePressed(() => {
        currentPlayer = humanPlayer;
        chooseTurn();
    });

    secondTurn = createButton("2nd");
    secondTurn.position(600, 300);
    secondTurn.size(150, 150);
    secondTurn.style('font-size', '80px');
    secondTurn.mousePressed(() => {
        currentPlayer = (-1) * humanPlayer;
        chooseTurn();
    });
}

function chooseTurn() {
    firstTurn.remove();
    secondTurn.remove();
    board = new TicTacToeBoard3x3(3, 80, 0, 0, 0, 0);
    board.init();
    setTimeout(() => {
    isManually = true;
    isPlaying = true;
    }, 10);

    botVSbot = createButton("bot VS bot");
    botVSbot.mousePressed(() => {isManually = false;})
}

function setup() {
    let cnv = createCanvas(1200, 800);
    cnv.position(0, 50);

    //choosing symbol
    playerX = createButton("X");
    playerX.position(400, 300);
    playerX.size(150, 150);
    playerX.style('font-size', '110px');
    playerX.mousePressed(() => {
        humanPlayer = -1;
        chooseSymbol();
    });

    playerO = createButton("O");
    playerO.position(600, 300);
    playerO.size(150, 150);
    playerO.style('font-size', '110px');
    playerO.mousePressed(() => {
        humanPlayer = 1;
        chooseSymbol();
    });
}

function draw() {
    if (isPlaying) { //the game has started
        //showing the board
        background(255);
        board.show();
        
        if (board.isGameFinished()) {
            let winner = board.whoWon();
            if (winner == 0) {
                console.log("It's a tie !");
            }
            else {
                console.log(intToChar(winner) + " won !");
            }
            noLoop();
        }
        
        else if (isManually) {
            if (currentPlayer != humanPlayer) {
                let move = minimaxAI.findBestMove(board, currentPlayer);
                board.playMove(move);
                currentPlayer = -currentPlayer;
            }
        }
        else if (!isManually) {
            let move = minimaxAI.findBestMove(board, currentPlayer);
            board.playMove(move);
            currentPlayer = -currentPlayer;
        }
    }
}