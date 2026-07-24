import {
  TILE, COLS, ROWS, CANVAS_WIDTH, CANVAS_HEIGHT,
  GOAL_ROW, MEDIAN_ROWS, START_ROW, ROAD_ROWS,
  STARTING_LIVES, getLevelConfig, pointsForLevel, HIGH_SCORE_KEY
} from './config.js';
import { Player } from './entities/Player.js';
import { Vehicle } from './entities/Vehicle.js';

const canvas = document.getElementById('game-canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const livesEl = document.getElementById('lives');
const highScoreEl = document.getElementById('high-score');

const levelBannerEl = document.getElementById('level-banner');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const finalHighScoreEl = document.getElementById('final-high-score');
const newHighScoreMsgEl = document.getElementById('new-high-score-msg');
const tryAgainButton = document.getElementById('try-again-btn');

const player = new Player();

let highScore = Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;

const state = {
  level: 1,
  lives: STARTING_LIVES,
  score: 0,
  lanes: [],
  running: true,
  frozen: false
};


function buildLanes(level) {
  const { types, speedMultiplier, vehicleMultiplier} = getLevelConfig(level);
  const totalWidth = COLS * TILE;
  const lanes = [];

  ROAD_ROWS.forEach((row, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    const type = types[Math.floor(Math.random() * types.length)];

    const minGap = 340;
    const gap = Math.max(130, minGap / vehicleMultiplier);

    const count = Math.ceil(totalWidth / gap) + 2;
    const vehicles = [];
    for (let i = 0; i < count; i++) {
      const xStart = i * gap - gap + Math.random() * 20;
      vehicles.push(new Vehicle(type, row, direction, speedMultiplier, xStart));
    }

    lanes.push({ row, vehicles });
  });

  return lanes;
}

state.lanes = buildLanes(state.level);

function rectsOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function checkCollisions() {
  const playerBounds = player.getBounds();
  for (const lane of state.lanes) {
    if (lane.row !== player.row) continue;
    for (const v of lane.vehicles) {
      if (rectsOverlap(playerBounds, v.getBounds())) {
        loseLife();
        return;
      }
    }
  }
}


function updateHUD() {
  scoreEl.textContent = state.score;
  levelEl.textContent = state.level;
  livesEl.textContent = '❤️'.repeat(Math.max(state.lives, 0));
  highScoreEl.textContent = highScore;
}

let bannerTimeout = null;
function showBanner(text) {
  levelBannerEl.textContent = text;
  levelBannerEl.classList.remove('hidden');
  clearTimeout(bannerTimeout);
  bannerTimeout = setTimeout(() => levelBannerEl.classList.add('hidden'), 1100);
}


function loseLife() {
  if (state.frozen) return;
  state.lives--;
  updateHUD();

  if (state.lives <= 0) {
    gameOver();
    return;
  }

  freezeThenRun(() => player.reset(), 'Ouch!', 500);
}

function nextLevel() {
  const points = pointsForLevel(state.level);
  state.score += points;
  state.level++;
  updateHUD();

  freezeThenRun(() => {
    player.reset();
    state.lanes = buildLanes(state.level);
  }, `Level ${state.level}! +${points} pts`, 900);
}

function freezeThenRun(action, bannerText, delay) {
  state.frozen = true;
  showBanner(bannerText);
  setTimeout(() => {
    action();
    state.frozen = false;
  }, delay);
}

function gameOver() {
  state.running = false;
  finalScoreEl.textContent = state.score;

  if (state.score > highScore) {
    highScore = state.score;
    localStorage.setItem(HIGH_SCORE_KEY, String(highScore));
    newHighScoreMsgEl.classList.remove('hidden');
  } else {
    newHighScoreMsgEl.classList.add('hidden');
  }
  finalHighScoreEl.textContent = highScore;

  gameOverScreen.classList.remove('hidden');
}

function restartGame() {
  state.level = 1;
  state.lives = STARTING_LIVES;
  state.score = 0;
  state.running = true;
  state.frozen = false;
  state.lanes = buildLanes(1);
  player.reset();
  updateHUD();
  gameOverScreen.classList.add('hidden');
}

const KEY_MOVES = {
  ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
  ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
  ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
  ArrowRight: [1, 0], d: [1, 0], D: [1, 0]
};

window.addEventListener('keydown', (e) => {
  if (!state.running || state.frozen) return;
  const move = KEY_MOVES[e.key];
  if (!move) return;

  e.preventDefault();
  const didMove = player.move(move[0], move[1]);
  if (didMove && player.reachedGoal()) {
    nextLevel();
  }
});

tryAgainButton.addEventListener('click', restartGame);

function rowColor(row) {
  if (row === GOAL_ROW) return '#14532d';       // goal row
  if (row === START_ROW) return '#14532d';      // start row
  if (MEDIAN_ROWS.includes(row)) return '#166534'; // middle rest row
  return '#1f2937';                              // road
}

function drawBackground() {
  for (let row = 0; row < ROWS; row++) {
    ctx.fillStyle = rowColor(row);
    ctx.fillRect(0, row * TILE, CANVAS_WIDTH, TILE);
  }

  // lane dividers on road rows
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ROAD_ROWS.forEach((row) => {
    const y = row * TILE + TILE / 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
    ctx.setLineDash([]);
  });
}


function gameLoop() {
  if (state.running && !state.frozen) {
    state.lanes.forEach((lane) => lane.vehicles.forEach((v) => v.update()));
    checkCollisions();
  }

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawBackground();
  state.lanes.forEach((lane) => lane.vehicles.forEach((v) => v.draw(ctx)));
  player.draw(ctx);

  requestAnimationFrame(gameLoop);
}

updateHUD();
gameLoop();
