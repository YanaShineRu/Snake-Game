document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const gridSize = 20;
  const boardWidth = 600;
  const boardHeight = 600;
  const boardSize = Math.floor(boardWidth / gridSize) * Math.floor(boardHeight / gridSize);
  const initialSnakeLength = 1;
  let snake = [{ x: 0, y: 0 }];
  let food = { x: 0, y: 0 };
  let direction = "right";
  let points = 0;
  let gameLoop;
  let passOverBorder = true;

  const pointsCounter = document.createElement("div");
  pointsCounter.classList.add("points-counter");
  pointsCounter.innerText = "Points: 0";
  document.body.appendChild(pointsCounter);

  const eatSound = new Audio("eat.wav");
  const gameOverSound = new Audio("game-over.wav");
  const moveSound = new Audio("move.wav");

  function playEatSound() {
    eatSound.play();
  }

  function playGameOverSound() {
    gameOverSound.play();
  }
  
  function playMoveSound() {
    moveSound.pause();
    moveSound.currentTime = 0;
    moveSound.play();
  }

  function createSnake() {
    snake.forEach((part, index) => {
      const snakePart = document.createElement("div");
      snakePart.classList.add("snake-part");
      snakePart.style.left = part.x * gridSize + "px";
      snakePart.style.top = part.y * gridSize + "px";
      if (index === 0) {
        snakePart.classList.add("snake-head");
      }
      gameBoard.appendChild(snakePart);
    });
  }

  function createFood() {
    const foodElement = document.createElement("div");
    foodElement.classList.add("food");
    foodElement.style.left = food.x * gridSize + "px";
    foodElement.style.top = food.y * gridSize + "px";
    gameBoard.appendChild(foodElement);
  }

  function updateSnake() {
    const snakeParts = document.querySelectorAll(".snake-part");

    snakeParts.forEach((part, index) => {
      part.style.left = snake[index].x * gridSize + "px";
      part.style.top = snake[index].y * gridSize + "px";
    });
  }

  function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }

    if (passOverBorder) {
      if (head.x < 0) head.x = Math.floor(boardWidth / gridSize) - 1;
      if (head.x >= Math.floor(boardWidth / gridSize)) head.x = 0;
      if (head.y < 0) head.y = Math.floor(boardHeight / gridSize) - 1;
      if (head.y >= Math.floor(boardHeight / gridSize)) head.y = 0;
    } else {
      if (
        head.x < 0 ||
        head.x >= Math.floor(boardWidth / gridSize) ||
        head.y < 0 ||
        head.y >= Math.floor(boardHeight / gridSize)
      ) {
        clearInterval(gameLoop);
        playGameOverSound();
        showGameOverMessage();
        return;
      }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      food = getRandomPosition();
      createFood();
      points++;
      pointsCounter.innerText = "Points: " + points;
      playEatSound();
    } else {
      snake.pop();
    }

    if (checkCollision()) {
      clearInterval(gameLoop);
      playGameOverSound();
      showGameOverMessage();
      return;
    }

    gameBoard.innerHTML = "";

    createSnake();

    createFood();

    updateSnake();

    playMoveSound();
  }

  function checkCollision() {
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
        return true;
      }
    }
    return false;
  }

  function getRandomPosition() {
    return {
      x: Math.floor(Math.random() * (boardWidth / gridSize)),
      y: Math.floor(Math.random() * (boardHeight / gridSize)),
    };
  }

  function changeDirection(event) {
    const keyPressed = event.keyCode;
    const isArrowKey =
      keyPressed === 37 || keyPressed === 38 || keyPressed === 39 || keyPressed === 40;

    if (isArrowKey) {
      event.preventDefault();
    }
    switch (keyPressed) {
      case 37:
        if (direction !== "right") {
          direction = "left";
        }
        break;
      case 38:
        if (direction !== "down") {
          direction = "up";
        }
        break;
      case 39:
        if (direction !== "left") {
          direction = "right";
        }
        break;
      case 40:
        if (direction !== "up") {
          direction = "down";
        }
        break;
    }
  }

  function startGame() {
    createSnake();
    food = getRandomPosition();
    createFood();

    document.addEventListener("keydown", changeDirection);
    gameLoop = setInterval(moveSnake, 150);
  }

  function showGameOverMessage() {
    const gameOverMessage = document.createElement("div");
    gameOverMessage.classList.add("game-over-message");
    gameOverMessage.innerText = "GAME OVER";
    gameBoard.appendChild(gameOverMessage);
  }

  startGame();
});