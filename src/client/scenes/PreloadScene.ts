import Phaser from 'phaser';
import { IMAGES, SPRITESHEETS, AUDIO } from '../config/assetManifest.js';
import { GAME } from '../config/gameConfig.js';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload(): void {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    const splash = this.add.image(centerX, centerY, IMAGES.LOGO.key);
    splash.setOrigin(0.5, 0.5);

    // Images
    for (const img of Object.values(IMAGES)) {
      if (img.key !== IMAGES.LOGO.key) {
        this.load.image(img.key, img.path);
      }
    }

    // Spritesheets
    for (const sheet of Object.values(SPRITESHEETS)) {
      this.load.spritesheet(sheet.key, sheet.path, {
        frameWidth: sheet.frameWidth,
        frameHeight: sheet.frameHeight,
      });
    }

    // Audio
    for (const audio of Object.values(AUDIO)) {
      this.load.audio(audio.key, audio.path);
    }
  }

  create(): void {
    this.time.delayedCall(GAME.PRELOAD_DELAY, () => {
      this.scene.start('MagicBall');
    });
  }
}
