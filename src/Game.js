import Enemy from "./Enemy.js";
import TileMap from "./TileMap.js";

const tileSize = 32;
const velocity = 2;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let tileMap = new TileMap(tileSize);

let pacman = tileMap.getPacman(velocity);
let enemies = tileMap.getEnemies(velocity);

let gameOver = false;
let gameWin = false;

const gameOverSound = new Audio("sounds/gameOver.wav");
const gameWinSound = new Audio("sounds/gameWin.wav");

function gameLoop() {
  tileMap.draw(ctx);
  drawGameEnd();
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkGameWin();
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
    if (gameWin) {
      gameWinSound.play();
    }
  }
}

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();
    }
  }
}

function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = "  You Win!";
    if (gameOver) {
      text = "Game Over!";
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 3.2, canvas.width, 80);

    ctx.font = "80px comic sans";
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "purple");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "purple");

    ctx.fillStyle = "white";
    ctx.fillText(text, 10, canvas.height / 2);
  }
}

// функция рестарта
function restartGame() {
  // очистка канваса
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // перезапуск карты
  tileMap = new TileMap(tileSize);
  
  // перезапуск пакмана и призраков
  pacman = tileMap.getPacman(velocity);
  enemies = tileMap.getEnemies(velocity);
  
  gameOver = false;
  gameWin = false;
}

// нажатие кнопки R или К = рестарт
window.addEventListener('keydown', (event) => {
  if (event.key === 'r' || event.key === 'R' || event.key === 'к' || event.key === 'К') {
    restartGame();
  }
});

tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75);