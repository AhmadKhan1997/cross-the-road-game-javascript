import { TILE, COLS, VEHICLE_STATS } from '../config.js';

//This creates one image of each object and then every vechile of   
const imageCache = {};
function getImageFor(type) {
  if (!imageCache[type]) {
    const stats = VEHICLE_STATS[type];
    const img = new Image();
    const entry = { img, loaded: false };
    img.onload = () => { entry.loaded = true; };
    img.onerror = () => { entry.loaded = false; };
    img.src = stats.image;
    imageCache[type] = entry;
  }
  return imageCache[type];
}

export class Vehicle {
  /**
   * @param {string} type - VEHICLE_STATS ('bike' or 'car' or 'fastCar' or 'truck')
   * @param {number} row - grid row this vehicle travels on
   * @param {number} direction - 1 (moving right) or -1 (moving left)
   * @param {number} speedMultiplier
   * @param {number} initialxPostion
   */
  constructor(type, row, direction, speedMultiplier, initialxPostion) {
    this.type = type;
    this.stats = VEHICLE_STATS[type];
    this.row = row;
    this.direction = direction;
    this.width = this.stats.width;
    this.height = this.stats.height;
    this.speed = this.stats.baseSpeed * speedMultiplier * direction;

    this.x = initialxPostion;
    this.y = row * TILE + TILE / 2;

    this.imageEntry = getImageFor(type);
  }

  update() {
    this.x += this.speed;

    const totalWidth = COLS * TILE;
    const margin = this.width;

    if (this.direction > 0 && this.x - margin > totalWidth) {
      this.x = -margin;
    } else if (this.direction < 0 && this.x + margin < 0) {
      this.x = totalWidth + margin;
    }
  }

  getBounds() {
    return {
      left: this.x - this.width / 2,
      right: this.x + this.width / 2,
      top: this.y - this.height / 2,
      bottom: this.y + this.height / 2
    };
  }

  draw(ctx) {
    ctx.save();

    //Flip  horizontally when moving left so vehicles face travel direction
    if (this.direction < 0) {
      ctx.translate(this.x, this.y);
      ctx.scale(-1, 1);
      ctx.translate(-this.x, -this.y);
    }

    if (this.imageEntry.loaded) {
      ctx.drawImage(
        this.imageEntry.img,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    } 
    ctx.restore();
  }
}
