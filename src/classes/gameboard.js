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
