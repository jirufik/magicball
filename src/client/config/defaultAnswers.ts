import type { BilingualAnswer } from '../types/index.js';

export const DEFAULT_ANSWERS: BilingualAnswer[] = [
  // Positive (10)
  { ru: 'Бесспорно', en: 'It is certain', type: 'positive' },
  { ru: 'Предрешено', en: 'It is decidedly so', type: 'positive' },
  { ru: 'Никаких сомнений', en: 'Without a doubt', type: 'positive' },
  { ru: 'Определённо да', en: 'Yes — definitely', type: 'positive' },
  { ru: 'Можешь быть уверен в этом', en: 'You may rely on it', type: 'positive' },
  { ru: 'Мне кажется — «да»', en: 'As I see it, yes', type: 'positive' },
  { ru: 'Вероятнее всего', en: 'Most likely', type: 'positive' },
  { ru: 'Хорошие перспективы', en: 'Outlook good', type: 'positive' },
  { ru: 'Знаки говорят — «да»', en: 'Signs point to yes', type: 'positive' },
  { ru: 'Да', en: 'Yes', type: 'positive' },

  // Neutral (5)
  { ru: 'Пока не ясно, попробуй снова', en: 'Reply hazy, try again', type: 'neutral' },
  { ru: 'Спроси позже', en: 'Ask again later', type: 'neutral' },
  { ru: 'Лучше не рассказывать', en: 'Better not tell you now', type: 'neutral' },
  { ru: 'Сейчас нельзя предсказать', en: 'Cannot predict now', type: 'neutral' },
  { ru: 'Сконцентрируйся и спроси опять', en: 'Concentrate and ask again', type: 'neutral' },

  // Negative (5)
  { ru: 'Даже не думай', en: 'Don\u2019t count on it', type: 'negative' },
  { ru: 'Мой ответ — «нет»', en: 'My reply is no', type: 'negative' },
  { ru: 'По моим данным — «нет»', en: 'My sources say no', type: 'negative' },
  { ru: 'Перспективы не очень хорошие', en: 'Outlook not so good', type: 'negative' },
  { ru: 'Весьма сомнительно', en: 'Very doubtful', type: 'negative' },
];
