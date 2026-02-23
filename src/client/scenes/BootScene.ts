import Phaser from 'phaser';
import { IMAGES } from '../config/assetManifest.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    this.load.image(IMAGES.LOGO.key, IMAGES.LOGO.path);
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#FFFFFF');
    this.scene.start('Preload');
  }
}
