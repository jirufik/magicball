import type { Answer, Language } from '../types/index.js';

const STORAGE_KEYS = {
  ANSWERS: 'magicBallAnswers',
  LANGUAGE: 'magicBallLang',
} as const;

export class StorageService {
  static saveAnswers(answers: Answer[], language: Language): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch {
      // QuotaExceededError or other storage errors — silently ignore
    }
  }

  static loadAnswers(): { answers: Answer[]; language: Language } | null {
    try {
      const rawAnswers = localStorage.getItem(STORAGE_KEYS.ANSWERS);
      const rawLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);

      if (rawAnswers === null || rawLang === null) {
        return null;
      }

      const answers: Answer[] = JSON.parse(rawAnswers);

      if (!Array.isArray(answers) || answers.length === 0 || !answers[0].text) {
        return null;
      }

      const language = (rawLang === 'en' ? 'en' : 'ru') as Language;

      return { answers, language };
    } catch {
      return null;
    }
  }

  static clear(): void {
    localStorage.removeItem(STORAGE_KEYS.ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.LANGUAGE);
  }
}
