import { Player, Computer } from './player';

export class GameController {
  constructor(board1, board2, name1, name2 = null) {
    this._board1 = board1;
    this._board2 = board2;
    this._player1 = new Player(name1);
    if (name2 === null) {
      this._player2 = new Computer();
      this._isComputer = true;
    } else {
      this._player2 = new Player(name2);
      this._isComputer = false;
    }
    this._player1Turn = true;

    this._placementHandlers = {}; // store handlers to remove later per board
    this._dragState = null;
  }

  createBoards() {
    for (let i = 0; i < 100; i++) {
      const cell1 = document.createElement('div');
      const cell2 = document.createElement('div');

      cell1.dataset.index = i;
      cell2.dataset.index = i;

      cell1.classList.add('board-cell');
      cell2.classList.add('board-cell');

      this._board1.appendChild(cell1);
      this._board2.appendChild(cell2);
    }

    document.querySelector('.output-msg').textContent =
      `${this._player1._name}'s turn`;

    document.querySelector('.board1-caption').textContent =
      `${this._player1._name}'s board`;
    document.querySelector('.board2-caption').textContent =
      `${this._player2._name}'s board`;
  }

  initBoards() {
    const cells1 = this._board1.children;
    const cells2 = this._board2.children;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const k = i + j * 10;

        cells2[k].addEventListener('mouseenter', () => {
          if (this._player1Turn && cells2[k].classList.length === 0) {
            cells2[k].classList.add('highlight');
          }
        });

        cells2[k].addEventListener('mouseleave', () => {
          cells2[k].classList.remove('highlight');
        });

        cells2[k].addEventListener('click', () => {
          if (!this._player1Turn) return;

          this.playTurn(i, j);
          if (this._isComputer) {
            setTimeout(() => {
              this.playTurn();
            }, 300);
          }
        });
      }
    }

    if (!this._isComputer) {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const k = i + j * 10;

          cells1[k].addEventListener('mouseenter', () => {
            if (!this._player1Turn && cells2[k].classList.length === 0) {
              cells1[k].classList.add('highlight');
            }
          });

          cells1[k].addEventListener('mouseleave', () => {
            cells1[k].classList.remove('highlight');
          });

          cells1[k].addEventListener('click', () => {
            if (this._player1Turn) return;

            this.playTurn(i, j);
          });
        }
      }
    }
    this.reRenderBoard(this._player1, this._board1, false);
    this.reRenderBoard(this._player2, this._board2, true);
  }

  reRenderBoard(player, board, isOpponent) {
    const cells = board.children;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const k = i + j * 10;
        switch (player.gameboard.board[i][j]) {
          case 'miss':
            cells[k].className = 'miss';
            break;
          case 'carrier':
          case 'battleship':
          case 'submarine':
          case 'destroyer':
          case 'patrolBoat':
            if (!isOpponent) {
              cells[k].className = 'ship';
            } else {
              cells[k].className = '';
            }
            break;
          case 'hit':
            cells[k].className = 'hit';
            break;
          default:
            cells[k].className = '';
            break;
        }
      }
    }
  }

  playTurn(x = null, y = null) {
    const outputMsg = document.querySelector('.output-msg');

    if (this._player1Turn) {
      if (!this.canPlayTurn(x, y, this._player1, this._player2)) return;

      this._player1.attack(this._player2, x, y);
      this._player1Turn = false;

      this.reRenderBoard(
        this._player1,
        this._board1,
        this._isComputer ? false : true
      );
      this.reRenderBoard(this._player2, this._board2, true);

      setTimeout(() => {
        if (this._player2.gameboard.isAllSunk()) {
          outputMsg.textContent = `${this._player1._name} has won!`;
          this.showEndGameDialog();
          return;
        }

        if (this._isComputer) {
          this._board2.classList.add('blur');
          outputMsg.textContent = `${this._player2._name}'s turn`;
          setTimeout(() => this.playTurn(), 500);
        } else {
          this.reRenderBoard(this._player1, this._board1, true);
          this.reRenderBoard(this._player2, this._board2, true);
          outputMsg.textContent = 'Switch to other player';

          setTimeout(() => {
            this.reRenderBoard(this._player1, this._board1, true);
            this.reRenderBoard(this._player2, this._board2, false);
            outputMsg.textContent = `${this._player2._name}'s turn`;
          }, 2000);
        }
      }, 0);
    } else {
      if (this._player2.gameboard.isAllSunk()) return;

      if (this._isComputer) {
        this._board2.classList.remove('blur');
        this._player2.attack(this._player1);
      } else {
        if (!this.canPlayTurn(x, y, this._player2, this._player1)) return;
        this._player2.attack(this._player1, x, y);
      }
      this._player1Turn = true;

      this.reRenderBoard(
        this._player1,
        this._board1,
        this._isComputer ? false : true
      );
      this.reRenderBoard(this._player2, this._board2, true);

      setTimeout(() => {
        if (this._player1.gameboard.isAllSunk()) {
          outputMsg.textContent = `${this._player2._name} has won!`;
          this.showEndGameDialog();
          return;
        }

        if (this._isComputer) {
          outputMsg.textContent = `${this._player1._name}'s turn`;
        } else {
          this.reRenderBoard(this._player1, this._board1, true);
          this.reRenderBoard(this._player2, this._board2, true);
          outputMsg.textContent = 'Switch to other player';

          setTimeout(() => {
            this.reRenderBoard(this._player1, this._board1, false);
            this.reRenderBoard(this._player2, this._board2, true);
            outputMsg.textContent = `${this._player1._name}'s turn`;
          }, 2000);
        }
      }, 0);
    }
  }

  canPlayTurn(x, y, currentPlayer, opponent) {
    if (x === null) return false;
    if (currentPlayer.gameboard.isAllSunk()) return false;

    const cell = opponent.gameboard.board[x][y];
    return cell !== 'miss' && cell !== 'hit';
  }

  showShips(boardNum) {
    const shipContainer = document.querySelectorAll('.ship-container');

    const makeShip = (length, name) => {
      const ship = document.createElement('div');
      ship.classList.add('whole-ship');
      ship.dataset.shipName = name;
      ship.dataset.length = String(length);
      ship.draggable = true;

      for (let i = 0; i < length; i++) {
        const cell = document.createElement('div');
        cell.classList.add('ship-cell');
        ship.append(cell);
      }

      ship.addEventListener('pointerdown', (e) => {
        const cell = e.target.closest('.ship-cell');
        if (!cell) {
          ship.dataset.grabIndex = '0';
          return;
        }
        const index = Array.prototype.indexOf.call(ship.children, cell);
        ship.dataset.grabIndex = String(index);
      });

      return ship;
    };

    const carrier = makeShip(5, 'carrier');
    const battleship = makeShip(4, 'battleship');
    const submarine = makeShip(3, 'submarine');
    const destroyer = makeShip(3, 'destroyer');
    const patrolBoat = makeShip(2, 'patrolBoat');

    shipContainer[boardNum].append(
      carrier,
      battleship,
      submarine,
      destroyer,
      patrolBoat
    );
  }

  createBoardButtons(boardNum) {
    const boardBtns = document.querySelectorAll('.board-btns');
    const randomiseBtn = document.createElement('button');
    randomiseBtn.textContent = 'Randomise';
    const changeAxis = document.createElement('button');
    changeAxis.textContent = 'Change axis';

    randomiseBtn.addEventListener('click', () => {
      const player = boardNum === 0 ? this._player1 : this._player2;
      player.gameboard.board.forEach((row) =>
        row.forEach((_, j) => (row[j] = 'empty'))
      );
      player.gameboard.placeAllRandomly();
      const boardEl = boardNum === 0 ? this._board1 : this._board2;
      this.reRenderBoard(player, boardEl, false);

      // remove all ship DOM children (they're now placed)
      const sc = document.querySelectorAll('.ship-container')[boardNum];
      while (sc.firstChild) sc.removeChild(sc.firstChild);

      this.finishPlacementForBoard(boardNum);
    });

    changeAxis.addEventListener('click', () => {
      const shipContainer = document.querySelectorAll('.ship-container');
      const ships = shipContainer[boardNum];

      const computedShips = getComputedStyle(ships);
      const currentDir = computedShips.flexDirection;
      const currentJustify = computedShips.justifyContent;

      ships.style.flexDirection = currentDir === 'column' ? 'row' : 'column';
      ships.style.justifyContent =
        currentJustify === 'flex-start' ? 'center' : 'flex-start';

      [...ships.children].forEach((child) => {
        const currentChildDir = getComputedStyle(child).flexDirection;
        child.style.flexDirection =
          currentChildDir === 'column' ? 'row' : 'column';
      });
    });

    boardBtns[boardNum].append(randomiseBtn, changeAxis);
  }

  startPlacementPhase(boardNum) {
    const outputMsg = document.querySelector('.output-msg');
    const player = boardNum === 0 ? this._player1 : this._player2;
    outputMsg.textContent = `Place your ships, ${player._name}`;

    this.enableShipPlacement(boardNum);
  }

  enableShipPlacement(boardNum) {
    const handlers = {};
    this._placementHandlers[boardNum] = handlers;

    const shipContainer =
      document.querySelectorAll('.ship-container')[boardNum];
    const boardEl = boardNum === 0 ? this._board1 : this._board2;
    const cells = boardEl.children;

    handlers.onDragStart = (e) => {
      const shipEl = e.currentTarget;
      const shipName = shipEl.dataset.shipName;
      const length = parseInt(shipEl.dataset.length, 10);
      const grabbedIndex = parseInt(shipEl.dataset.grabIndex || '0', 10);
      this._dragState = { shipName, length, grabbedIndex, shipEl };
      shipEl.style.opacity = '0.6';
    };

    handlers.onDragEnd = () => {
      if (this._dragState && this._dragState.shipEl) {
        this._dragState.shipEl.style.opacity = '';
      }
      this._dragState = null;
      this.clearPlacementHighlights(boardEl);
    };

    const attachDragToShip = (shipEl) => {
      shipEl.setAttribute('draggable', 'true');
      shipEl.addEventListener('dragstart', handlers.onDragStart);
      shipEl.addEventListener('dragend', handlers.onDragEnd);
    };

    Array.from(shipContainer.children).forEach(attachDragToShip);

    handlers.onDragOver = (e) => {
      e.preventDefault(); // allow drop

      if (!this._dragState) return;
      const cell = e.currentTarget;
      const k = parseInt(cell.dataset.index, 10);
      const x = k % 10;
      const y = Math.floor(k / 10);

      const { length, grabbedIndex, shipEl } = this._dragState;
      const childDir = getComputedStyle(shipEl).flexDirection;
      const isHorizontal = childDir === 'row';

      const startX = isHorizontal ? x - grabbedIndex : x;
      const startY = isHorizontal ? y : y - grabbedIndex;

      const positions = [];
      let valid = true;
      const boardArray = (boardNum === 0 ? this._player1 : this._player2)
        .gameboard.board;

      for (let i = 0; i < length; i++) {
        const cx = isHorizontal ? startX + i : startX;
        const cy = isHorizontal ? startY : startY + i;

        if (cx < 0 || cx > 9 || cy < 0 || cy > 9) {
          valid = false;
          positions.push({ x: cx, y: cy });
          continue;
        }

        // check the cell and its neighbors
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
              if (boardArray[nx][ny] !== 'empty') {
                valid = false;
              }
            }
          }
        }

        positions.push({ x: cx, y: cy });
      }

      this.clearPlacementHighlights(boardEl);
      positions.forEach((pos) => {
        if (pos.x >= 0 && pos.x <= 9 && pos.y >= 0 && pos.y <= 9) {
          const idx = pos.x + pos.y * 10;
          cells[idx].classList.add(
            valid ? 'placement-valid' : 'placement-invalid'
          );
        }
      });
    };

    handlers.onDrop = (e) => {
      e.preventDefault();
      if (!this._dragState) return;
      const cell = e.currentTarget;
      const k = parseInt(cell.dataset.index, 10);
      const x = k % 10;
      const y = Math.floor(k / 10);

      const { shipName, grabbedIndex, shipEl } = this._dragState;
      const childDir = getComputedStyle(shipEl).flexDirection;
      const isHorizontal = childDir === 'row';

      const startX = isHorizontal ? x - grabbedIndex : x;
      const startY = isHorizontal ? y : y - grabbedIndex;

      const player = boardNum === 0 ? this._player1 : this._player2;

      try {
        if (isHorizontal) {
          player.gameboard.placeHorizontally(shipName, startX, startY);
        } else {
          player.gameboard.placeVertically(shipName, startX, startY);
        }
      } catch {
        this.clearPlacementHighlights(boardEl);
        cell.classList.add('placement-invalid');
        setTimeout(() => this.clearPlacementHighlights(boardEl), 350);
        return;
      }

      // success: remove ship DOM element
      if (shipEl && shipEl.parentElement)
        shipEl.parentElement.removeChild(shipEl);

      // re-render board so player sees placed ship
      const boardElToUpdate = boardNum === 0 ? this._board1 : this._board2;
      this.reRenderBoard(player, boardElToUpdate, false);

      this.clearPlacementHighlights(boardEl);
      this._dragState = null;

      const sc = document.querySelectorAll('.ship-container')[boardNum];
      if (!sc || sc.children.length === 0) {
        this.finishPlacementForBoard(boardNum);
      }
    };

    handlers.onDragLeave = () => {
      this.clearPlacementHighlights(boardEl);
    };

    Array.from(cells).forEach((cell) => {
      cell.addEventListener('dragover', handlers.onDragOver);
      cell.addEventListener('drop', handlers.onDrop);
      cell.addEventListener('dragleave', handlers.onDragLeave);
    });

    handlers.shipContainer = shipContainer;
    handlers.boardEl = boardEl;
    handlers.cells = cells;
  }

  clearPlacementHighlights(boardEl) {
    Array.from(boardEl.children).forEach((c) => {
      c.classList.remove('placement-valid', 'placement-invalid');
    });
  }

  disableShipPlacement(boardNum) {
    const handlers = this._placementHandlers[boardNum];
    if (!handlers) return;

    const sc = handlers.shipContainer;
    if (sc) {
      Array.from(sc.children).forEach((shipEl) => {
        shipEl.removeEventListener('dragstart', handlers.onDragStart);
        shipEl.removeEventListener('dragend', handlers.onDragEnd);
      });
    }

    if (handlers.cells) {
      Array.from(handlers.cells).forEach((cell) => {
        cell.removeEventListener('dragover', handlers.onDragOver);
        cell.removeEventListener('drop', handlers.onDrop);
        cell.removeEventListener('dragleave', handlers.onDragLeave);
      });
    }

    delete this._placementHandlers[boardNum];
  }

  finishPlacementForBoard(boardNum) {
    this.disableShipPlacement(boardNum);

    const boardBtns = document.querySelectorAll('.board-btns')[boardNum];
    while (boardBtns.firstChild) boardBtns.removeChild(boardBtns.firstChild);

    const outputMsg = document.querySelector('.output-msg');

    if (this._isComputer) {
      if (boardNum === 0) {
        this._player2.gameboard.placeAllRandomly();
        this.initBoards();
        this.reRenderBoard(this._player2, this._board2, true);
        outputMsg.textContent = `${this._player1._name}'s turn`;
      }
      return;
    }

    if (boardNum === 0) {
      outputMsg.textContent = 'Switch to other player';
      this.reRenderBoard(this._player1, this._board1, true);
      this.reRenderBoard(this._player2, this._board2, true);

      setTimeout(() => {
        this.showShips(1);
        this.createBoardButtons(1);
        this.startPlacementPhase(1);
      }, 1000);
    } else {
      outputMsg.textContent = 'Switch to other player';
      this.reRenderBoard(this._player2, this._board2, true);
      setTimeout(() => {
        this.initBoards();
        outputMsg.textContent = `${this._player1._name}'s turn`;
        this.reRenderBoard(this._player1, this._board1, false);
      }, 1000);
    }
  }

  showEndGameDialog() {
    const dialog = document.getElementById('endgame-dialog');
    dialog.showModal();

    const btn = document.getElementById('play-again-btn');
    btn.onclick = () => {
      dialog.close();
      window.location.reload();
    };
  }
}
