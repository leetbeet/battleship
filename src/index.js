import './style.css';
import { GameController } from './classes/gameController';

const game = new GameController(
  'leetbeet',
  document.querySelector('.board1'),
  document.querySelector('.board2')
);

game.createBoards();
game.initBoards();
