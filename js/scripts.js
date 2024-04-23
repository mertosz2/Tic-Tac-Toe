var turn = "X";
var tablesize = 3;
var total_turns = 0;
var finished = false;
var isDraw = false;

var selections = new Array();
selections["X"] = new Array();
selections["O"] = new Array();

var result = new Array();

var scores = new Array();
scores["X"] = 0;
scores["O"] = 0;

function resetParams() {
  turn = "X";
  tablesize = 3;
  total_turns = 0;
  finished = false;
  selections["X"] = [];
  selections["O"] = [];
}

function changeTurn() {
  if (turn == "X") turn = "O";
  else turn = "X";
}

function winnerPatterns() {
  const wins = [];

  //horizontal
  for (let row = 1; row <= tablesize; row++) {
    const pat = [];
    for (let col = 1; col <= tablesize; col++) {
      pat.push(row * 10 + col);
    }
    wins.push(pat);
  }

  //vertical
  for (let col = 1; col <= tablesize; col++) {
    const pattern = [];
    for (let row = 1; row <= tablesize; row++) {
      pattern.push(row * 10 + col);
    }
    wins.push(pattern);
  }

  //
  const diagonal1 = [];
  const diagonal2 = [];
  for (let i = 1; i <= tablesize; i++) {
    diagonal1.push(i * 10 + i);
    diagonal2.push(i * 10 + (tablesize + 1 - i));
  }
  wins.push(diagonal1, diagonal2);

  return wins;
}

function isWinner(winPattern, selections) {
  return winPattern.every((cell) => selections.includes(cell));
}

function checkWinner() {
  const winPatterns = winnerPatterns();

  finished = winPatterns.some((winPattern) => {
    if (!finished) {
      const isWin = isWinner(winPattern, selections[turn]);
      if (isWin) {
        scoreUpdate(turn);
        disableAllBoxes();
        alert(`Player ${turn} Won !!`);
      }
      return isWin;
    }
    return false;
    
  });

  if (!finished && total_turns === tablesize * tablesize) {
    
    alert("Game Draw!");
    isDraw = true;
    finished = true;
    disableAllBoxes();
  }
}

// Verifying each selections with winning pattern
function isWinner(win_pattern, selections) {
  var match = 0;

  for (var x = 0; x < win_pattern.length; x++) {
    for (var y = 0; y < selections.length; y++) {
      if (win_pattern[x] == selections[y]) {
        match++;
      }
    }
  }

  if (match == win_pattern.length) return true;

  return false;
}

// Disable all boxes after winning/draw
function disableAllBoxes() {
  var elements = document.getElementsByClassName("grid-box");
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = true;
  }
}

function generateGame() {
  resetParams();
  isDraw = false
  tablesize = Number(document.getElementById("tablesize").value);
  if(tablesize < 3 ||tablesize > 9){
    alert("tablesize can not be greather than 9 or less than 3");
    return;
  }

  document.getElementById("game-board").innerHTML = "";

  for (var row = 1; row <= tablesize; row++) {
    for (var col = 1; col <= tablesize; col++) {
      var unique_name = "grid-" + row + "-" + col;
      var unique_id = row + "" + col;
      var button = document.createElement("input");

      button.setAttribute("value", " ");
      button.setAttribute("id", unique_id);
      button.setAttribute("name", unique_name);
      button.setAttribute("class", "grid-box");
      button.setAttribute("type", "button");
      button.setAttribute("onclick", "markCheck(this)");
      document.getElementById("game-board").appendChild(button);
    }

    var breakline = document.createElement("br");
    document.getElementById("game-board").appendChild(breakline);
  }
}

function markCheck(obj) {
  obj.value = turn;
  total_turns++;

  if (turn == "X") {
    obj.setAttribute("class", "green-player");
  } else {
    obj.setAttribute("class", "red-player");
  }

  obj.setAttribute("disabled", "disabled");
  selections[turn].push(Number(obj.id));

  checkWinner();
  changeTurn();

  if (finished) {
    if (isDraw){
      turn = "Draw";
    } else {
      turn = turn === "X" ? "O" : "X";
    }
    result.push({
      tablesize: tablesize,
      winner: turn,
      result: {
        X: selections["X"],
        O: selections["O"],
      },
    });

    displayResults();
  }
}

function displayResults() {
  var resultContainer = document.getElementById("game-result");
  resultContainer.innerHTML = "";

  result.forEach((res, index) => {
    let message;
    
    if (res.winner === "Draw") {
        message = `Game ${index + 1}: Draw with Table Size ${res.tablesize}`;
    } else {
        message = `Game ${index + 1}: Player ${res.winner} Won with Table Size ${res.tablesize}`;
    }
    var div = document.createElement("div");
    div.innerText = message;
    div.setAttribute("class", "result-row");
    div.setAttribute("data-index", index);

    var button = document.createElement("button");
    button.innerText = "View Details";
    button.addEventListener("click", function () {
      generateResultGameTable(res);
    });

    div.appendChild(button);

    resultContainer.appendChild(div);
  });
}

function generateResultGameTable(res) {
  resetParams();

  tablesize = res.tablesize;

  document.getElementById("game-board").innerHTML = "";

  for (var row = 1; row <= tablesize; row++) {
    for (var col = 1; col <= tablesize; col++) {
      var unique_name = "grid-" + row + "-" + col;
      var unique_id = row + "" + col;
      var button = document.createElement("input");

      button.setAttribute("value", " ");
      button.setAttribute("id", unique_id);
      button.setAttribute("name", unique_name);
      button.setAttribute("class", "grid-box");
      button.setAttribute("type", "button");

      if (res.result.X.includes(parseInt(unique_id))) {
        button.setAttribute("value", "X");
        button.classList.add("green-player");
      } else if (res.result.O.includes(parseInt(unique_id))) {
        button.setAttribute("value", "O");
        button.classList.add("red-player");
      } else {
        button.setAttribute("value", " ");
      }

      document.getElementById("game-board").appendChild(button);
    }

    var breakline = document.createElement("br");
    document.getElementById("game-board").appendChild(breakline);
  }
}

function scoreUpdate(turn) {
  scores[turn]++;
  document.getElementById("score-" + turn).innerHTML = scores[turn];
}
