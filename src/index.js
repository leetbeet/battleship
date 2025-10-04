import './style.css';
import { GameController } from './classes/gameController';

const game = new GameController(
  document.querySelector('.board1'),
  document.querySelector('.board2'),
  'leetbeet',
  'tdab'
);

game.createBoards();
game.initBoards();
