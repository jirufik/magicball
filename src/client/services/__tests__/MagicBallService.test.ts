import { describe, it, expect, beforeEach, vi } from 'vitest';

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

// Dynamic import so localStorage stub is in place before module loads
async function getMagicBall() {
  // Reset module cache to get a fresh instance
  vi.resetModules();
  const mod = await import('../MagicBallService.js');
  return mod.magicBall;
}

describe('MagicBallService', () => {
  describe('loadAnswers with defaults', () => {
    it('should load 20 default answers when no saved data', async () => {
      const magicBall = await getMagicBall();
      magicBall.loadAnswers();

      expect(magicBall.answers).toHaveLength(20);
      expect(magicBall.language).toBe('ru');
    });

    it('should have 10 positive, 5 neutral, 5 negative defaults', async () => {
      const magicBall = await getMagicBall();
      magicBall.loadAnswers();

      const positive = magicBall.answers.filter((a) => a.type === 'positive');
      const neutral = magicBall.answers.filter((a) => a.type === 'neutral');
      const negative = magicBall.answers.filter((a) => a.type === 'negative');

      expect(positive).toHaveLength(10);
      expect(neutral).toHaveLength(5);
      expect(negative).toHaveLength(5);
    });
  });

  describe('addAnswer', () => {
    it('should add a positive answer', async () => {
      const magicBall = await getMagicBall();
      magicBall.loadAnswers();
      const before = magicBall.answers.length;
      magicBall.addPositiveAnswer('Тест');
      expect(magicBall.answers.length).toBe(before + 1);
      expect(magicBall.answers.some((a) => a.text === 'Тест' && a.type === 'positive')).toBe(true);
    });

    it('should add a negative answer', async () => {
      const magicBall = await getMagicBall();
      magicBall.loadAnswers();
      magicBall.addNegativeAnswer('Никогда');
      expect(magicBall.answers.some((a) => a.text === 'Никогда' && a.type === 'negative')).toBe(
        true,
      );
    });

    it('should add a neutral answer', async () => {
      const magicBall = await getMagicBall();
      magicBall.loadAnswers();
      magicBall.addNeutralAnswer('Может быть');
      expect(magicBall.answers.some((a) => a.text === 'Может быть' && a.type === 'neutral')).toBe(
        true,
      );
    });
  });

  describe('delAnswer', () => {
    it('should delete answer by text', async () => {
      const magicBall = await getMagicBall();
      magicBall.loadAnswers();
      const text = magicBall.answers[0].text;
      magicBall.delAnswer(text);
      expect(magicBall.answers.some((a) => a.text === text)).toBe(false);
    });

    it('should delete answer by index (1-based)', async () => {
      const magicBall = await getMagicBall();
      magicBall.loadAnswers();
      const before = magicBall.answers.length;
      magicBall.delAnswer(1);
      expect(magicBall.answers.length).toBe(before - 1);
    });
  });

  describe('getAnswer', () => {
    it('should return a random answer with text and type', async () => {
      const magicBall = await getMagicBall();
      magicBall.loadAnswers();
      const answer = magicBall.getAnswer();
      expect(answer).toHaveProperty('text');
      expect(answer).toHaveProperty('type');
      expect(['positive', 'neutral', 'negative']).toContain(answer.type);
    });
  });

  describe('language', () => {
    it('should switch to English', async () => {
      const magicBall = await getMagicBall();
      magicBall.loadAnswers();
      magicBall.setLangEN();
      expect(magicBall.isLangEN()).toBe(true);
      expect(magicBall.isLangRU()).toBe(false);
      // Check that answers are in English
      expect(magicBall.answers.some((a) => a.text === 'Yes')).toBe(true);
    });

    it('should switch to Russian', async () => {
      const magicBall = await getMagicBall();
      magicBall.loadAnswers();
      magicBall.setLangEN();
      magicBall.setLangRU();
      expect(magicBall.isLangRU()).toBe(true);
      expect(magicBall.answers.some((a) => a.text === 'Да')).toBe(true);
    });
  });

  describe('sortAnswers', () => {
    it('should sort: positive before neutral before negative', async () => {
      const magicBall = await getMagicBall();
      magicBall.loadAnswers();
      const answers = magicBall.answers;

      let lastType = 'positive';
      const order = { positive: 0, neutral: 1, negative: 2 };
      for (const a of answers) {
        expect(order[a.type]).toBeGreaterThanOrEqual(order[lastType as keyof typeof order]);
        lastType = a.type;
      }
    });
  });

  describe('saveAnswers / loadAnswers persistence', () => {
    it('should persist and restore custom answers', async () => {
      const magicBall = await getMagicBall();
      magicBall.loadAnswers();
      magicBall.addPositiveAnswer('Мой кастомный ответ');
      magicBall.saveAnswers();

      // Load again in new instance
      const magicBall2 = await getMagicBall();
      magicBall2.loadAnswers();
      expect(magicBall2.answers.some((a) => a.text === 'Мой кастомный ответ')).toBe(true);
    });
  });

  describe('setDefaults', () => {
    it('should reset to 20 default answers', async () => {
      const magicBall = await getMagicBall();
      magicBall.loadAnswers();
      magicBall.addPositiveAnswer('extra1');
      magicBall.addPositiveAnswer('extra2');
      expect(magicBall.answers.length).toBe(22);

      magicBall.setDefaults();
      expect(magicBall.answers.length).toBe(20);
    });
  });
});
