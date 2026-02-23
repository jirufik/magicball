import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService } from '../StorageService.js';
import type { Answer } from '../../types/index.js';

const mockStorage: Record<string, string> = {};

beforeEach(() => {
  for (const key of Object.keys(mockStorage)) {
    delete mockStorage[key];
  }

  vi.stubGlobal('localStorage', {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, value: string) => {
      mockStorage[key] = value;
    },
    removeItem: (key: string) => {
      delete mockStorage[key];
    },
  });
});

describe('StorageService', () => {
  const testAnswers: Answer[] = [
    { text: 'Да', type: 'positive' },
    { text: 'Нет', type: 'negative' },
  ];

  describe('saveAnswers / loadAnswers', () => {
    it('should save and load answers correctly', () => {
      StorageService.saveAnswers(testAnswers, 'ru');
      const result = StorageService.loadAnswers();

      expect(result).not.toBeNull();
      expect(result!.answers).toEqual(testAnswers);
      expect(result!.language).toBe('ru');
    });

    it('should save and load with EN language', () => {
      StorageService.saveAnswers(testAnswers, 'en');
      const result = StorageService.loadAnswers();

      expect(result!.language).toBe('en');
    });

    it('should return null if no data stored', () => {
      const result = StorageService.loadAnswers();
      expect(result).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      mockStorage['magicBallAnswers'] = 'not json';
      mockStorage['magicBallLang'] = 'ru';

      const result = StorageService.loadAnswers();
      expect(result).toBeNull();
    });

    it('should return null for empty array', () => {
      mockStorage['magicBallAnswers'] = '[]';
      mockStorage['magicBallLang'] = 'ru';

      const result = StorageService.loadAnswers();
      expect(result).toBeNull();
    });

    it('should return null for array with empty objects', () => {
      mockStorage['magicBallAnswers'] = '[{}]';
      mockStorage['magicBallLang'] = 'ru';

      const result = StorageService.loadAnswers();
      expect(result).toBeNull();
    });
  });

  describe('clear', () => {
    it('should remove stored data', () => {
      StorageService.saveAnswers(testAnswers, 'ru');
      StorageService.clear();
      const result = StorageService.loadAnswers();
      expect(result).toBeNull();
    });
  });

  describe('saveAnswers error handling', () => {
    it('should not throw on QuotaExceededError', () => {
      vi.stubGlobal('localStorage', {
        getItem: () => null,
        setItem: () => {
          throw new DOMException('quota exceeded', 'QuotaExceededError');
        },
        removeItem: () => {},
      });

      expect(() => StorageService.saveAnswers(testAnswers, 'ru')).not.toThrow();
    });
  });
});
