import './style.css';
import { GameController } from './classes/gameController';

window.addEventListener('DOMContentLoaded', () => {
  const dialog = document.getElementById('choose-mode');
  dialog.showModal();

  document.getElementById('computer-btn').addEventListener('click', () => {
    dialog.close();
    dialog.style.display = 'none';

    const dialogNameInput = document.getElementById('input-player1-only');
    dialogNameInput.showModal();
    const form = document.getElementById('input-player1-only-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.querySelector('#name').value;
      const game = new GameController(
        document.querySelector('.board1'),
        document.querySelector('.board2'),
        name
      );
      dialogNameInput.close();
      game.createBoards();
      game.initBoards();
      document.querySelector('.board1').style.border = '1px solid black';
      document.querySelector('.board2').style.border = '1px solid black';
    });
  });

  document.getElementById('2-player-btn').addEventListener('click', () => {
    dialog.close();
    dialog.style.display = 'none';

    const dialogNameInput = document.getElementById('input-players');
    dialogNameInput.showModal();
    const form = document.getElementById('input-players-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name1 = document.querySelector('#name1').value;
      const name2 = document.querySelector('#name2').value;
      const game = new GameController(
        document.querySelector('.board1'),
        document.querySelector('.board2'),
        name1,
        name2
      );
      dialogNameInput.close();
      game.createBoards();
      game.initBoards();
      document.querySelector('.board1').style.border = '1px solid black';
      document.querySelector('.board2').style.border = '1px solid black';
    });
  });
});
