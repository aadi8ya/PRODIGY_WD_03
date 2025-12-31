let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameMode = "friend";
let gameActive = true;
let startingPlayer = "X";
let scores = { X:0, O:0, draw:0 };

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function setMode(mode){
    gameMode = mode;
    document.querySelectorAll(".mode-btn").forEach(b=>b.classList.remove("active"));
    event.target.classList.add("active");
    playerSelection.classList.toggle("hidden", mode==="computer");
    resetGame();
}

function setStartingPlayer(p){
    startingPlayer = p;
    document.querySelectorAll(".player-btn").forEach(b=>b.classList.remove("active"));
    event.target.classList.add("active");
    resetGame();
}

function makeMove(i){
    if(!gameActive || board[i] !== "") return;

    board[i] = currentPlayer;
    updateBoard();

    if(checkWinner()){
        highlightWinner();
        gameInfo.textContent = `Player ${currentPlayer} Wins 🎉`;
        scores[currentPlayer]++;
        updateScores();
        gameActive = false;
        return;
    }

    if(board.every(c => c !== "")){
        gameInfo.textContent = "Match Draw 🤝";
        scores.draw++;
        updateScores();
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    gameInfo.textContent = `Player ${currentPlayer}'s Turn`;

    if(gameMode === "computer" && currentPlayer === "O"){
        setTimeout(computerMove,500);
    }
}

function computerMove(){
    makeMove(findBestMove());
}

function findBestMove(){
    for(let i=0;i<9;i++){
        if(board[i]===""){
            board[i]="O";
            if(checkWinner()){ board[i]=""; return i; }
            board[i]="";
        }
    }
    for(let i=0;i<9;i++){
        if(board[i]===""){
            board[i]="X";
            if(checkWinner()){ board[i]=""; return i; }
            board[i]="";
        }
    }
    if(board[4]==="") return 4;

    let free = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
    return free[Math.floor(Math.random()*free.length)];
}

function checkWinner(){
    return winPatterns.some(p=>{
        let [a,b,c] = p;
        return board[a] && board[a]===board[b] && board[a]===board[c];
    });
}

function highlightWinner(){
    winPatterns.forEach(p=>{
        let [a,b,c] = p;
        if(board[a] && board[a]===board[b] && board[a]===board[c]){
            document.querySelectorAll(".cell")[a].classList.add("winner");
            document.querySelectorAll(".cell")[b].classList.add("winner");
            document.querySelectorAll(".cell")[c].classList.add("winner");
        }
    });
}

function updateBoard(){
    document.querySelectorAll(".cell").forEach((cell,i)=>{
        cell.textContent = board[i];
        cell.classList.toggle("taken", board[i] !== "");
        cell.classList.toggle("x", board[i] === "X");
        cell.classList.toggle("o", board[i] === "O");
    });
}

function updateScores(){
    xScore.textContent = scores.X;
    oScore.textContent = scores.O;
    drawScore.textContent = scores.draw;
}

function resetGame(){
    board = ["","","","","","","","",""];
    currentPlayer = startingPlayer;
    gameActive = true;

    document.querySelectorAll(".cell").forEach(c=>{
        c.textContent = "";
        c.className = "cell";
    });

    gameInfo.textContent = `Player ${currentPlayer}'s Turn`;

    if(gameMode==="computer" && currentPlayer==="O"){
        setTimeout(computerMove,500);
    }
}
