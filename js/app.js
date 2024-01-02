function init() {
  // ? DOM elements
  const grid = document.querySelector(".gameGrid");
  const currScore = document.querySelector("#currScoreSpan");
  const highScore = document.querySelector("#highScoreSpan");
  const resetBtn = document.querySelector("#resetBTN");
  const gameOverText = document.querySelector(".gameOver");
  const winnerText = document.querySelector(".winner");

  // ? Variables
  const WIDTH = 20;
  const HEIGHT = 20;
  const totalCells = WIDTH * HEIGHT;
  let cells = [];
  let direction = 1;
  let pacManInterval;
  let interval = 300;
  let score = parseInt(currScore.innerHTML);
  let isGameOver = false;

  const cellsArr = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1,
    1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0,
    0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1,
    1, 2, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 2, 1, 1, 1, 1, 0, 1,
    1, 5, 1, 3, 3, 3, 3, 1, 5, 1, 1, 0, 1, 1, 1, 6, 6, 1, 0, 1, 1, 5, 1, 3, 3,
    3, 3, 1, 5, 1, 1, 0, 1, 6, 6, 1, 1, 1, 0, 1, 1, 5, 1, 1, 1, 1, 1, 1, 5, 1,
    1, 0, 1, 1, 1, 5, 5, 5, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 5, 5, 5,
    1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 6, 6, 1, 0, 1,
    1, 0, 1, 0, 1, 1, 0, 4, 0, 1, 1, 0, 1, 6, 6, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 2, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1,
    1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];

  //   ? add characters start position
  const pacManStartPosition = 232;
  let pacManCurrPosition = pacManStartPosition;
  const blinkyStartPos = 148;
  let blinkyCurrPos = blinkyStartPos;
  const inkyStartPos = 149;
  let inkyCurrPos = inkyStartPos;
  const pinkyStartPos = 150;
  let pinkyCurrPos = pinkyStartPos;
  const clydeStartPos = 151;
  let clydeCurrPos = clydeStartPos;

  //   ? audio
  let eatFoodSound = new Audio("blip.wav");
  eatFoodSound.volume = 0.09;
  let gameLoopSound = new Audio("gameLoop.wav");
  gameLoopSound.volume = 0.03;
  let gameOverSound = new Audio("gameover.wav");
  let winnerSound = new Audio("winner.wav");

  // ? Functions
  function createGrid() {
    for (let i = 0; i < cellsArr.length; i++) {
      const cell = document.createElement("div");
      cell.style.height = `${100 / HEIGHT}%`;
      cell.style.width = `${100 / WIDTH}%`;
      grid.appendChild(cell);
      cells.push(cell);
      cell.dataset.index = i;
      //   cell.innerHTML = i;

      if (cellsArr[i] === 1) {
        cells[i].classList.add("wall");
      } else if (cellsArr[i] === 0) {
        cells[i].classList.add("dot");
      } else if (cellsArr[i] === 2) {
        cells[i].classList.add("pill");
      } else if (cellsArr[i] === 3) {
        cells[i].classList.add("ghostHouse");
      } else if (cellsArr[i] === 4) {
        cells[i].classList.add("pacHouse");
      }
    }
    addPacMan();
    ghosts.forEach((ghost) => {
      cells[ghost.ghostCurrPosition].classList.add(ghost.className);
      cells[ghost.ghostCurrPosition].classList.add("ghost");
      moveGhost(ghost);
    });
  }

  function addPacMan() {
    cells[pacManCurrPosition].classList.add("pacMan");
  }

  function removePacMan() {
    cells[pacManCurrPosition].classList.remove("pacMan");
  }

  function movePacMan() {
    clearInterval(pacManInterval);
    pacManInterval = setInterval(() => {
      if (
        !cells[pacManCurrPosition + direction].classList.contains("wall") &&
        !cells[pacManCurrPosition + direction].classList.contains("ghostHouse")
      ) {
        gameLoopSound.play();
        gameLoopSound.loop = true;
        removePacMan();
        pacManCurrPosition += direction;
        addPacMan();
        eatPacDot();
        eatPill();
      }
      gameOver();
    }, interval);
  }

  function handleMove(e) {
    const key = e.key;
    const up = "ArrowUp";
    const down = "ArrowDown";
    const right = "ArrowRight";
    const left = "ArrowLeft";

    if (
      key === right &&
      !cells[pacManCurrPosition + 1].classList.contains("wall")
    ) {
      direction = 1;
      movePacMan();
    } else if (
      key === left &&
      !cells[pacManCurrPosition - 1].classList.contains("wall")
    ) {
      direction = -1;
      movePacMan();
    } else if (
      key === up &&
      !cells[pacManCurrPosition - WIDTH].classList.contains("wall")
    ) {
      direction = -WIDTH;
      movePacMan();
    } else if (
      key === down &&
      !cells[pacManCurrPosition + WIDTH].classList.contains("wall") &&
      !cells[pacManCurrPosition + WIDTH].classList.contains("ghostHouse")
    ) {
      direction = WIDTH;
      movePacMan();
    } else if (key === right && pacManCurrPosition === 199) {
      removePacMan();
      pacManCurrPosition = 179;
    } else if (key === left && pacManCurrPosition === 180) {
      removePacMan();
      pacManCurrPosition = 200;
    }

    gameOver();
  }

  function removeFood(item) {
    cells[pacManCurrPosition].classList.remove(item);
  }

  function eatPacDot() {
    if (cells[pacManCurrPosition].classList.contains("dot")) {
      eatFoodSound.play();
      removeFood("dot");
      score += 100;
    }
    currScore.innerHTML = score;
    checkWin();
  }

  function eatPill() {
    if (cells[pacManCurrPosition].classList.contains("pill")) {
      eatFoodSound.play();
      removeFood("pill");
      score += 200;
      ghosts.forEach((ghost) => (ghost.isScared = true));
      setTimeout(unScareGhosts, 10000);
    }
    currScore.innerHTML = score;
    checkWin();
  }

  function unScareGhosts() {
    ghosts.forEach((ghost) => (ghost.isScared = false));
  }

  // ? classes
  class Ghost {
    constructor(className, ghostStartPosition, speed) {
      this.className = className;
      this.ghostStartPosition = ghostStartPosition;
      this.ghostCurrPosition = ghostStartPosition;
      this.speed = speed;
      this.isScared = false;
      this.timerId = NaN;
    }
  }

  let ghosts = [
    new Ghost("blinky", 148, 350),
    new Ghost("pinky", 149, 300),
    new Ghost("inky", 150, 400),
    new Ghost("clyde", 151, 500),
  ];

  function moveGhost(ghost) {
    const directions = [-1, +1, WIDTH, -WIDTH];
    clearInterval(ghost.timerId);
    ghost.timerId = setInterval(function () {
      let ghostDirection =
        directions[Math.floor(Math.random() * directions.length)];
      let nextCellIndex = ghost.ghostCurrPosition + ghostDirection;
      //   console.log(ghost.ghostCurrPosition, ghost.className)

      if (
        !cells[nextCellIndex].classList.contains("wall") &&
        !cells[nextCellIndex].classList.contains("ghost") &&
        !cells[nextCellIndex].classList.contains("pacHouse")
      ) {
        cells[ghost.ghostCurrPosition].classList.remove(
          ghost.className,
          "ghost"
        );
        cells[ghost.ghostCurrPosition].classList.remove(
          ghost.className,
          "scaredGhost"
        );
        ghost.ghostCurrPosition = nextCellIndex;
        cells[ghost.ghostCurrPosition].classList.add(ghost.className, "ghost");
      }

      if (ghost.isScared) {
        cells[ghost.ghostCurrPosition].classList.add("scaredGhost");
      }

      if (
        ghost.isScared &&
        cells[ghost.ghostCurrPosition].classList.contains("pacMan")
      ) {
        cells[ghost.ghostCurrPosition].classList.remove(
          ghost.className,
          "ghost",
          "scaredGhost"
        );
        ghost.ghostCurrPosition = ghost.ghostStartPosition;
        score += 300;
        cells[ghost.ghostCurrPosition].classList.add(ghost.className, "ghost");
      }

      if (cells[ghost.ghostCurrPosition] === cells[pacManCurrPosition]) {
        gameOver();
      }
    }, ghost.speed);
  }

  function gameOver() {
    if (
      cells[pacManCurrPosition].classList.contains("ghost") &&
      !cells[pacManCurrPosition].classList.contains("scaredGhost")
    ) {
      gameLoopSound.pause();
      gameOverSound.play();
      clearInterval(pacManInterval);
      isGameOver = true;
      document.removeEventListener("keydown", handleMove);
      ghosts.forEach((ghost) => clearInterval(ghost.timerId));
      gameOverText.classList.add("open");
    }
  }

  function resetGame() {
    isGameOver = false;
    gameOverText.classList.remove("open");
    winnerText.classList.remove("open");
    grid.innerHTML = "";
    currScore.innerHTML = "0";
    if (document.removeEventListener) {
      document.removeEventListener("keydown", handleMove);
    }
    init();
  }

  function checkWin() {
    const dots = document.querySelectorAll(".dot");
    const pills = document.querySelectorAll(".pill");
    if (dots.length === 0 && pills.length === 0) {
      gameLoopSound.pause();
      winnerSound.play();
      winnerText.classList.add("open");
      document.removeEventListener("keydown", handleMove);
      ghosts.forEach((ghost) => clearInterval(ghost.timerId));
    }
  }

  function randomColor() {
    const red = Math.floor(Math.random() * 255) + 50;
    const green = Math.floor(Math.random() * 255) + 50;
    const blue = Math.floor(Math.random() * 255) + 50;
    const opacity = 1;
    return (randomColor = `rgb(${red}, ${green}, ${blue}, ${opacity})`);
  }

  // ? Event Listeners
  document.addEventListener("keydown", handleMove);
  resetBtn.addEventListener("click", resetGame);

  // ? Invoke Functions
  createGrid();
}
window.addEventListener("DOMContentLoaded", init);
