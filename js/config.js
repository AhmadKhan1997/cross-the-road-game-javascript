
export const TILE = 50;          //pixel size of one grid cell
export const COLS = 13;          //board width in tiles
export const ROWS = 13;          //board height in tiles

export const CANVAS_WIDTH = COLS * TILE;
export const CANVAS_HEIGHT = ROWS * TILE;


export const GOAL_ROW = 0;                 //reaching this row = level clear
export const START_ROW = ROWS - 1;         //player's spawn row
export const MEDIAN_ROWS = [6];            //middle point
export const SAFE_ROWS = [GOAL_ROW, ...MEDIAN_ROWS, START_ROW];

//Road Rows, all rows other than the 3 (start,finish,middle) are road
export const ROAD_ROWS = [];
for (let r = 1; r < ROWS - 1; r++) {
  if (!MEDIAN_ROWS.includes(r)) ROAD_ROWS.push(r);
}

export const STARTING_LIVES = 3;

export const FROG_IMAGE = 'assets/images/frog.png';

export const VEHICLE_STATS = {
  bike: {
    width: 36,
    height: 36,
    baseSpeed: 1.8,
    image: 'assets/images/bike.png'
  },
  car: {
    width: 60,
    height: 38,
    baseSpeed: 2.4,
    image: 'assets/images/car.png'
  },
  fastCar: {
    width: 62,
    height: 38,
    baseSpeed: 3.6,
    image: 'assets/images/fast-car.png'
  },
  truck: {
    width: 92,
    height: 44,
    baseSpeed: 1.5,
    image: 'assets/images/truck.png'
  }
};


export const LEVEL_TIERS = [
  { types: ['bike'] },                                  // This is level 1
  { types: ['bike', 'car'] },                            // This is Level 2
  { types: ['car', 'bike', 'truck'] },                    // This is Level 3
  { types: ['fastCar', 'car', 'bike', 'truck'] }          // This is level 4+
];

export const VEHICLE_SPEED = 0.18;   // +18% vehicle speed per level
export const NUMBER_OF_VEHICLE = 0.15; // +15% vehicle density per level

// Every level awards double the previous level, starting with 10 points
export function pointsForLevel(level) {
  return 10 * Math.pow(2, level - 1);
}

//Resolves the active vehicle types + multipliers for any given level
export function getLevelConfig(level) {
  const tier = LEVEL_TIERS[Math.min(level - 1, LEVEL_TIERS.length - 1)];
  return {
    types: tier.types,
    speedMultiplier: 1 + (level - 1) * VEHICLE_SPEED,
    vehicleMultiplier: 1 + (level - 1) * NUMBER_OF_VEHICLE
  };
}

export const HIGH_SCORE_KEY = 'cross_the_frog_high_score';
