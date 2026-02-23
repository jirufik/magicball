export type AnswerType = 'positive' | 'neutral' | 'negative';

export type Language = 'ru' | 'en';

export interface Answer {
  text: string;
  type: AnswerType;
}

export interface BilingualAnswer {
  ru: string;
  en: string;
  type: AnswerType;
}

export interface AnimationFrame {
  moveByX: number;
  moveByY: number;
  duration: number;
}

export interface TextLayoutResult {
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  text5: string;
}
