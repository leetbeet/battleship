import { Gameboard } from '../classes/gameboard';

test('hit method is called when receiveAttack hits a ship', () => {
  const game = new Gameboard();
  const spy = jest.spyOn(game._battleship, 'hit');

  game.placeHorizontally('battleship', 3, 4);
  game.receiveAttack(3, 4);

  expect(spy).toHaveBeenCalled();

  spy.mockRestore();
});

test('hit method is not called when receiveAttack misses', () => {
  const game = new Gameboard();
  const spy = jest.spyOn(game._battleship, 'hit');

  game.placeHorizontally('battleship', 3, 4);
  game.receiveAttack(7, 4);

  expect(spy).not.toHaveBeenCalled();

  spy.mockRestore();
});

test('hit method is called when receiveAttack hits a vertically placed ship', () => {
  const game = new Gameboard();
  const spy = jest.spyOn(game._battleship, 'hit');

  game.placeVertically('battleship', 3, 4);
  game.receiveAttack(3, 7);

  expect(spy).toHaveBeenCalled();

  spy.mockRestore();
});

test('isAllSunk returns true when every ship is sunk', () => {
  const game = new Gameboard();

  game.placeHorizontally('carrier', 0, 0);
  game.receiveAttack(0, 0);
  game.receiveAttack(1, 0);
  game.receiveAttack(2, 0);
  game.receiveAttack(3, 0);
  game.receiveAttack(4, 0);

  game.placeHorizontally('battleship', 0, 1);
  game.receiveAttack(0, 1);
  game.receiveAttack(1, 1);
  game.receiveAttack(2, 1);
  game.receiveAttack(3, 1);

  game.placeHorizontally('destroyer', 0, 2);
  game.receiveAttack(0, 2);
  game.receiveAttack(1, 2);
  game.receiveAttack(2, 2);

  game.placeHorizontally('submarine', 0, 3);
  game.receiveAttack(0, 3);
  game.receiveAttack(1, 3);
  game.receiveAttack(2, 3);

  game.placeHorizontally('patrolBoat', 0, 4);
  game.receiveAttack(0, 4);
  expect(game.isAllSunk()).toBe(false);
  game.receiveAttack(1, 4);

  expect(game.isAllSunk()).toBe(true);
});
