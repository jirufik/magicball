import type { Answer, AnswerType, Language } from '../types/index.js';
import { DEFAULT_ANSWERS } from '../config/defaultAnswers.js';
import { StorageService } from './StorageService.js';

const TYPE_ORDER: Record<AnswerType, number> = {
  positive: 1,
  neutral: 2,
  negative: 3,
};

class MagicBallServiceClass {
  private _answers: Answer[] = [];
  private _language: Language = 'ru';

  get answers(): Answer[] {
    return this._answers;
  }

  get language(): Language {
    return this._language;
  }

  addAnswer(text: string, type: AnswerType): void {
    this._answers.push({ text, type });
    this.sortAnswers();
    this.save();
  }

  addPositiveAnswer(text: string): void {
    this.addAnswer(text, 'positive');
  }

  addNegativeAnswer(text: string): void {
    this.addAnswer(text, 'negative');
  }

  addNeutralAnswer(text: string): void {
    this.addAnswer(text, 'neutral');
  }

  clearAnswers(): void {
    this._answers.length = 0;
  }

  delAnswer(value: number | string): void {
    if (typeof value === 'number') {
      if (value > 0 && this._answers.length > 0) {
        this._answers.splice(value - 1, 1);
      }
    } else {
      const index = this._answers.findIndex((a) => a.text === value);
      if (index !== -1) {
        this._answers.splice(index, 1);
      }
    }
    this.save();
  }

  getAnswer(): Answer {
    const index = Math.floor(Math.random() * this._answers.length);
    return this._answers[index];
  }

  setLanguage(lang: Language): void {
    this._language = lang;
    this.setDefaults();
  }

  setLangRU(): void {
    this.setLanguage('ru');
  }

  setLangEN(): void {
    this.setLanguage('en');
  }

  isLangRU(): boolean {
    return this._language === 'ru';
  }

  isLangEN(): boolean {
    return this._language === 'en';
  }

  setDefaults(): void {
    this.clearAnswers();
    for (const def of DEFAULT_ANSWERS) {
      this.addAnswer(def[this._language], def.type);
    }
    this.sortAnswers();
    this.save();
  }

  saveAnswers(): void {
    this.save();
  }

  loadAnswers(): void {
    const data = StorageService.loadAnswers();
    if (data) {
      this._language = data.language;
      this.clearAnswers();
      for (const a of data.answers) {
        this._answers.push({ text: a.text, type: a.type });
      }
      this.sortAnswers();
    } else {
      this._language = 'ru';
      this.setDefaults();
    }
  }

  private sortAnswers(): void {
    this._answers.sort((a, b) => (TYPE_ORDER[a.type] ?? 0) - (TYPE_ORDER[b.type] ?? 0));
  }

  private save(): void {
    StorageService.saveAnswers(this._answers, this._language);
  }
}

export const magicBall = new MagicBallServiceClass();
