import { TILE, COLS, ROWS, START_ROW, GOAL_ROW, FROG_IMAGE } from '../config.js';

//This is the player class. It loads the frog iamge as a player and checks where it is on the grid, how it moves, and how it gets drawn.
export class Player {
  constructor() {
    this.size = TILE * 0.8;

    this.image = new Image();
    this.imageLoaded = false;
    this.image.onload = () => { this.imageLoaded = true; };
    this.image.onerror = () => { this.imageLoaded = false; };
    this.image.src = FROG_IMAGE;

    this.reset();
  }

  //Move the frog back to starting line
  reset() {
    this.col = Math.floor(COLS / 2);
    this.row = START_ROW;
  }

  get x() {
    return this.col * TILE + TILE / 2;
  }

  get y() {
    return this.row * TILE + TILE / 2;
  }

  //Attempts to move according to the grid
  move(dCol, dRow) {
    const newCol = this.col + dCol;
    const newRow = this.row + dRow;

    if (newCol < 0 || newCol >= COLS || newRow < 0 || newRow >= ROWS) {
      return false;
    }

    this.col = newCol;
    this.row = newRow;
    return true;
  }

  reachedGoal() {
    return this.row === GOAL_ROW;
  }

  getBounds() {
    const half = this.size / 2;
    return {
      left: this.x - half,
      right: this.x + half,
      top: this.y - half,
      bottom: this.y + half
    };
  }

  draw(ctx) {
    const half = this.size / 2;

    if (this.imageLoaded) {
      ctx.drawImage(this.image, this.x - half, this.y - half, this.size, this.size);
      return;
    }
  }
}
