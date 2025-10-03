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

    // check the cells and their neighbors
    for (let i = 0; i < length; i++) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = x + i + dx;
          const ny = y + dy;

          if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
            if (this._board[nx][ny] !== 'empty') {
              throw new Error('Cell or neighbor occupied');
            }
          }
        }
      }
    }

    for (let i = 0; i < length; i++) {
      this._board[x + i][y] = ship;
    }
  }

  placeVertically(ship, x, y) {
    const length = this._ships[ship][0];
    if (y + length > 10) throw new Error('Ship is out of bounds.');

    // check the cells and their neighbors
    for (let i = 0; i < length; i++) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = x + dx;
          const ny = y + i + dy;

          if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
            if (this._board[nx][ny] !== 'empty') {
              throw new Error('Cell or neighbor occupied');
            }
          }
        }
      }
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
      const ship = this._ships[this.board[x][y]][1];
      this._board[x][y] = 'hit';
      if (ship.isSunk()) {
        let nextX, nextY;
        let prevX = x;
        let prevY = y;
        let foundNext = false;

        // adjacent and diagonal cells
        const directions = [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ];

        while (!foundNext) {
          foundNext = true;

          for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx < 0 || nx > 9 || ny < 0 || ny > 9) continue; // skip invalid

            if (this.board[nx][ny] === 'empty') {
              this.board[nx][ny] = 'miss';
            }

            if (
              this.board[nx][ny] === 'hit' &&
              (nx !== prevX || ny !== prevY)
            ) {
              foundNext = false;
              nextX = nx;
              nextY = ny;
            }
          }

          prevX = x;
          prevY = y;
          x = nextX;
          y = nextY;
        }
      }
    }
  }

  isAllSunk() {
    for (const shipArr of Object.values(this._ships)) {
      if (!shipArr[1].isSunk()) return false;
    }
    return true;
  }
}
