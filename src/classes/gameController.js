import { Player, Computer } from './player';

export class GameController {
  constructor(board1, board2, name1, name2 = null) {
    this._board1 = board1;
    this._board2 = board2;
    this._player1 = new Player(name1);
    if (name2 === null) {
      this._player2 = new Computer();
      this._isComputer = true;
    } else {
      this._player2 = new Player(name2);
      this._isComputer = false;
    }
    this._player1Turn = true;
  }

  createBoards() {
    for (let i = 0; i < 100; i++) {
      const cell1 = document.createElement('div');
      const cell2 = document.createElement('div');
      this._board1.appendChild(cell1);
      this._board2.appendChild(cell2);
    }

    document.querySelector('.output-msg').textContent =
      `${this._player1._name}'s turn`;

    document.querySelector('.board1-caption').textContent =
      `${this._player1._name}'s board`;
    document.querySelector('.board2-caption').textContent =
      `${this._player2._name}'s board`;
  }

  initBoards() {
    this.showShips(1);
    this.showShips(0);

    const cells1 = this._board1.children;
    const cells2 = this._board2.children;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const k = i + j * 10;

        cells2[k].addEventListener('click', () => {
          if (!this._player1Turn) return;

          this.playTurn(i, j);
          if (this._isComputer) {
            setTimeout(() => {
              this.playTurn();
            }, 300);
          }
        });
      }
    }

    if (!this._isComputer) {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const k = i + j * 10;

          cells1[k].addEventListener('click', () => {
            if (this._player1Turn) return;

            this.playTurn(i, j);
          });
        }
      }
    }
    this.reRenderBoard(this._player1, this._board1, false);
    this.reRenderBoard(this._player2, this._board2, true);
  }

  reRenderBoard(player, board, isOpponent) {
    const cells = board.children;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const k = i + j * 10;
        switch (player.gameboard.board[i][j]) {
          case 'miss':
            cells[k].className = 'miss';
            break;
          case 'carrier':
          case 'battleship':
          case 'submarine':
          case 'destroyer':
          case 'patrolBoat':
            if (!isOpponent) {
              cells[k].className = 'ship';
            } else {
              cells[k].className = '';
            }
            break;
          case 'hit':
            cells[k].className = 'hit';
            break;
        }
      }
    }
  }

  playTurn(x = null, y = null) {
    const outputMsg = document.querySelector('.output-msg');

    if (this._player1Turn) {
      if (!this.canPlayTurn(x, y, this._player1, this._player2)) return;

      this._player1.attack(this._player2, x, y);
      this._player1Turn = false;

      this.reRenderBoard(
        this._player1,
        this._board1,
        this._isComputer ? false : true
      );
      this.reRenderBoard(this._player2, this._board2, true);

      setTimeout(() => {
        if (this._player2.gameboard.isAllSunk()) {
          outputMsg.textContent = `${this._player1._name} has won!`;
          return;
        }

        if (this._isComputer) {
          this._board2.classList.add('blur');
          // computer: always show p1’s board, hide p2’s
          outputMsg.textContent = `${this._player2._name}'s turn`;
          setTimeout(() => this.playTurn(), 500);
        } else {
          // human: hide both for switch
          this.reRenderBoard(this._player1, this._board1, true);
          this.reRenderBoard(this._player2, this._board2, true);
          outputMsg.textContent = 'Switch to other player';

          setTimeout(() => {
            this.reRenderBoard(this._player1, this._board1, true);
            this.reRenderBoard(this._player2, this._board2, false);
            outputMsg.textContent = `${this._player2._name}'s turn`;
          }, 3000);
        }
      }, 0);
    } else {
      if (this._player2.gameboard.isAllSunk()) return;

      if (this._isComputer) {
        this._board2.classList.remove('blur');
        this._player2.attack(this._player1);
      } else {
        if (!this.canPlayTurn(x, y, this._player2, this._player1)) return;
        this._player2.attack(this._player1, x, y);
      }
      this._player1Turn = true;

      this.reRenderBoard(
        this._player1,
        this._board1,
        this._isComputer ? false : true
      );
      this.reRenderBoard(this._player2, this._board2, true);

      setTimeout(() => {
        if (this._player1.gameboard.isAllSunk()) {
          outputMsg.textContent = `${this._player2._name} has won!`;
          return;
        }

        if (this._isComputer) {
          outputMsg.textContent = `${this._player1._name}'s turn`;
        } else {
          this.reRenderBoard(this._player1, this._board1, true);
          this.reRenderBoard(this._player2, this._board2, true);
          outputMsg.textContent = 'Switch to other player';

          setTimeout(() => {
            this.reRenderBoard(this._player1, this._board1, false);
            this.reRenderBoard(this._player2, this._board2, true);
            outputMsg.textContent = `${this._player1._name}'s turn`;
          }, 3000);
        }
      }, 0);
    }
  }

  canPlayTurn(x, y, currentPlayer, opponent) {
    if (x === null) return false;
    if (currentPlayer.gameboard.isAllSunk()) return false;

    const cell = opponent.gameboard.board[x][y];
    return cell !== 'miss' && cell !== 'hit';
  }

  showShips(boardNum) {
    const shipContainer = document.querySelectorAll('.ship-container');

    const makeShip = (length) => {
      const ship = document.createElement('div');
      ship.classList.add('whole-ship');
      for (let i = 0; i < length; i++) {
        const cell = document.createElement('div');
        cell.classList.add('ship-cell');
        ship.append(cell);
      }
      return ship;
    };

    const carrier = makeShip(5);
    const battleship = makeShip(4);
    const submarine = makeShip(3);
    const destroyer = makeShip(3);
    const patrolBoat = makeShip(2);

    shipContainer[boardNum].append(
      carrier,
      battleship,
      submarine,
      destroyer,
      patrolBoat
    );
  }
}
