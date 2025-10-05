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

      // prepare Player 1 placement UI and start placement phase
      game.showShips(0);
      game.createBoardButtons(0);
      game.startPlacementPhase(0);

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

      // start player1 placement (player2 will be started after player1 finishes)
      game.showShips(0);
      game.createBoardButtons(0);
      game.startPlacementPhase(0);

      document.querySelector('.board1').style.border = '1px solid black';
      document.querySelector('.board2').style.border = '1px solid black';
    });
  });
});
