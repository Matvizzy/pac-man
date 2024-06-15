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

const volumeControl = document.getElementById("volumeControl");

// Функция для установки громкости для всех звуковых элементов
function setVolume(volume) {
    // Убедимся, что громкость находится в диапазоне от 0 до 1
    const adjustedVolume = volume / 100;
    pacman.wakaSound.volume = adjustedVolume;
    pacman.powerDotSound.volume = adjustedVolume;
    pacman.eatGhostSound.volume = adjustedVolume;
    gameOverSound.volume = adjustedVolume;
    gameWinSound.volume = adjustedVolume;
}

// Инициализация управления громкостью
setVolume(volumeControl.value);

// Обработчик события для управления громкостью
volumeControl.addEventListener("input", () => {
    setVolume(volumeControl.value);
});

// Функция для сохранения настроек громкости
function saveVolumeSetting(volume) {
  localStorage.setItem("pacman_volume", volume);
}

// Функция для загрузки настроек громкости
function loadVolumeSetting() {
  const savedVolume = localStorage.getItem("pacman_volume");
  return savedVolume !== null ? parseInt(savedVolume, 10) : 100; // По умолчанию 100, если значение не найдено
}



//Функция gameLoop выполняет основные действия игры:
//Рисует карту тайлов.Рисует сообщение о конце игры (если игра окончена).Рисует Pac-Man и врагов.
//Проверяет состояние игры (победа или проигрыш).
function gameLoop() {
  tileMap.draw(ctx);
  drawGameEnd();
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkGameWin();
}
//роверяет, выиграл ли игрок, вызывая метод didWin у tileMap. Если победа достигнута, воспроизводится звук победы.
function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
    if (gameWin) {
      gameWinSound.play();
    }
  }
}
//проверяет, проиграл ли игрок, вызывая функцию isGameOver. Если проигрыш произошел, воспроизводится звук проигрыша.
function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();
    }
  }
}
//проверяет, столкнулся ли Pac-Man с врагом, когда он не находится под действием Power Dot. Если столкновение произошло, возвращается true.
function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}
//Игра на паузе, если Pac-Man еще не начал двигаться, или игра окончена (победа или поражение
function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}
//отображает сообщение о конце игры. Если игра закончилась (победа или поражение),
// рисуется черный прямоугольник и текст ("You Win!" или "Game Over!").
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

// Функция перезапуска игры
function restartGame() {
  // Очистка канваса
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Перезапуск карты, Пакмана и врагов
  tileMap = new TileMap(tileSize);
  pacman = tileMap.getPacman(velocity);
  enemies = tileMap.getEnemies(velocity);

  // Сброс переменных состояния игры
  gameOver = false;
  gameWin = false;

  // Восстановление настроек громкости
  const savedVolume = loadVolumeSetting();
  volumeControl.value = savedVolume;
  setVolume(savedVolume);
}

// Обработчик события изменения громкости
volumeControl.addEventListener("input", () => {
  const volume = volumeControl.value;
  setVolume(volume);
  saveVolumeSetting(volume);
});

// Начальная настройка: загрузка настроек громкости
window.addEventListener("load", () => {
  const savedVolume = loadVolumeSetting();
  volumeControl.value = savedVolume;
  setVolume(savedVolume);
});

// нажатие кнопки R или К = рестарт
window.addEventListener('keydown', (event) => {
  if (event.key === 'r' || event.key === 'R' || event.key === 'к' || event.key === 'К') {
    restartGame();
  }
});
//инициализация игры, размер канваса,запуск игрового цикла 75 раз в сек.
tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75);