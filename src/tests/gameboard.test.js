import { Gameboard } from '../classes/gameboard';

test('hit method is called when receiveAttack hits a ship', () => {
  const game = new Gameboard();
  const spy = jest.spyOn(game._ships['battleship'][1], 'hit');

  game.placeHorizontally('battleship', 3, 4);
  game.receiveAttack(3, 4);

  expect(spy).toHaveBeenCalled();

  spy.mockRestore();
});

test('hit method is not called when receiveAttack misses', () => {
  const game = new Gameboard();
  const spy = jest.spyOn(game._ships['battleship'][1], 'hit');

  game.placeHorizontally('battleship', 3, 4);
  game.receiveAttack(7, 4);

  expect(spy).not.toHaveBeenCalled();

  spy.mockRestore();
});

test('hit method is called when receiveAttack hits a vertically placed ship', () => {
  const game = new Gameboard();
  const spy = jest.spyOn(game._ships['battleship'][1], 'hit');

  game.placeVertically('battleship', 3, 4);
  game.receiveAttack(3, 7);

  expect(spy).toHaveBeenCalled();

  spy.mockRestore();
});

test('isAllSunk returns true when every ship is sunk (attacks after all placements)', () => {
  const game = new Gameboard();

  game.placeHorizontally('carrier', 0, 0);
  game.placeHorizontally('battleship', 6, 0);
  game.placeHorizontally('destroyer', 0, 2);
  game.placeHorizontally('submarine', 4, 2);
  game.placeHorizontally('patrolBoat', 8, 2);

  for (let x = 0; x <= 4; x++) game.receiveAttack(x, 0);
  for (let x = 6; x <= 9; x++) game.receiveAttack(x, 0);
  for (let x = 0; x <= 2; x++) game.receiveAttack(x, 2);
  for (let x = 4; x <= 6; x++) game.receiveAttack(x, 2);
  for (let x = 8; x <= 9; x++) game.receiveAttack(x, 2);

  expect(game.isAllSunk()).toBe(true);
});
