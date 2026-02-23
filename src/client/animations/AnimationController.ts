import Phaser from 'phaser';
import type { AnimationFrame } from '../types/index.js';

export class AnimationController {
  constructor(private scene: Phaser.Scene) {}

  scaleSprites(
    sprites: Phaser.GameObjects.Components.Transform[],
    sizeScale: number = 1,
    duration: number = 3000,
    onComplete?: () => void,
  ): void {
    for (let i = 0; i < sprites.length; i++) {
      const config: Phaser.Types.Tweens.TweenBuilderConfig = {
        targets: sprites[i],
        scaleX: sizeScale,
        scaleY: sizeScale,
        duration,
        ease: 'Linear',
      };
      if (i === 0 && onComplete) {
        config.onComplete = onComplete;
      }
      this.scene.tweens.add(config);
    }
  }

  rotateSprites(
    sprites: Phaser.GameObjects.Components.Transform[],
    angle: number = 0,
    duration: number = 3000,
    onComplete?: () => void,
  ): void {
    for (let i = 0; i < sprites.length; i++) {
      const config: Phaser.Types.Tweens.TweenBuilderConfig = {
        targets: sprites[i],
        angle,
        duration,
        ease: 'Linear',
      };
      if (i === 0 && onComplete) {
        config.onComplete = onComplete;
      }
      this.scene.tweens.add(config);
    }
  }

  alphaSprites(
    sprites: Phaser.GameObjects.Components.Transform[],
    alpha: number = 1,
    duration: number = 3000,
    onComplete?: () => void,
  ): void {
    for (let i = 0; i < sprites.length; i++) {
      const config: Phaser.Types.Tweens.TweenBuilderConfig = {
        targets: sprites[i],
        alpha,
        duration,
        ease: 'Linear',
      };
      if (i === 0 && onComplete) {
        config.onComplete = onComplete;
      }
      this.scene.tweens.add(config);
    }
  }

  moveSprites(
    sprites: Phaser.GameObjects.Sprite[],
    frames: AnimationFrame[],
    onComplete?: () => void,
  ): void {
    if (sprites.length === 0 || frames.length === 0) return;

    const framesCopy = [...frames];
    this.executeMoveFrame(sprites, framesCopy, onComplete);
  }

  private executeMoveFrame(
    sprites: Phaser.GameObjects.Sprite[],
    frames: AnimationFrame[],
    onComplete?: () => void,
  ): void {
    if (frames.length === 0) {
      onComplete?.();
      return;
    }

    const frame = frames.shift()!;

    for (let i = 0; i < sprites.length; i++) {
      const sprite = sprites[i];
      const config: Phaser.Types.Tweens.TweenBuilderConfig = {
        targets: sprite,
        x: sprite.x + frame.moveByX,
        y: sprite.y + frame.moveByY,
        duration: frame.duration,
        ease: 'Linear',
      };

      if (i === sprites.length - 1) {
        config.onComplete = () => {
          this.executeMoveFrame(sprites, frames, onComplete);
        };
      }

      this.scene.tweens.add(config);
    }
  }

  sizeFontTxt(
    texts: Phaser.GameObjects.Text[],
    targetSize: number = 20,
    duration: number = 3000,
    onComplete?: () => void,
  ): void {
    if (texts.length === 0) {
      onComplete?.();
      return;
    }

    const startSize = parseInt(String(texts[0].style.fontSize)) || 20;
    const targetScale = targetSize / startSize;

    for (let i = 0; i < texts.length; i++) {
      const config: Phaser.Types.Tweens.TweenBuilderConfig = {
        targets: texts[i],
        scaleX: targetScale,
        scaleY: targetScale,
        duration,
        ease: 'Linear',
      };
      if (i === 0 && onComplete) {
        config.onComplete = onComplete;
      }
      this.scene.tweens.add(config);
    }
  }
}
