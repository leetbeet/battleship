import { Player, Computer } from '../classes/player';

test('receiveAttack called when attack is called', () => {
  const player = new Player('Alice');
  const opponent = new Player('Bob');
  const spy = jest.spyOn(opponent._gameboard, 'receiveAttack');

  player.attack(opponent, 1, 1);

  expect(spy).toHaveBeenCalled();
});

test('receiveAttack called when attack is called for computer player', () => {
  const computer = new Computer();
  const opponent = new Player('Alice');
  const spy = jest.spyOn(opponent._gameboard, 'receiveAttack');

  computer.attack(opponent);

  expect(spy).toHaveBeenCalled();
});

test('receiveAttack called when only one empty left (rest miss)', () => {
  const computer = new Computer();
  const opponent = new Player('Alice');

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      opponent.gameboard.board[x][y] = 'miss';
    }
  }
  opponent.gameboard.board[0][0] = 'empty';

  const spy = jest.spyOn(opponent.gameboard, 'receiveAttack');

  computer.attack(opponent);

  expect(spy).toHaveBeenCalledWith(0, 0);
});

test('receiveAttack called when only one empty left (rest hit)', () => {
  const computer = new Computer();
  const opponent = new Player('Alice');

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      opponent.gameboard.board[x][y] = 'hit';
    }
  }
  opponent.gameboard.board[1][1] = 'empty';

  const spy = jest.spyOn(opponent.gameboard, 'receiveAttack');

  computer.attack(opponent);

  expect(spy).toHaveBeenCalledWith(1, 1);
});
