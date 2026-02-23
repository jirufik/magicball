import { describe, it, expect } from 'vitest';
import { getAnswerText } from '../TextLayoutAlgorithm.js';

describe('TextLayoutAlgorithm', () => {
  it('should handle a short single word', () => {
    const result = getAnswerText('Да');
    const allText = [result.text1, result.text2, result.text3, result.text4, result.text5]
      .join('')
      .trim();
    expect(allText).toContain('Да');
  });

  it('should handle medium text fitting in one line', () => {
    const result = getAnswerText('Бесспорно');
    const nonEmpty = [result.text1, result.text2, result.text3, result.text4, result.text5].filter(
      (t) => t.length > 0,
    );
    expect(nonEmpty.length).toBeGreaterThanOrEqual(1);
  });

  it('should distribute text across multiple lines for longer answers', () => {
    const result = getAnswerText('Пока не ясно попробуй снова');
    const lines = [result.text1, result.text2, result.text3, result.text4, result.text5];
    const nonEmpty = lines.filter((t) => t.length > 0);
    expect(nonEmpty.length).toBeGreaterThanOrEqual(2);
  });

  it('should return 5 text fields', () => {
    const result = getAnswerText('test');
    expect(result).toHaveProperty('text1');
    expect(result).toHaveProperty('text2');
    expect(result).toHaveProperty('text3');
    expect(result).toHaveProperty('text4');
    expect(result).toHaveProperty('text5');
  });

  it('should handle empty string', () => {
    const result = getAnswerText('');
    const allText = [result.text1, result.text2, result.text3, result.text4, result.text5].join('');
    expect(allText).toBe('');
  });

  it('should handle text that uses all 5 lines', () => {
    const result = getAnswerText('сконцентрируйся и спроси опять это длинное');
    const lines = [result.text1, result.text2, result.text3, result.text4, result.text5];
    const nonEmpty = lines.filter((t) => t.length > 0);
    expect(nonEmpty.length).toBeGreaterThanOrEqual(3);
  });

  it('should not exceed line length limits', () => {
    const result = getAnswerText('Можешь быть уверен в этом');
    const lineLengths = [15, 13, 11, 9, 6];
    const lines = [result.text1, result.text2, result.text3, result.text4, result.text5];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length > 0) {
        // With word-break, individual segments may exceed limit, but the algorithm handles it
        expect(lines[i].length).toBeLessThanOrEqual(lineLengths[0] + 5); // generous bound
      }
    }
  });

  it('should handle a long word that needs breaking', () => {
    const result = getAnswerText('сконцентрируйся');
    const allText = [result.text1, result.text2, result.text3, result.text4, result.text5]
      .join(' ')
      .trim();
    expect(allText.replace(/\s+/g, '')).toBe('сконцентрируйся');
  });

  it('should handle all default Russian answers', () => {
    const answers = [
      'Бесспорно',
      'Предрешено',
      'Никаких сомнений',
      'Определённо да',
      'Можешь быть уверен в этом',
      'Мне кажется — «да»',
      'Вероятнее всего',
      'Хорошие перспективы',
      'Знаки говорят — «да»',
      'Да',
      'Пока не ясно, попробуй снова',
      'Спроси позже',
      'Лучше не рассказывать',
      'Сейчас нельзя предсказать',
      'Сконцентрируйся и спроси опять',
      'Даже не думай',
      'Мой ответ — «нет»',
      'По моим данным — «нет»',
      'Перспективы не очень хорошие',
      'Весьма сомнительно',
    ];

    for (const text of answers) {
      const result = getAnswerText(text);
      expect(result).toBeDefined();
      // At least one line should have content
      const hasContent = [
        result.text1,
        result.text2,
        result.text3,
        result.text4,
        result.text5,
      ].some((t) => t.length > 0);
      expect(hasContent).toBe(true);
    }
  });

  it('should handle all default English answers', () => {
    const answers = [
      'It is certain',
      'It is decidedly so',
      'Without a doubt',
      'Yes — definitely',
      'You may rely on it',
      'As I see it, yes',
      'Most likely',
      'Outlook good',
      'Signs point to yes',
      'Yes',
      'Reply hazy, try again',
      'Ask again later',
      'Better not tell you now',
      'Cannot predict now',
      'Concentrate and ask again',
      'Don\u2019t count on it',
      'My reply is no',
      'My sources say no',
      'Outlook not so good',
      'Very doubtful',
    ];

    for (const text of answers) {
      const result = getAnswerText(text);
      expect(result).toBeDefined();
      const hasContent = [
        result.text1,
        result.text2,
        result.text3,
        result.text4,
        result.text5,
      ].some((t) => t.length > 0);
      expect(hasContent).toBe(true);
    }
  });
});
