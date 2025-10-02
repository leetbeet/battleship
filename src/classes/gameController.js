import { Player, Computer } from './player';

export class GameController {
  constructor(name, board1, board2) {
    this._board1 = board1;
    this._board2 = board2;
    this._player1 = new Player(name);
    this._player2 = new Computer();
    this._player1Turn = true;
  }

  createBoards() {
    for (let i = 0; i < 100; i++) {
      const cell1 = document.createElement('div');
      const cell2 = document.createElement('div');
      this._board1.appendChild(cell1);
      this._board2.appendChild(cell2);
    }
  }

  initBoards() {
    this._player1.gameboard.placeAllRandomly();
    this._player2.gameboard.placeAllRandomly();

    const cells1 = this._board1.children;
    const cells2 = this._board2.children;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const k = i + j * 10;

        cells2[k].addEventListener('click', () => {
          if (!this._player1Turn) return;

          this.playTurn(i, j);
          setTimeout(() => {
            this.playTurn();
          }, 300);
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

  playTurn(x = null, y = null) {
    if (this._player1Turn) {
      if (
        x === null ||
        this._player2.gameboard.board[x][y] === 'miss' ||
        this._player2.gameboard.board[x][y] === 'hit'
      )
        return;
      this._board2.classList.add('blur');
      this._player1.attack(this._player2, x, y);
      this.reRenderBoard(this._player2, this._board2);
      this._player1Turn = false;

      if (this._player2.gameboard.isAllSunk()) {
        setTimeout(() => {
          alert(`${this._player1.name} has won`);
        }, 0);
      }
    } else {
      this._board2.classList.remove('blur');
      this._player2.attack(this._player1);
      this.reRenderBoard(this._player1, this._board1);
      this._player1Turn = true;

      if (this._player1.gameboard.isAllSunk()) {
        setTimeout(() => {
          alert(`${this._player2.name} has won`);
        }, 0);
      }
    }
  }
}
