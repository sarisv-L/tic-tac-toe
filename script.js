// Gameboard module
const Gameboard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => [...board]; // return a copy to protect original

  const setCell = (index, marker) => {
    if (board[index] === '') {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', ''];
  };

  return { getBoard, setCell, resetBoard };
})();

// Player factory
const Player = (name, marker) => {
  return { name, marker };
};

// Game controller module
const GameController = (() => {
  let player1;
  let player2;
  let activePlayer;
  let gameOver = false;

  // helper functions inside controller
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (board, marker) => {
    return winningCombos.some((combo) =>
      combo.every((index) => board[index] === marker)
    );
  };

  const checkTie = (board) => {
    return board.every((cell) => cell !== '');
  };

  const switchPlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const getActivePlayer = () => activePlayer;

  const playRound = (index) => {
    if (!activePlayer || gameOver) return; // stop if no active player yet

    if (Gameboard.setCell(index, activePlayer.marker)) {
      const board = Gameboard.getBoard();

      if (checkWinner(board, activePlayer.marker)) {
        DisplayController.setStatus(`${activePlayer.name} wins!`);
        gameOver = true;
        return;
      }
      if (checkTie(board)) {
        DisplayController.setStatus("It's a tie!");
        gameOver = true;
        return;
      }
      switchPlayer();
      DisplayController.setStatus(`${activePlayer.name}'s turn`);
    } else {
      DisplayController.setStatus('Cell already taken, try again.');
    }
  };

  const startGame = (name1, name2) => {
    player1 = Player(name1 || 'Player 1', 'X');
    player2 = Player(name2 || 'Player 2', 'O');
    activePlayer = player1;
    gameOver = false;
    Gameboard.resetBoard();
    DisplayController.setStatus(`${activePlayer.name}'s turn`);
    DisplayController.render();
  };

  return { getActivePlayer, playRound, startGame };
})();

const DisplayController = (() => {
  const boardContainer = document.getElementById('gameboard');
  const statusDiv = document.getElementById('status');
  const startBtn = document.getElementById('startBtn');
  const input1 = document.getElementById('player1');
  const input2 = document.getElementById('player2');

  const setStatus = (message) => {
    statusDiv.textContent = message;
  };

  const render = () => {
    boardContainer.innerHTML = '';
    const board = Gameboard.getBoard();
    // Create 9 Divs for the grid
    board.forEach((cell, index) => {
      const cellDiv = document.createElement('div');
      cellDiv.textContent = cell;
      cellDiv.addEventListener('click', () => {
        GameController.playRound(index);
        render();
      });
      boardContainer.appendChild(cellDiv);
    });
  };

  startBtn.addEventListener('click', () => {
    GameController.startGame(input1.value, input2.value);
    render();
  });

  return { render, setStatus };
})();
