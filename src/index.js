import './style.css';

// create boards
(() => {
  const board1 = document.querySelector('.board1');
  const board2 = document.querySelector('.board2');

  for (let i = 0; i < 100; i++) {
    const cell1 = document.createElement('div');
    const cell2 = document.createElement('div');
    board1.appendChild(cell1);
    board2.appendChild(cell2);
  }
})();
