import { Gameboard } from './gameboard';

export class Player {
  constructor(name) {
    this._name = name;
    this._gameboard = new Gameboard();
  }

  get name() {
    return this._name;
  }

  get gameboard() {
    return this._gameboard;
  }

  attack(opponent, x, y) {
    opponent.gameboard.receiveAttack(x, y);
  }
}

export class Computer extends Player {
  constructor() {
    super('Computer');
  }

  attack(opponent) {
    let x, y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (
      opponent.gameboard.board[x][y] === 'miss' ||
      opponent.gameboard.board[x][y] === 'hit'
    );
    opponent.gameboard.receiveAttack(x, y);
  }
}
