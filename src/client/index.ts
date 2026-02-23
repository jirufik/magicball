import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MagicBallScene } from './scenes/MagicBallScene.js';
import { SettingsScene } from './scenes/SettingsScene.js';
import { magicBall } from './services/MagicBallService.js';
import { GAME } from './config/gameConfig.js';

magicBall.loadAnswers();

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME.WIDTH,
  height: GAME.HEIGHT,
  parent: 'magicball',
  backgroundColor: '#ffffff',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false },
  },
  dom: { createContainer: true },
  scene: [BootScene, PreloadScene, MagicBallScene, SettingsScene],
};

new Phaser.Game(config);
