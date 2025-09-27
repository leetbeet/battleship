import { Ship } from '../classes/ship';

test('numOfHits incremented when hit is called', () => {
  const ship = new Ship(2);

  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
