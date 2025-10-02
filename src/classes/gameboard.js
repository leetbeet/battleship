import { Ship } from './ship';

export class Gameboard {
  constructor() {
    this._board = Array(10)
      .fill()
      .map(() => Array(10).fill('empty'));
    this._ships = {
      carrier: [5, new Ship(5)],
      battleship: [4, new Ship(4)],
      destroyer: [3, new Ship(3)],
      submarine: [3, new Ship(3)],
      patrolBoat: [2, new Ship(2)],
    };
  }

  get board() {
    return this._board;
  }

  placeHorizontally(ship, x, y) {
    const length = this._ships[ship][0];
    if (x + length > 10) throw new Error('Ship is out of bounds.');
    for (let i = 0; i < length; i++) {
      if (this.board[x + i][y] !== 'empty') throw new Error('Cell occupied');
    }

    for (let i = 0; i < length; i++) {
      this._board[x + i][y] = ship;
    }
  }

  placeVertically(ship, x, y) {
    const length = this._ships[ship][0];
    if (y + length > 10) throw new Error('Ship is out of bounds.');
    for (let i = 0; i < length; i++) {
      if (this.board[x][y + i] !== 'empty') throw new Error('Cell occupied');
    }

    for (let i = 0; i < length; i++) {
      this._board[x][y + i] = ship;
    }
  }

  placeAllRandomly() {
    for (const name of Object.keys(this._ships)) {
      const MaxRetries = 500;
      let retries = 0;
      let x, y;
      while (retries < MaxRetries) {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);

        try {
          if (Math.random() > 0.5) {
            this.placeHorizontally(name, x, y);
          } else {
            this.placeVertically(name, x, y);
          }
          break;
        } catch {
          retries++;
        }
      }
    }
  }

  receiveAttack(x, y) {
    if (x > 9 || y > 9) throw new Error('Attack is out of bounds.');
    if (this._board[x][y] === 'empty') {
      this._board[x][y] = 'miss';
    } else if (this._board[x][y] !== 'hit' && this._board[x][y] !== 'miss') {
      this._ships[this._board[x][y]][1].hit();
      this._board[x][y] = 'hit';
    }
  }

  isAllSunk() {
    for (const shipArr of Object.values(this._ships)) {
      if (!shipArr[1].isSunk()) return false;
    }
    return true;
  }
}
