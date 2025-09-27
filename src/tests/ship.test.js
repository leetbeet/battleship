import { Ship } from '../classes/ship';

test('numOfHits incremented when hit is called', () => {
  const ship = new Ship(2);

  expect(ship.sunk).toBe(false);
  ship.isSunk();
  expect(ship.sunk).toBe(false);
  ship.hit();
  ship.isSunk();
  expect(ship.sunk).toBe(false);
  ship.hit();
  ship.isSunk();
  expect(ship.sunk).toBe(true);
});
