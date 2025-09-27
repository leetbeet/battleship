export class Ship {
  constructor(length) {
    this._length = length;
    this._numOfHits = 0;
  }

  get sunk() {
    return this._sunk;
  }

  hit() {
    this._numOfHits++;
  }

  isSunk() {
    if (this._numOfHits === this._length) return true;
    return false;
  }
}
