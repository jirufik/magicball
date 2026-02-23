import Phaser from 'phaser';
import { magicBall } from '../services/MagicBallService.js';
import { SETTINGS_UI } from '../config/gameConfig.js';

type AddAnswerMethod = 'addPositiveAnswer' | 'addNeutralAnswer' | 'addNegativeAnswer';

export class SettingsScene extends Phaser.Scene {
  private readonly NAME_ANSWER = 'answertxtS';
  private typeAnswer: AddAnswerMethod = 'addNeutralAnswer';
  private curAnswer: Phaser.GameObjects.Sprite | null = null;
  private previousPos: number = SETTINGS_UI.TOP_BOUNDARY;
  private flUpAnswers = false;
  private flDownAnswers = false;
  private posY: number = SETTINGS_UI.TOP_BOUNDARY;

  // Button sprites
  private btnpanelS!: Phaser.GameObjects.Sprite;
  private backS!: Phaser.GameObjects.Sprite;
  private addAnswerS!: Phaser.GameObjects.Sprite;
  private upS!: Phaser.GameObjects.Sprite;
  private downS!: Phaser.GameObjects.Sprite;
  private resetS!: Phaser.GameObjects.Sprite;
  private langS!: Phaser.GameObjects.Sprite;

  // Input UI elements
  private inputBackgroundS?: Phaser.GameObjects.Sprite;
  private cancelS?: Phaser.GameObjects.Sprite;
  private inputS?: Phaser.GameObjects.Sprite;
  private positiveS?: Phaser.GameObjects.Sprite;
  private neutralS?: Phaser.GameObjects.Sprite;
  private negativeS?: Phaser.GameObjects.Sprite;
  private inputDom?: Phaser.GameObjects.DOMElement;

  // Dynamic answer sprites stored by index
  private answerSprites: Map<number, Phaser.GameObjects.Sprite> = new Map();

  constructor() {
    super('Settings');
  }

  create(): void {
    this.typeAnswer = 'addNeutralAnswer';
    this.curAnswer = null;
    this.previousPos = SETTINGS_UI.TOP_BOUNDARY;
    this.flUpAnswers = false;
    this.flDownAnswers = false;
    this.posY = SETTINGS_UI.TOP_BOUNDARY;
    this.answerSprites.clear();

    this.add.sprite(0, 0, 'backgroundS').setOrigin(0, 0);
    this.showButtons();
    this.showAnswers();
  }

  update(): void {
    this.moveAnswers();
    this.answersToPlace();
  }

  // ==================== BUTTONS ====================

  private showButtons(): void {
    this.btnpanelS = this.add.sprite(0, 0, 'btnpanelS').setOrigin(0, 0);

    this.backS = this.add.sprite(0, 1184, 'backS').setOrigin(0, 0).setInteractive();
    this.backS.on('pointerdown', () => this.goToMagicBall());

    this.addAnswerS = this.add.sprite(0, 0, 'addanswerS').setOrigin(0, 0).setInteractive();
    this.addAnswerS.on('pointerdown', () => this.showInput());

    this.upS = this.add.sprite(150, 0, 'upS').setOrigin(0, 0).setInteractive();
    this.upS.on('pointerdown', () => this.moveUp());
    this.upS.on('pointerup', () => this.moveUpStop());

    this.downS = this.add.sprite(300, 0, 'downS').setOrigin(0, 0).setInteractive();
    this.downS.on('pointerdown', () => this.moveDown());
    this.downS.on('pointerup', () => this.moveDownStop());

    this.resetS = this.add.sprite(450, 0, 'resetS').setOrigin(0, 0).setInteractive();
    this.resetS.on('pointerdown', () => this.setDefault());

    this.langS = this.add.sprite(600, 0, 'langS').setOrigin(0, 0).setInteractive();
    this.langS.on('pointerdown', () => this.changeLang());
    this.langS.setFrame(magicBall.isLangEN() ? 1 : 0);
  }

  private spritesTop(): void {
    this.children.bringToTop(this.btnpanelS);
    this.children.bringToTop(this.backS);
    this.children.bringToTop(this.addAnswerS);
    this.children.bringToTop(this.upS);
    this.children.bringToTop(this.downS);
    this.children.bringToTop(this.resetS);
    this.children.bringToTop(this.langS);
  }

  private changeLang(): void {
    this.posY = SETTINGS_UI.TOP_BOUNDARY;
    this.clearAnswers();
    if (magicBall.isLangEN()) {
      magicBall.setLangRU();
      this.langS.setFrame(0);
    } else {
      magicBall.setLangEN();
      this.langS.setFrame(1);
    }
    this.showAnswers();
  }

  private setDefault(): void {
    this.posY = SETTINGS_UI.TOP_BOUNDARY;
    this.clearAnswers();
    magicBall.setDefaults();
    this.showAnswers();
  }

  private goToMagicBall(): void {
    this.scene.start('MagicBall');
  }

  // ==================== ANSWERS ====================

  private showAnswers(): void {
    const posX = 20;
    let posY = this.posY;
    const offset = SETTINGS_UI.ANSWER_HEIGHT;
    const answers = magicBall.answers;

    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      let typeFrame = 1; // neutral
      if (answer.type === 'positive') typeFrame = 0;
      if (answer.type === 'negative') typeFrame = 2;

      const sprite = this.add
        .sprite(posX, posY, 'answertxtS', typeFrame)
        .setOrigin(0, 0)
        .setInteractive({ draggable: true });

      sprite.on('pointerdown', () => this.dragStart(sprite));
      sprite.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        sprite.y = dragY;
        this.dragUpdate();
      });
      sprite.on('dragend', () => this.dragStop());

      // Text answer
      const text = this.add
        .text(posX + 10, posY + 10, answer.text, {
          fontFamily: 'Sans',
          fontSize: '60px',
          color: '#000000',
          wordWrap: { width: 690 },
          align: 'center',
        })
        .setOrigin(0, 0);
      text.setFixedSize(680, 170);

      // Delete button
      const delBtn = this.add
        .sprite(posX + 510, posY, 'delS')
        .setOrigin(0, 0)
        .setInteractive();
      delBtn.setAlpha(0);
      delBtn.on('pointerdown', () => this.delAnswer(answer.text));

      // Store references
      sprite.setData('textObj', text);
      sprite.setData('delBtn', delBtn);
      sprite.setData('index', i);
      this.answerSprites.set(i, sprite);

      posY += offset;
    }
    this.spritesTop();
  }

  private dragStart(answerSprite: Phaser.GameObjects.Sprite): void {
    if (this.curAnswer !== null) return;
    this.curAnswer = answerSprite;
    this.previousPos = answerSprite.y;
    this.disableDrag();

    const delBtn = answerSprite.getData('delBtn') as Phaser.GameObjects.Sprite;
    if (delBtn) {
      delBtn.setAlpha(1);
      delBtn.setInteractive();
    }
  }

  private dragUpdate(): void {
    if (this.curAnswer === null) return;

    const offset = this.previousPos - this.curAnswer.y;
    const answers = magicBall.answers;

    for (let i = 0; i < answers.length; i++) {
      const sprite = this.answerSprites.get(i);
      if (sprite && sprite !== this.curAnswer) {
        sprite.y -= offset;
        const textObj = sprite.getData('textObj') as Phaser.GameObjects.Text;
        const delBtn = sprite.getData('delBtn') as Phaser.GameObjects.Sprite;
        if (textObj) textObj.y -= offset;
        if (delBtn) delBtn.y -= offset;
      }
    }

    // Update text and del positions for current answer too
    const textObj = this.curAnswer.getData('textObj') as Phaser.GameObjects.Text;
    const delBtn = this.curAnswer.getData('delBtn') as Phaser.GameObjects.Sprite;
    if (textObj) textObj.y = this.curAnswer.y + 10;
    if (delBtn) delBtn.y = this.curAnswer.y;

    this.previousPos = this.curAnswer.y;
  }

  private dragStop(): void {
    this.curAnswer = null;
    this.enableDrag();
  }

  private clearAnswers(): void {
    for (const [, sprite] of this.answerSprites) {
      const textObj = sprite.getData('textObj') as Phaser.GameObjects.Text;
      const delBtn = sprite.getData('delBtn') as Phaser.GameObjects.Sprite;
      textObj?.destroy();
      delBtn?.destroy();
      sprite.destroy();
    }
    this.answerSprites.clear();
  }

  private answersToPlace(): void {
    if (this.curAnswer !== null) return;

    let offset = 0;
    if (this.firstAboard()) offset = -SETTINGS_UI.SCROLL_STEP;
    if (this.lastAboard()) offset = SETTINGS_UI.SCROLL_STEP;
    if (this.firstAboard() && this.lastAboard()) offset = 0;

    if (offset !== 0) {
      for (const [, sprite] of this.answerSprites) {
        sprite.y += offset;
        const textObj = sprite.getData('textObj') as Phaser.GameObjects.Text;
        const delBtn = sprite.getData('delBtn') as Phaser.GameObjects.Sprite;
        if (textObj) textObj.y += offset;
        if (delBtn) delBtn.y += offset;
      }
    }
  }

  private disableDrag(): void {
    for (const [, sprite] of this.answerSprites) {
      if (sprite !== this.curAnswer) {
        this.input.setDraggable(sprite, false);
        const delBtn = sprite.getData('delBtn') as Phaser.GameObjects.Sprite;
        if (delBtn) {
          delBtn.disableInteractive();
          delBtn.setAlpha(0);
        }
      }
    }
  }

  private enableDrag(): void {
    for (const [, sprite] of this.answerSprites) {
      this.input.setDraggable(sprite);
    }
  }

  private delAnswer(text: string): void {
    if (magicBall.answers.length <= 1) return;
    const firstSprite = this.answerSprites.get(0);
    this.posY = firstSprite ? firstSprite.y : SETTINGS_UI.TOP_BOUNDARY;
    this.clearAnswers();
    magicBall.delAnswer(text);
    this.showAnswers();
  }

  // ==================== INPUT ====================

  private showInput(): void {
    this.typeAnswer = 'addNeutralAnswer';

    this.inputBackgroundS = this.add.sprite(0, 0, 'backgroundS').setOrigin(0, 0);

    this.cancelS = this.add.sprite(400, 900, 'cancelS').setOrigin(0, 0).setInteractive();
    this.cancelS.on('pointerdown', () => this.closeInput());

    this.inputS = this.add.sprite(80, 900, 'inputS').setOrigin(0, 0).setInteractive();
    this.inputS.on('pointerdown', () => this.addAnswerFromInput());

    this.positiveS = this.add.sprite(80, 500, 'positiveS').setOrigin(0, 0).setInteractive();
    this.positiveS.on('pointerdown', () => this.setPositiveAnswer());
    this.positiveS.setFrame(1);

    this.neutralS = this.add.sprite(290, 500, 'neutralS').setOrigin(0, 0).setInteractive();
    this.neutralS.on('pointerdown', () => this.setNeutralAnswer());
    this.neutralS.setFrame(0);

    this.negativeS = this.add.sprite(500, 500, 'negativeS').setOrigin(0, 0).setInteractive();
    this.negativeS.on('pointerdown', () => this.setNegativeAnswer());
    this.negativeS.setFrame(1);

    const placeholder = magicBall.isLangRU() ? 'Введите ответ' : 'Input answer';
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.maxLength = SETTINGS_UI.INPUT_MAX_LENGTH;
    inputElement.placeholder = placeholder;
    inputElement.style.cssText =
      'font-size:32px; width:685px; height:70px; text-align:center; border:10px solid #FFFFFF; background:rgba(255,255,255,0.5); font-family:"Eras Bold ITC",sans-serif; color:#212121; outline:none;';

    this.inputDom = this.add.dom(375, 235, inputElement);
  }

  private setPositiveAnswer(): void {
    this.typeAnswer = 'addPositiveAnswer';
    this.positiveS?.setFrame(0);
    this.neutralS?.setFrame(1);
    this.negativeS?.setFrame(1);
  }

  private setNeutralAnswer(): void {
    this.typeAnswer = 'addNeutralAnswer';
    this.positiveS?.setFrame(1);
    this.neutralS?.setFrame(0);
    this.negativeS?.setFrame(1);
  }

  private setNegativeAnswer(): void {
    this.typeAnswer = 'addNegativeAnswer';
    this.positiveS?.setFrame(1);
    this.neutralS?.setFrame(1);
    this.negativeS?.setFrame(0);
  }

  private addAnswerFromInput(): void {
    const firstSprite = this.answerSprites.get(0);
    this.posY = firstSprite ? firstSprite.y : SETTINGS_UI.TOP_BOUNDARY;

    this.clearAnswers();
    const inputEl = this.inputDom?.node as HTMLInputElement;
    const text = inputEl?.value?.trim() ?? '';
    if (text.length > 0) {
      magicBall[this.typeAnswer](text);
    }
    this.closeInput();
    this.showAnswers();
  }

  private closeInput(): void {
    this.inputBackgroundS?.destroy();
    this.cancelS?.destroy();
    this.inputS?.destroy();
    this.positiveS?.destroy();
    this.neutralS?.destroy();
    this.negativeS?.destroy();
    this.inputDom?.destroy();

    this.inputBackgroundS = undefined;
    this.cancelS = undefined;
    this.inputS = undefined;
    this.positiveS = undefined;
    this.neutralS = undefined;
    this.negativeS = undefined;
    this.inputDom = undefined;
  }

  // ==================== SCROLL ====================

  private moveDown(): void {
    this.flDownAnswers = true;
    this.flUpAnswers = false;
  }

  private moveDownStop(): void {
    this.flDownAnswers = false;
  }

  private moveUp(): void {
    this.flDownAnswers = false;
    this.flUpAnswers = true;
  }

  private moveUpStop(): void {
    this.flUpAnswers = false;
  }

  private moveAnswers(): void {
    this.firstAboard();
    this.lastAboard();

    if (!this.flDownAnswers && !this.flUpAnswers) return;

    let offset = 0;
    if (this.flDownAnswers) offset = -SETTINGS_UI.SCROLL_STEP;
    if (this.flUpAnswers) offset = SETTINGS_UI.SCROLL_STEP;
    if (this.flDownAnswers && this.flUpAnswers) offset = SETTINGS_UI.SCROLL_STEP;

    for (const [, sprite] of this.answerSprites) {
      sprite.y += offset;
      const textObj = sprite.getData('textObj') as Phaser.GameObjects.Text;
      const delBtn = sprite.getData('delBtn') as Phaser.GameObjects.Sprite;
      if (textObj) textObj.y += offset;
      if (delBtn) delBtn.y += offset;
    }
  }

  private firstAboard(): boolean {
    const firstSprite = this.answerSprites.get(0);
    if (firstSprite && firstSprite.y >= SETTINGS_UI.TOP_BOUNDARY) {
      this.flUpAnswers = false;
      return true;
    }
    return false;
  }

  private lastAboard(): boolean {
    const length = magicBall.answers.length;
    if (length > 0) {
      const lastSprite = this.answerSprites.get(length - 1);
      if (lastSprite && lastSprite.y <= SETTINGS_UI.BOTTOM_BOUNDARY) {
        this.flDownAnswers = false;
        return true;
      }
    }
    return false;
  }
}
