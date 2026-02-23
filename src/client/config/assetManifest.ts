export const IMAGES = {
  LOGO: { key: 'logoS', path: 'images/logo.png' },
  BACKGROUND: { key: 'backgroundS', path: 'images/background.png' },
  MAGICBALL: { key: 'magicballS', path: 'images/magicball.png' },
  WALL: { key: 'wallS', path: 'images/wall.png' },
  ANSWER: { key: 'answerS', path: 'images/answer.png' },
  CLOUD1: { key: 'cloud1S', path: 'images/cloud1.png' },
  CLOUD2: { key: 'cloud2S', path: 'images/cloud2.png' },
  WEB: { key: 'webS', path: 'images/web.png' },
  ABOUT: { key: 'aboutS', path: 'images/about.png' },
  SETTINGS: { key: 'settingsS', path: 'images/settings.png' },
  ADD_ANSWER: { key: 'addanswerS', path: 'images/addanswer.png' },
  UP: { key: 'upS', path: 'images/up.png' },
  DOWN: { key: 'downS', path: 'images/down.png' },
  RESET: { key: 'resetS', path: 'images/reset.png' },
  BACK: { key: 'backS', path: 'images/back.png' },
  BTN_PANEL: { key: 'btnpanelS', path: 'images/btnpanel.png' },
  DEL: { key: 'delS', path: 'images/del.png' },
  INPUT: { key: 'inputS', path: 'images/input.png' },
  CANCEL: { key: 'cancelS', path: 'images/cancel.png' },
  PAGE404: { key: 'page404S', path: 'images/page404.png' },
} as const;

export const SPRITESHEETS = {
  LANG: { key: 'langS', path: 'images/lang.png', frameWidth: 150, frameHeight: 150 },
  SPIDER: { key: 'spiderS', path: 'images/spider.png', frameWidth: 111, frameHeight: 68 },
  SKULL: { key: 'skullS', path: 'images/skullAnimation.png', frameWidth: 122, frameHeight: 304 },
  ANSWER_TXT: {
    key: 'answertxtS',
    path: 'images/answertxt.png',
    frameWidth: 710,
    frameHeight: 200,
  },
  POSITIVE: { key: 'positiveS', path: 'images/positive.png', frameWidth: 170, frameHeight: 170 },
  NEUTRAL: { key: 'neutralS', path: 'images/neutral.png', frameWidth: 170, frameHeight: 170 },
  NEGATIVE: { key: 'negativeS', path: 'images/negative.png', frameWidth: 170, frameHeight: 170 },
} as const;

export const AUDIO = {
  KNOCK: { key: 'knockA', path: 'sounds/tuk.mp3' },
  ANSWER: { key: 'answerA', path: 'sounds/sound.mp3' },
} as const;
