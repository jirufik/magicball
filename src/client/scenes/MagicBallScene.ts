import Phaser from 'phaser';
import { magicBall } from '../services/MagicBallService.js';
import { AnimationController } from '../animations/AnimationController.js';
import { getAnswerText } from '../utils/TextLayoutAlgorithm.js';
import { BALL_ANIMATION, TEXT_Y_OFFSETS } from '../config/gameConfig.js';
import type { AnimationFrame } from '../types/index.js';

export class MagicBallScene extends Phaser.Scene {
  private animationBall = false;
  private showAboutPanel = false;
  private anim!: AnimationController;

  // Sprites
  private background!: Phaser.GameObjects.Sprite;
  private wallS!: Phaser.GameObjects.Sprite;
  private answerS!: Phaser.GameObjects.Sprite;
  private magicBallS!: Phaser.GameObjects.Sprite;
  private skullS!: Phaser.GameObjects.Sprite;
  private spiderS!: Phaser.GameObjects.Sprite;
  private webS!: Phaser.GameObjects.Sprite;
  private cloud1!: Phaser.GameObjects.Sprite;
  private cloud2!: Phaser.GameObjects.Sprite;
  private aboutS!: Phaser.GameObjects.Sprite;
  private settingsS!: Phaser.GameObjects.Sprite;

  // Audio
  private audioKnock!: Phaser.Sound.BaseSound;
  private audioAnswer!: Phaser.Sound.BaseSound;

  // Cloud animation flags
  private cloud1Animation = false;
  private cloud2Animation = false;

  // Skull target position (for touch)
  private positionX = 100;
  private positionY = 1300;

  // Text sprites for answer display
  private txtAnswers: Phaser.GameObjects.Text[] = [];

  constructor() {
    super('MagicBall');
  }

  create(): void {
    this.anim = new AnimationController(this);

    this.background = this.add.sprite(0, 0, 'backgroundS').setOrigin(0, 0);
    this.animationBall = false;

    this.audioKnock = this.sound.add('knockA', { loop: true });
    this.audioAnswer = this.sound.add('answerA');

    this.showAboutPanel = false;

    this.showCloud();
    this.showSkull();
    this.showSpider();
    this.createSettings();
    this.createAbout();
  }

  update(): void {
    if (this.input.activePointer.isDown && this.input.activePointer.getDuration() < 100) {
      if (!this.clickAbout() && !this.showAboutPanel && !this.clickSettings()) {
        this.showBall();
      }
    }
    this.skullGoToPoint();
    this.moveCloud();
    this.collideSpider();
  }

  // ==================== BALL ANIMATION ====================

  private showBall(): void {
    if (this.animationBall) return;
    this.animationBall = true;

    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    this.wallS = this.add.sprite(cx, cy, 'wallS').setOrigin(0.5).setScale(0.5).setAlpha(0.5);
    this.answerS = this.add
      .sprite(cx, cy, 'answerS')
      .setOrigin(0.5, 0.27)
      .setScale(0.85)
      .setAlpha(0);
    this.magicBallS = this.add
      .sprite(cx, cy, 'magicballS')
      .setOrigin(0.5)
      .setScale(0.5)
      .setAlpha(0.5);

    const masSprites = [this.wallS, this.magicBallS];
    this.anim.scaleSprites(masSprites, 1, BALL_ANIMATION.SCALE_DURATION);
    this.anim.alphaSprites(masSprites, 1, BALL_ANIMATION.ALPHA_DURATION);

    const frames: AnimationFrame[] = BALL_ANIMATION.FRAMES.map((f) => ({ ...f }));

    this.audioKnock.play();

    this.anim.moveSprites(masSprites as Phaser.GameObjects.Sprite[], frames, () => {
      this.audioKnock.stop();
      this.audioAnswer.play();

      const angle = Phaser.Math.Between(0, 1) === 0 ? -12 : 12;
      this.answerS.setAngle(angle);

      this.showAnswer();
      this.anim.alphaSprites([this.answerS], 1, BALL_ANIMATION.ANSWER_DURATION);
      this.anim.rotateSprites([this.answerS], 0, BALL_ANIMATION.ANSWER_DURATION);
      this.anim.scaleSprites([this.answerS], 1.05, BALL_ANIMATION.ANSWER_DURATION);
    });
  }

  private showAnswer(): void {
    const answer = magicBall.getAnswer();
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Sans',
      fontSize: '20px',
      color: '#FFFFFF',
    };
    const angle = this.answerS.angle;
    const x = this.cameras.main.centerX;
    let y = this.cameras.main.centerY - 30;
    const offset = 27;
    const textLines = getAnswerText(answer.text);
    const lineTexts = [
      textLines.text1,
      textLines.text2,
      textLines.text3,
      textLines.text4,
      textLines.text5,
    ];

    this.txtAnswers = [];
    for (let i = 0; i < 5; i++) {
      const txt = this.add
        .text(x, y, lineTexts[i], style)
        .setOrigin(0.5, 0.5)
        .setAngle(angle)
        .setScale(0.8)
        .setAlpha(0);
      this.txtAnswers.push(txt);
      y += offset;
    }

    this.anim.alphaSprites(this.txtAnswers, 1, BALL_ANIMATION.ANSWER_DURATION);
    this.anim.rotateSprites(this.txtAnswers, 0, BALL_ANIMATION.ANSWER_DURATION);
    this.anim.scaleSprites(this.txtAnswers, 1, BALL_ANIMATION.ANSWER_DURATION, () => {
      this.endShowText();
    });
  }

  private endShowText(): void {
    this.anim.sizeFontTxt(this.txtAnswers, 80, BALL_ANIMATION.FINAL_DURATION, () => {
      this.destroyTextAnswer();
    });

    const masSprites = [this.wallS, this.magicBallS, this.answerS];
    this.anim.scaleSprites(
      masSprites,
      BALL_ANIMATION.FINAL_SCALE,
      BALL_ANIMATION.FINAL_DURATION,
      () => {
        this.stopAnimationBall();
      },
    );

    for (let i = 0; i < this.txtAnswers.length; i++) {
      const txt = this.txtAnswers[i];
      this.tweens.add({
        targets: txt,
        y: txt.y + TEXT_Y_OFFSETS[i],
        duration: BALL_ANIMATION.FINAL_DURATION,
        ease: 'Linear',
      });
    }
  }

  private destroyTextAnswer(): void {
    for (const txt of this.txtAnswers) {
      txt.destroy();
    }
    this.txtAnswers = [];
    this.animationBall = false;
  }

  private stopAnimationBall(): void {
    this.answerS?.destroy();
    this.magicBallS?.destroy();
    this.wallS?.destroy();
  }

  // ==================== SKULL ====================

  private showSkull(): void {
    this.skullS = this.add.sprite(400, 300, 'skullS').setOrigin(0.5, 0.1);
    this.physics.add.existing(this.skullS);

    this.anims.create({
      key: 'skullAnimation',
      frames: this.anims.generateFrameNumbers('skullS', {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1],
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.skullS.play('skullAnimation');

    const body = this.skullS.body as Phaser.Physics.Arcade.Body;
    body.setAllowRotation(false);
    body.setCircle(80);

    this.positionX = 100;
    this.positionY = 1300;
  }

  private skullGoToPoint(): void {
    if (!this.skullS) return;

    if (!this.sys.game.device.input.touch) {
      this.physics.moveToObject(this.skullS, this.input.activePointer, 10, 1200);
    } else {
      const speed = Phaser.Math.Between(1200, 3000);
      this.physics.moveTo(this.skullS, this.positionX, this.positionY, 10, speed);
      const distance = Phaser.Math.Distance.Between(
        this.skullS.x,
        this.skullS.y,
        this.positionX,
        this.positionY,
      );
      if (distance <= 100) {
        this.positionX = Phaser.Math.Between(10, 740);
        this.positionY = Phaser.Math.Between(10, 1320);
      }
    }
  }

  // ==================== CLOUD ====================

  private showCloud(): void {
    this.cloud1Animation = false;
    this.cloud2Animation = false;
    this.cloud1 = this.add.sprite(1030, 100, 'cloud1S').setOrigin(0.5);
    this.cloud2 = this.add.sprite(960, 300, 'cloud2S').setOrigin(0.5);
  }

  private moveCloud(): void {
    if (!this.cloud1Animation) {
      this.cloud1.setScale(Phaser.Math.Between(5, 12) / 10);
      this.cloud1.y = Phaser.Math.Between(90, 300);
      this.cloud1.x = this.cloud1.displayWidth / 2 + 760;
      const frames: AnimationFrame[] = [
        {
          moveByX: -(this.cloud1.displayWidth + 760),
          moveByY: 0,
          duration: Phaser.Math.Between(25000, 40000),
        },
      ];
      this.anim.moveSprites([this.cloud1 as Phaser.GameObjects.Sprite], frames, () => {
        this.cloud1Animation = false;
      });
      this.cloud1Animation = true;
    }

    if (!this.cloud2Animation) {
      this.cloud2.setScale(Phaser.Math.Between(5, 12) / 10);
      this.cloud2.y = Phaser.Math.Between(130, 350);
      this.cloud2.x = this.cloud2.displayWidth / 2 + 760;
      const frames: AnimationFrame[] = [
        {
          moveByX: -(this.cloud2.displayWidth + 760),
          moveByY: 0,
          duration: Phaser.Math.Between(20000, 30000),
        },
      ];
      this.anim.moveSprites([this.cloud2 as Phaser.GameObjects.Sprite], frames, () => {
        this.cloud2Animation = false;
      });
      this.cloud2Animation = true;
    }
  }

  // ==================== SPIDER ====================

  private showSpider(): void {
    this.webS = this.add.sprite(160, 875, 'webS').setOrigin(0.5, 0);

    this.spiderS = this.add.sprite(160, 1023, 'spiderS').setOrigin(0.5);
    this.physics.add.existing(this.spiderS);

    this.anims.create({
      key: 'spiderBlinking',
      frames: this.anims.generateFrameNumbers('spiderS', {
        frames: [3, 2, 1, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3],
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.spiderS.play('spiderBlinking');

    const body = this.spiderS.body as Phaser.Physics.Arcade.Body;
    body.setBounce(0, 0.4);
    body.setGravity(0, 0);
    body.setCircle(34);
    body.setAllowRotation(false);
    body.setCollideWorldBounds(true);
  }

  private collideSpider(): void {
    if (this.spiderS && this.skullS) {
      this.physics.overlap(this.spiderS, this.skullS, () => this.moveSpiderHit());
    }

    const spiderBody = this.spiderS.body as Phaser.Physics.Arcade.Body;

    if (this.spiderS.x <= 160 && this.spiderS.y >= 1298) {
      this.spiderS.play('spiderBlinking', true);
      spiderBody.setVelocity(0, 0);
      spiderBody.setGravity(0, -170);
      this.webS.x = this.spiderS.x;
      this.webS.setScale(1, 3);
      this.webS.setAlpha(1);
    }

    if (spiderBody.gravity.y < 0) {
      let scaleY = 3;
      let posWebY = 875 + this.webS.displayHeight + 10;
      while (posWebY > this.spiderS.y) {
        this.webS.setScale(1, scaleY);
        posWebY = 875 + this.webS.displayHeight + 10;
        scaleY -= 0.1;
      }
    }

    if (spiderBody.gravity.y < 0 && this.spiderS.y <= 1023) {
      spiderBody.setGravity(0, 0);
      spiderBody.setVelocity(0, 0);
      this.webS.setScale(1, 1);
      const skullBody = this.skullS.body as Phaser.Physics.Arcade.Body;
      skullBody.checkCollision.none = false;
    }
  }

  private moveSpiderHit(): void {
    if (!this.spiderS) return;

    const spiderBody = this.spiderS.body as Phaser.Physics.Arcade.Body;
    const skullBody = this.skullS.body as Phaser.Physics.Arcade.Body;

    this.webS.setAlpha(0);
    this.spiderS.stop();
    this.spiderS.setFrame(5);
    skullBody.checkCollision.none = true;
    spiderBody.setGravity(0, 170);
    spiderBody.setBounce(0, 0.2);
    spiderBody.setVelocity(40, -170);

    this.time.delayedCall(4000, () => this.upSpider());
  }

  private upSpider(): void {
    const body = this.spiderS.body as Phaser.Physics.Arcade.Body;
    body.setBounce(0, 0);
    body.setVelocity(0, 0);
    this.physics.moveTo(this.spiderS, 160, 1300, 10, 2000);
  }

  // ==================== ABOUT ====================

  private createAbout(): void {
    this.aboutS = this.add.sprite(0, -1334, 'aboutS').setOrigin(0, 0).setInteractive();
    this.physics.add.existing(this.aboutS);

    const body = this.aboutS.body as Phaser.Physics.Arcade.Body;
    body.setBounce(0, 0.3);
    body.setGravity(0, 0);
    body.setSize(1, 1, false);
    body.setOffset(690, 1335);
    body.setCollideWorldBounds(false);

    this.aboutS.on('pointerdown', () => this.showCloseAbout());
  }

  private showCloseAbout(): void {
    const body = this.aboutS.body as Phaser.Physics.Arcade.Body;

    if (this.aboutS.y < -1330) {
      if (this.clickAbout() && !this.animationBall) {
        body.setCollideWorldBounds(true);
        this.showAboutPanel = true;
        body.setGravity(0, 200);
      }
    }

    if (this.aboutS.y > -5) {
      body.setCollideWorldBounds(false);
      body.setGravity(0, 0);
      this.tweens.add({
        targets: this.aboutS,
        y: -1334,
        duration: 3000,
        ease: 'Linear',
        onComplete: () => {
          this.showAboutPanel = false;
        },
      });
    }
  }

  private clickAbout(): boolean {
    const activeX = this.input.x;
    const activeY = this.input.y;
    return activeX >= 635 && activeY < 145;
  }

  // ==================== SETTINGS ====================

  private createSettings(): void {
    this.settingsS = this.add.sprite(655, 1230, 'settingsS').setOrigin(0, 0).setInteractive();
    this.settingsS.on('pointerdown', () => this.goToSettings());
  }

  private goToSettings(): void {
    if (this.clickSettings()) {
      this.scene.start('Settings');
    }
  }

  private clickSettings(): boolean {
    const activeX = this.input.x;
    const activeY = this.input.y;
    return activeX >= 635 && activeY > 1225 && !this.showAboutPanel && !this.animationBall;
  }
}
