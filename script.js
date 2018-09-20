//no difficulty or two player functionality yet!
var origBoard;
var huPlayer = "O";
var tracker = 1;
if (document.querySelectorAll('.XorO').forEach(letter=>{
   if (letter.checked) {
     var huPlayer = letter.value}
}));
console.log(document.getElementById('#twoPlayer'))
var twoPlayer = false;
var aiPlayer = huPlayer === "O" ? "X" : "O";
const winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,4,8],
  [6,4,2],
  [0,3,6],
  [1,4,7],
  [2,5,8]
];
const cells = document.querySelectorAll('.cell');

function colorChange() {

}

function showSettings() {
  document.querySelector(".settings").style.display =  document.querySelector(".settings").style.display == "none" ? "block" : "none";
};

function startGame() {
  document.querySelector(".settings").style.display = "none";
  document.querySelector(".beginning").style.display = "none";
  origBoard = Array.from(Array(9).keys()); //creates an array of 0-8
  cells.forEach(cell => {
    setTimeout(function(){cell.classList.add("colorChangeRight")},tracker*100);
    setTimeout(function(){cell.classList.add("colorChangeBottom")},tracker*100);
    tracker++
    cell.innerText= '';
    cell.addEventListener('click',turnClick, false);
  });
  tracker = 1;
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] =='number') {
    turn(square.target.id, huPlayer)
    if (!checkTie())
      if (!twoPlayer)
        setTimeout(function(){turn(bestSpot(), aiPlayer);},500);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a,e,i) =>
    (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem)> -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}
var tracker = 1;
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    setTimeout(function(){document.getElementById(index).style.color =
      gameWon.player == huPlayer ? "#FDF5BF" : "#AD7A99";},(tracker*300));
      tracker++;
  }
  for (let index of winCombos[gameWon.index]) {
    setTimeout(function(){document.getElementById(index).style.color = '#CEE0DC';},(tracker*300));
    tracker++;
  }
  cells.forEach(cell => {cell.removeEventListener('click', turnClick, false);});
  declareWinner(gameWon.player == huPlayer ? "You Win!" : "Better luck Next Time!")
}

function declareWinner(who) {
  document.querySelector('.beginning').style.display = "block";
  document.querySelector('.beginning .intro').innerHTML = '<h3>'+who+"</h3>";
}

function emptySquares() {
  return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {;
  return minimax(origBoard, aiPlayer).index;

}
tracker=0
function checkTie() {
  if (emptySquares().length == 0) {
    cells.forEach(cell => {
      setTimeout(function(){cell.style.color = "#2B2D42";},tracker*300);
      tracker++;
            setTimeout(function(){cell.style.color = "#fff";},tracker*300);
      cell.removeEventListener('click',turnClick, false);
    });
    declareWinner("Tie Game!")
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares();
  if (checkWin(newBoard, huPlayer)) {
    return {score: -10};
  } else if (checkWin(newBoard, aiPlayer)) {
    return {score: (10)};
  } else if (availSpots.length === 0) {
    return {score: 0};
  }
  var moves = [];
  availSpots.forEach(spot => {
    var move = {};
    move.index = newBoard[spot];
    newBoard[spot] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[spot] = move.index;
    moves.push(move);
  })

  var bestMove;
  if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

  return moves[bestMove];
}

document.getElementById('Xchoice').addEventListener('click', function() {document.getElementById("Xchoice").classList.add("active");
document.getElementById("Ochoice").classList.remove("active");
  huPlayer = 'X';
  aiPlayer = 'O';
});

document.getElementById('Ochoice').addEventListener('click', function() {document.getElementById("Ochoice").classList.add("active");
document.getElementById("Xchoice").classList.remove("active");
  huPlayer = 'O';
  aiPlayer = 'X';
});
