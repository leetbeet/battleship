import './style.css';
import { Player, Computer } from './classes/player';

// create boards
(() => {
  const board1 = document.querySelector('.board1');
  const board2 = document.querySelector('.board2');

  for (let i = 0; i < 100; i++) {
    const cell1 = document.createElement('div');
    const cell2 = document.createElement('div');
    board1.appendChild(cell1);
    board2.appendChild(cell2);
  }
})();

const initBoards = (name) => {
  const board1 = document.querySelector('.board1');
  const board2 = document.querySelector('.board2');
  const player1 = new Player(name);
  const player2 = new Computer();
  player1.gameboard.placeAllRandomly();
  player2.gameboard.placeAllRandomly();

  const cells1 = board1.children;
  const cells2 = board2.children;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const k = i + j * 10;
      cells2[k].addEventListener('click', () => {
        player1.attack(player2, i, j);
        reRenderBoard(player2, board2);
      });

      if (player1.gameboard.board[i][j] !== 'empty')
        cells1[k].className = 'ship';
    }
  }
};

const reRenderBoard = (player, board, isOpponent = true) => {
  const cells = board.children;

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const k = i + j * 10;
      switch (player.gameboard.board[i][j]) {
        case 'miss':
          cells[k].className = 'miss';
          break;
        case 'ship':
          if (!isOpponent) cells[k].className = 'ship';
          break;
        case 'hit':
          cells[k].className = 'hit';
      }
    }
  }
};

initBoards('leetbeet');
