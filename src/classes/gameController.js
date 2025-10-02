import { Player, Computer } from './player';

export class GameController {
  constructor(name, board1, board2) {
    this._board1 = document.querySelector(board1);
    this._board2 = document.querySelector(board2);
    this._player1 = new Player(name);
    this._player2 = new Computer();

    this._createBoards();
    this._initBoards();
  }

  _createBoards() {
    for (let i = 0; i < 100; i++) {
      const cell1 = document.createElement('div');
      const cell2 = document.createElement('div');
      this._board1.appendChild(cell1);
      this._board2.appendChild(cell2);
    }
  }

  _initBoards() {
    this._player1.gameboard.placeAllRandomly();
    this._player2.gameboard.placeAllRandomly();

    const cells1 = this._board1.children;
    const cells2 = this._board2.children;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const k = i + j * 10;

        cells2[k].addEventListener('click', () => {
          this._player1.attack(this._player2, i, j);
          this.reRenderBoard(this._player2, this._board2);
        });

        if (this._player1.gameboard.board[i][j] !== 'empty') {
          cells1[k].className = 'ship';
        }
      }
    }
  }

  reRenderBoard(player, board, isOpponent = true) {
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
            break;
        }
      }
    }
  }
}
