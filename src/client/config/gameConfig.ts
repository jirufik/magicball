import type { AnimationFrame } from '../types/index.js';

export const GAME = {
  WIDTH: 750,
  HEIGHT: 1334,
  PRELOAD_DELAY: 2000,
} as const;

export const BALL_ANIMATION = {
  SCALE_DURATION: 2000,
  ALPHA_DURATION: 1000,
  ANSWER_DURATION: 3000,
  FINAL_SCALE: 4.2,
  FINAL_DURATION: 5000,
  FRAMES: [
    { moveByX: 40, moveByY: 0, duration: 200 },
    { moveByX: -40, moveByY: 0, duration: 100 },
    { moveByX: 38, moveByY: 12, duration: 200 },
    { moveByX: -35, moveByY: 8, duration: 100 },
    { moveByX: 18, moveByY: 40, duration: 200 },
    { moveByX: -20, moveByY: -40, duration: 200 },
    { moveByX: 14, moveByY: 40, duration: 200 },
    { moveByX: -10, moveByY: -40, duration: 100 },
    { moveByX: 0, moveByY: 0, duration: 100 },
  ] as readonly AnimationFrame[],
} as const;

export const PHYSICS = {
  SKULL_SPEED: 10,
  SKULL_CIRCLE: 80,
  SPIDER_BOUNCE: 0.4,
  SPIDER_GRAVITY: -170,
  SPIDER_CIRCLE: 34,
} as const;

export const TEXT_LAYOUT = {
  LINE_LENGTHS: [15, 13, 11, 9, 6] as const,
  LINE_COUNT: 5,
  MAX_ITERATIONS: 40,
} as const;

export const SETTINGS_UI = {
  TOP_BOUNDARY: 170,
  BOTTOM_BOUNDARY: 964,
  ANSWER_HEIGHT: 220,
  SCROLL_STEP: 10,
  INPUT_MAX_LENGTH: 45,
} as const;

export const TEXT_Y_OFFSETS = [-110, -40, 20, 80, 160] as const;
