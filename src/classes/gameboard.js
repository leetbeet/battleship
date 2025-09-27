import { Ship } from './ship';

export class Gameboard {
  constructor() {
    this._board = Array(10)
      .fill()
      .map(() => Array(10).fill('empty'));
    this._carrier = new Ship(5);
    this._battleship = new Ship(4);
    this._destroyer = new Ship(3);
    this._submarine = new Ship(3);
    this._patrolBoat = new Ship(2);
    this._ships = {
      carrier: [5, this._carrier],
      battleship: [4, this._battleship],
      destroyer: [3, this._destroyer],
      submarine: [3, this._submarine],
      patrolBoat: [2, this._patrolBoat],
    };
  }

  placeHorizontally(ship, x, y) {
    const length = this._ships[ship][0];
    if (x + length > 10) throw new Error('Ship is out of bounds.');
    for (let i = x; i < x + length; i++) {
      this._board[i][y] = ship;
    }
  }

  placeVertically(ship, x, y) {
    const length = this._ships[ship][0];
    if (y + length > 10) throw new Error('Ship is out of bounds.');
    for (let i = y; i < y + length; i++) {
      this._board[x][i] = ship;
    }
  }

  receiveAttack(x, y) {
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
