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
    this._mode = 'hunt';
    this._shipAttacked = null;
    this._hitX = null;
    this._hitY = null;
    this._direction = null;
    this._huntLists = {};
    for (let mod = 2; mod <= 5; mod++) {
      const list = [];
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          if ((x + y) % mod === 0) list.push({ x, y });
        }
      }
      this._huntLists[mod] = list.sort(() => Math.random() - 0.5);
      this._huntLists[mod].index = 0;
    }
  }

  attack(opponent) {
    if (this._mode === 'hunt') {
      let mod;
      if (!opponent.gameboard._ships['carrier'][1].isSunk()) {
        mod = 5;
      } else if (!opponent.gameboard._ships['battleship'][1].isSunk()) {
        mod = 4;
      } else if (
        !opponent.gameboard._ships['destroyer'][1].isSunk() ||
        !opponent.gameboard._ships['submarine'][1].isSunk()
      ) {
        mod = 3;
      } else {
        mod = 2;
      }

      const huntList = this._huntLists[mod];

      let x, y;
      while (true) {
        if (huntList.index >= huntList.length) huntList.index = 0;
        const next = huntList[huntList.index++];
        x = next.x;
        y = next.y;

        if (
          opponent.gameboard.board[x][y] !== 'hit' &&
          opponent.gameboard.board[x][y] !== 'miss'
        )
          break;
      }

      if (opponent.gameboard.board[x][y] !== 'empty') {
        this._mode = 'target';
        this._shipAttacked =
          opponent.gameboard._ships[opponent.gameboard.board[x][y]][1];
        this._hitX = x;
        this._hitY = y;
        this._startX = this._hitX;
        this._startY = this._hitY;
        this._direction = null;
      }
      opponent.gameboard.receiveAttack(x, y);
    } else {
      if (this._direction === null) {
        const directions = [
          { x: -1, y: 0 },
          { x: 1, y: 0 },
          { x: 0, y: -1 },
          { x: 0, y: 1 },
        ];

        for (const d of directions) {
          const nx = this._startX + d.x;
          const ny = this._startY + d.y;

          if (nx < 0 || nx > 9 || ny < 0 || ny > 9) continue;

          const cell = opponent.gameboard.board[nx][ny];
          if (cell === 'hit' || cell === 'miss') continue;

          opponent.gameboard.receiveAttack(nx, ny);
          if (this._shipAttacked.isSunk()) this._mode = 'hunt';

          if (opponent.gameboard.board[nx][ny] === 'hit') {
            this._direction = d;
            this._hitX = nx;
            this._hitY = ny;
          }
          return;
        }
      } else {
        const fx = this._hitX + this._direction.x;
        const fy = this._hitY + this._direction.y;

        const forwardValid =
          fx >= 0 &&
          fx <= 9 &&
          fy >= 0 &&
          fy <= 9 &&
          opponent.gameboard.board[fx][fy] !== 'hit' &&
          opponent.gameboard.board[fx][fy] !== 'miss';

        if (forwardValid) {
          opponent.gameboard.receiveAttack(fx, fy);
          if (this._shipAttacked.isSunk()) this._mode = 'hunt';

          if (opponent.gameboard.board[fx][fy] === 'hit') {
            this._hitX = fx;
            this._hitY = fy;
          } else {
            // miss, reset to start so other directions can be tried later
            this._hitX = this._startX;
            this._hitY = this._startY;
            this._direction = null;
          }
          return;
        }

        // forward was invalid/blocked, try reverse immediately
        const rx = this._startX - this._direction.x;
        const ry = this._startY - this._direction.y;

        const reverseValid =
          rx >= 0 &&
          rx <= 9 &&
          ry >= 0 &&
          ry <= 9 &&
          opponent.gameboard.board[rx][ry] !== 'hit' &&
          opponent.gameboard.board[rx][ry] !== 'miss';

        if (reverseValid) {
          opponent.gameboard.receiveAttack(rx, ry);
          if (this._shipAttacked.isSunk()) this._mode = 'hunt';

          if (opponent.gameboard.board[rx][ry] === 'hit') {
            // flip direction so future continuation goes toward rx,ry, further reverse
            this._direction = { x: -this._direction.x, y: -this._direction.y };
            this._hitX = rx;
            this._hitY = ry;
          } else {
            this._hitX = this._startX;
            this._hitY = this._startY;
            this._direction = null;
          }
          return;
        }

        // neither forward nor reverse available, reset and try other directions later
        this._hitX = this._startX;
        this._hitY = this._startY;
        this._direction = null;
        return;
      }
    }
  }
}
