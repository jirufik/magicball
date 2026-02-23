# План модернизации Magic Ball — Детальная реализация

## Обзор проекта

- **Файлов кода:** 8 (серверных: 4, клиентских: 6)
- **Строк кода:** ~1800 (app.js: 49, www: 91, magicBall.js: 381, stateBoot.js: 28, statePreload.js: 48, stateMagicBall.js: 751, stateSettings.js: 448, main.js: 22)
- **Ассеты:** 28 PNG, 2 MP3
- **Phaser:** v2.6.2 → нужна миграция на v3
- **Ветка:** `modernize`

---

## Фаза 1: Инфраструктура и инструменты (3–4 дня)

### 1.1 Обновить package.json

**Файл:** `package.json` (18 строк)

**Удалить зависимости:**
- `body-parser` ~1.16.0 — встроен в Express с 4.16+
- `serve-favicon` ~2.3.2 — можно обслуживать через static middleware

**Обновить зависимости:**
```
express:       ~4.14.1  → ^4.21.0
cookie-parser: ~1.4.3   → ^1.4.7
debug:         ~2.6.0   → ^4.3.7
morgan:        ~1.7.0   → ^1.10.0
pug:           ~2.0.0-beta10 → ^3.0.3
```

**Добавить зависимости:**
```json
"devDependencies": {
  "phaser": "^3.80.0",
  "vite": "^6.0.0",
  "typescript": "^5.7.0",
  "vitest": "^3.0.0",
  "@types/express": "^5.0.0",
  "@types/node": "^22.0.0",
  "eslint": "^9.0.0",
  "prettier": "^3.4.0",
  "nodemon": "^3.1.0",
  "concurrently": "^9.1.0"
}
```

**Добавить в package.json:**
```json
"type": "module",
"engines": { "node": ">=18.0.0" },
"scripts": {
  "dev": "concurrently \"npm run server:dev\" \"npm run client:dev\"",
  "server:dev": "nodemon ./src/server/bin/www.js",
  "client:dev": "vite",
  "build": "vite build",
  "start": "node ./src/server/bin/www.js",
  "lint": "eslint src/",
  "format": "prettier --write src/",
  "test": "vitest",
  "type-check": "tsc --noEmit"
}
```

### 1.2 Создать tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "baseUrl": "./src",
    "paths": {
      "@client/*": ["client/*"],
      "@server/*": ["server/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "public"]
}
```

### 1.3 Создать vite.config.ts

```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src/client',
  publicDir: '../../public',
  build: {
    outDir: '../../dist/client',
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src/client') }
  },
  server: {
    proxy: { '/': 'http://localhost:4001' }
  }
});
```

### 1.4 Реорганизовать структуру каталогов

```
magicball/
├── src/
│   ├── client/
│   │   ├── index.ts                    ← из main.js (22 строки)
│   │   ├── config/
│   │   │   ├── gameConfig.ts           ← константы из всех файлов
│   │   │   └── assetManifest.ts        ← список ассетов из statePreload.js
│   │   ├── scenes/
│   │   │   ├── BootScene.ts            ← из stateBoot.js (28 строк)
│   │   │   ├── PreloadScene.ts         ← из statePreload.js (48 строк)
│   │   │   ├── MagicBallScene.ts       ← из stateMagicBall.js (751 строка)
│   │   │   └── SettingsScene.ts        ← из stateSettings.js (448 строк)
│   │   ├── services/
│   │   │   ├── MagicBallService.ts     ← из magicBall.js (381 строка)
│   │   │   └── StorageService.ts       ← localStorage логика из magicBall.js
│   │   ├── animations/
│   │   │   └── AnimationController.ts  ← из stateMagicBall.js функции анимации
│   │   ├── utils/
│   │   │   └── TextLayoutAlgorithm.ts  ← из stateMagicBall.js:245-459
│   │   └── types/
│   │       └── index.ts                ← TypeScript интерфейсы
│   └── server/
│       ├── app.ts                      ← из app.js (49 строк)
│       ├── bin/
│       │   └── www.ts                  ← из bin/www (91 строка)
│       └── routes/
│           └── index.ts                ← из routes/index.js (10 строк)
├── public/
│   ├── images/                         ← 28 PNG (без изменений)
│   └── sounds/                         ← 2 MP3 (без изменений)
├── views/
│   ├── layout.pug                      ← обновить
│   ├── index.pug                       ← обновить (убрать старые скрипты)
│   └── error.pug                       ← без изменений
├── dist/                               ← сборка
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .gitignore                          ← добавить dist/, node_modules/
```

### 1.5 Удалить из репозитория vendor-файлы

Удалить (после настройки npm-зависимостей):
- `public/javascripts/phaser.min.js` (~791KB)
- `public/javascripts/phaser-input.min.js` (Fabrique плагин, не поддерживается)
- `public/javascripts/underscore-min.js` (~27KB)

Эти библиотеки будут установлены через npm и собраны через Vite.

---

## Фаза 2: Модернизация серверной части (2–3 дня)

### 2.1 Конвертировать app.js → src/server/app.ts

**Текущий файл:** `app.js` (49 строк)

| Строка | Что менять | Как |
|---|---|---|
| 1–9 | `var` + `require()` | `import` + `const` |
| 11 | `var app = express()` | `const app: Express = express()` |
| 20–21 | `bodyParser.json()` и `.urlencoded()` | `express.json()` и `express.urlencoded()` |
| 25–28 | Множественные маршруты к одному обработчику | Оставить, но использовать router |
| 31–35 | `var err`, anonymous function | `const err`, arrow function |
| 38–46 | `var`, anonymous function | `const`, arrow function, типизация |
| 48 | `module.exports` | `export default` |

**Результат:**
```typescript
import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));

app.use('/', indexRouter);
app.use('/magicball', indexRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error('Not Found') as any;
  err.status = 404;
  next(err);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).render('error');
});

export default app;
```

### 2.2 Конвертировать bin/www → src/server/bin/www.ts

**Текущий файл:** `bin/www` (91 строка)

| Строки | Что менять |
|---|---|
| 7–9 | `var` + `require()` → `import` + `const` |
| 15 | `var port` → `const port` |
| 22 | `var server` → `const server` |
| 37–50 | `normalizePort()`: `var` → `const` |
| 56–78 | `onError()`: `var` → `const`, типизация |
| 84–90 | `onListening()`: `var` → `const` |

### 2.3 Конвертировать routes/index.js

**Текущий файл:** 10 строк

```typescript
import { Router, type Request, type Response } from 'express';
const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Magic Ball' });
});

export default router;
```

### 2.4 Удалить routes/users.js

Файл не используется (заглушка).

### 2.5 Обновить views/index.pug

**Текущий файл:** 48 строк — содержит 9 тегов `<script>`, аналитику Яндекс.Метрики.

**Убрать:**
- Все теги `<script>` с vendor-библиотеками (строки 9–14)
- Теги `<script>` с пользовательскими файлами (main.js, state*.js, magicBall.js)

**Добавить:**
- `<meta name="viewport" ...>` для мобильных
- `<script type="module" src="/dist/client/index.js">` — один бандл от Vite
- Аналитику вынести в отдельный файл или удалить

### 2.6 Обновить views/layout.pug

**Текущий файл:** 8 строк — минимальный шаблон.

Добавить:
```pug
meta(charset="UTF-8")
meta(name="viewport" content="width=device-width, initial-scale=1.0")
meta(name="description" content="Magic 8-Ball — интерактивный гадательный шар")
```

---

## Фаза 3: Типы и сервис ответов (2–3 дня)

### 3.1 Создать src/client/types/index.ts

```typescript
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
  lines: string[];  // 5 строк текста
}
```

### 3.2 Конвертировать magicBall.js → src/client/services/MagicBallService.ts

**Текущий файл:** `magicBall.js` (381 строка), IIFE-модуль.

**Посторочный план:**

| Строки | Содержимое | Действие |
|---|---|---|
| 1–6 | IIFE обёртка `var magicBall = (function(){` | Убрать, заменить на `export class` |
| 9–13 | Константы TYPE_POSITIVE и т.д. | Перенести в `AnswerType` enum |
| 14–15 | Константы LANG_RU, LANG_EN | Перенести в `Language` type |
| 17 | `var lang = LANG_RU` | `private language: Language = 'ru'` |
| 19 | `var answers = []` | `private answers: Answer[] = []` |
| 28–39 | `addAnswer(text, type)` — создаёт объект с методами | Упростить: объект без методов, тип через поле |
| 41–51 | `addPositiveAnswer`, `addNegativeAnswer`, `addNeutralAnswer` | Обёртки → сохранить как методы класса |
| 54–56 | `delAllAnswers()` | `clearAnswers()` |
| 59–89 | `delAnswer(value)` — удаление по числу/строке/объекту | Упростить: удаление по индексу или тексту |
| 81 | `_.isEqual(answer, value)` | `JSON.stringify(a) === JSON.stringify(b)` |
| 92–121 | `sortAnswers()` + `sortAnswer()` | Заменить на `.sort()` с компаратором |
| 124–143 | `isPositiveAnswer()`, `isNeutralAnswer()`, `isNegativeAnswer()` | Утилитарные функции или проверка `answer.type === 'positive'` |
| 146–149 | `getAnswer()` — `_.random(answers.length - 1)` | `Math.floor(Math.random() * this.answers.length)` |
| 152–171 | Функции смены/проверки языка | Методы класса |
| 174–309 | `setDefaults()` — 135 строк хардкода 20 ответов | Вынести в `src/client/config/defaultAnswers.ts` |
| 312–315 | `saveAnswers()` — `localStorage.setItem(...)` | Делегировать в `StorageService` |
| 317–356 | `loadAnswers()` — `localStorage.getItem(...)`, `_.isEmpty()` на стр. 335 | Делегировать в `StorageService`, убрать underscore |
| 361–376 | Возвращаемый API объект | Не нужен — методы класса экспортируются автоматически |
| 379–381 | Закрытие IIFE | Убрать |

**Зависимости от Underscore.js для удаления:**
- Строка 81: `_.isEqual()` → `JSON.stringify()`
- Строка 147: `_.random()` → `Math.floor(Math.random() * n)`
- Строка 335: `_.isEmpty()` → `arr.length === 0` или `Object.keys(obj).length === 0`

### 3.3 Создать src/client/services/StorageService.ts

Извлечь логику localStorage из magicBall.js строки 312–356.

```typescript
const STORAGE_KEYS = {
  ANSWERS: 'magicBallAnswers',
  LANGUAGE: 'magicBallLang'
} as const;

export class StorageService {
  static saveAnswers(answers: Answer[], language: Language): void { ... }
  static loadAnswers(): { answers: Answer[]; language: Language } | null { ... }
  static clear(): void { ... }
}
```

### 3.4 Создать src/client/config/defaultAnswers.ts

Извлечь 20 ответов из magicBall.js строки 180–301 в типизированный массив `BilingualAnswer[]`.

---

## Фаза 4: Миграция Phaser v2 → v3, сцены (5–7 дней)

### 4.1 Создать src/client/config/gameConfig.ts

Собрать все магические числа из всех файлов:

```typescript
export const GAME = {
  WIDTH: 750,                   // main.js:3
  HEIGHT: 1334,                 // main.js:3
  PRELOAD_DELAY: 2000,          // statePreload.js:45
} as const;

export const BALL_ANIMATION = {
  SCALE_DURATION: 2000,         // stateMagicBall.js:60
  ALPHA_DURATION: 1000,         // stateMagicBall.js:61
  ANSWER_DURATION: 3000,        // stateMagicBall.js:96
  FINAL_SCALE: 4.2,             // stateMagicBall.js:486
  FINAL_DURATION: 5000,         // stateMagicBall.js:486
  FRAMES: [                     // stateMagicBall.js:65-75
    { moveByX: 40, moveByY: 0, duration: 200 },
    { moveByX: -40, moveByY: 0, duration: 100 },
    { moveByX: 38, moveByY: 12, duration: 200 },
    { moveByX: -35, moveByY: 8, duration: 100 },
    { moveByX: 18, moveByY: 40, duration: 200 },
    { moveByX: -20, moveByY: -40, duration: 200 },
    { moveByX: 14, moveByY: 40, duration: 200 },
    { moveByX: -10, moveByY: -40, duration: 100 },
    { moveByX: 0, moveByY: 0, duration: 100 }
  ]
} as const;

export const PHYSICS = {
  SKULL_SPEED: 10,              // stateMagicBall.js:551
  SPIDER_BOUNCE: 0.4,           // stateMagicBall.js:607
  SPIDER_GRAVITY: -170,         // stateMagicBall.js:608
} as const;

export const SETTINGS_UI = {
  TOP_BOUNDARY: 170,            // stateSettings.js:13,409
  BOTTOM_BOUNDARY: 964,         // stateSettings.js:425
  ANSWER_HEIGHT: 220,           // stateSettings.js:152
  SCROLL_STEP: 10,              // stateSettings.js:393
  INPUT_MAX_LENGTH: 45,         // stateSettings.js:305
} as const;
```

### 4.2 Создать src/client/config/assetManifest.ts

Извлечь из statePreload.js строки 12–38:

```typescript
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
} as const;

export const SPRITESHEETS = {
  LANG: { key: 'langS', path: 'images/lang.png', frameWidth: 150, frameHeight: 150 },
  SPIDER: { key: 'spiderS', path: 'images/spider.png', frameWidth: 111, frameHeight: 68 },
  SKULL: { key: 'skullS', path: 'images/skullAnimation.png', frameWidth: 122, frameHeight: 304 },
  ANSWER_TXT: { key: 'answertxtS', path: 'images/answertxt.png', frameWidth: 710, frameHeight: 200 },
  POSITIVE: { key: 'positiveS', path: 'images/positive.png', frameWidth: 170, frameHeight: 170 },
  NEUTRAL: { key: 'neutralS', path: 'images/neutral.png', frameWidth: 170, frameHeight: 170 },
  NEGATIVE: { key: 'negativeS', path: 'images/negative.png', frameWidth: 170, frameHeight: 170 },
} as const;

export const AUDIO = {
  KNOCK: { key: 'knockA', path: 'sounds/tuk.mp3' },
  ANSWER: { key: 'answerA', path: 'sounds/sound.mp3' },
} as const;
```

### 4.3 Конвертировать stateBoot.js → src/client/scenes/BootScene.ts

**Текущий файл:** 28 строк, прототип.

Таблица замен Phaser API:

| Строка | Phaser v2 | Phaser v3 |
|---|---|---|
| 8 | `this.load.image('logoS', ...)` | `this.load.image('logoS', ...)` (без изменений) |
| 13 | `this.game.stage.backgroundColor = '#FFF'` | `this.cameras.main.setBackgroundColor('#FFF')` |
| 16 | `this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL` | `Phaser.Scale.FIT` в конфиге |
| 23 | `this.scale.pageAlignHorizontally = true` | `Phaser.Scale.CENTER_BOTH` в конфиге |
| 25 | `this.game.state.start('statePreload')` | `this.scene.start('Preload')` |

### 4.4 Конвертировать statePreload.js → src/client/scenes/PreloadScene.ts

**Текущий файл:** 48 строк, прототип.

| Строка | Phaser v2 | Phaser v3 |
|---|---|---|
| 9 | `this.splash = this.add.sprite(...)` | `this.add.image(...)` |
| 10 | `this.splash.anchor.setTo(0.5, 0.5)` | `.setOrigin(0.5, 0.5)` |
| 12–28 | `this.load.image(...)` | Без изменений |
| 30–36 | `this.load.spritesheet(key, path, w, h)` | `this.load.spritesheet(key, path, { frameWidth, frameHeight })` |
| 37–38 | `this.load.audio(...)` | Без изменений |
| 45 | `setTimeout(() => this.game.state.start(...))` | `this.time.delayedCall(2000, () => this.scene.start('MagicBall'))` |

### 4.5 Конвертировать stateMagicBall.js → src/client/scenes/MagicBallScene.ts

**Текущий файл:** 751 строк — самый большой файл. Разбиваем на сцену + вспомогательные модули.

#### Декомпозиция по функциям:

**Остаётся в MagicBallScene.ts (~250 строк):**
- `create()` (строки 7–23) → метод сцены
- `update()` (строки 25–35) → метод сцены
- `showBall()` (строки 38–102) → приватный метод
- `showAnswer()` — вызывает TextLayoutAlgorithm
- `clickAbout()` (строки 706–715) → приватный метод
- `clickSettings()` (строки 731–740) → приватный метод
- `createAbout()`, `createSettings()` → приватные методы

**Выносится в src/client/animations/AnimationController.ts (~150 строк):**
- `scaleSprites()` (строки 106–123) — 4 вызова `game.add.tween()`
- `rotateSprites()` (строки 126–145) — 4 вызова `game.add.tween()`
- `alphaSprites()` (строки 148–165) — 4 вызова `game.add.tween()`
- `moveSprites()` (строки 168–200) — рекурсивная цепочка анимаций
- `sizeFontTxt()` (строки 509–526) — анимация размера текста

Замены Phaser API в анимациях:

| Phaser v2 | Phaser v3 |
|---|---|
| `this.game.add.tween(sprite.scale).to({x, y}, ms, Easing, true)` | `this.tweens.add({ targets: sprite, scaleX, scaleY, duration })` |
| `tween.onComplete.add(fn, context)` | `onComplete: fn` в конфиге tweens |
| `Phaser.Easing.Linear.None` | `'Linear'` |

**Выносится в src/client/utils/TextLayoutAlgorithm.ts (~200 строк):**
- Функция `getAnswerText()` (строки 245–459) — 214 строк сложного алгоритма разбиения текста на 5 строк
- Внутренняя функция `makeText()` (строки 391–457)
- Это чистая логика без зависимости от Phaser — легко выносится

**Выносится в src/client/scenes/entities/SkullEntity.ts (~80 строк):**
- `showSkull()` (строки 530–543) — создание спрайта с физикой
- `skullGoToPoint()` (строки 545–561) — движение к курсору/случайной точке
- Замены `_.random()` на строках 551, 556, 557 → `Phaser.Math.Between()`

**Выносится в src/client/scenes/entities/SpiderEntity.ts (~80 строк):**
- `showSpider()` (строки 601–616) — создание спрайта с физикой
- `collideSpider()` (строки 618–649) — обработка столкновений
- `moveSpider()` (строки 651–663) — реакция на столкновение
- `upSpider()` (строки 665–671) — возврат к паутине

**Выносится в src/client/scenes/entities/CloudEntity.ts (~50 строк):**
- `showCloud()` (строки 565–575)
- `moveCloud()` (строки 577–597) — замены `_.random()` на строках 580, 581, 589, 590

#### Таблица замен Phaser API для всей сцены:

| Строка | Phaser v2 | Phaser v3 |
|---|---|---|
| 8 | `this.game.physics.startSystem(Phaser.Physics.ARCADE)` | `physics: { default: 'arcade' }` в конфиге |
| 9 | `this.game.add.sprite(0, 0, 'backgroundS')` | `this.add.sprite(0, 0, 'backgroundS').setOrigin(0,0)` |
| 12 | `this.game.world.centerX` | `this.cameras.main.centerX` |
| 14 | `this.game.add.audio('knockA')` | `this.sound.add('knockA')` |
| 26 | `this.game.input.activePointer.justPressed()` | `this.input.activePointer.isDown` |
| 534 | `this.game.add.sprite(...); .animations.add(...)` | `this.add.sprite(...); this.anims.create(...)` |
| 536 | `this.game.physics.enable(sprite, Phaser.Physics.ARCADE)` | `this.physics.add.existing(sprite)` |
| 551 | `this.game.physics.arcade.moveToPointer(...)` | `this.physics.moveToObject(sprite, pointer, speed)` |
| 618 | `this.game.physics.arcade.collide(...)` | `this.physics.add.collider(...)` |
| 659 | `this.game.time.events.add(Phaser.Timer.SECOND * 2, ...)` | `this.time.delayedCall(2000, ...)` |
| 676 | `sprite.inputEnabled = true; sprite.events.onInputDown.add(...)` | `sprite.setInteractive(); sprite.on('pointerdown', ...)` |
| 727 | `this.game.state.start('stateSettings')` | `this.scene.start('Settings')` |

#### Замены Underscore.js (11 вызовов):

| Строка | Underscore | Замена |
|---|---|---|
| 551 | `_.random(1200, 3000)` | `Phaser.Math.Between(1200, 3000)` |
| 556 | `_.random(10, 740)` | `Phaser.Math.Between(10, 740)` |
| 557 | `_.random(10, 1320)` | `Phaser.Math.Between(10, 1320)` |
| 580 | `_.random(5, 12) / 10` | `Phaser.Math.Between(5, 12) / 10` |
| 581 | `_.random(90, 300)` | `Phaser.Math.Between(90, 300)` |
| 583 | `_.random(25000, 40000)` | `Phaser.Math.Between(25000, 40000)` |
| 589 | `_.random(5, 12) / 10` | `Phaser.Math.Between(5, 12) / 10` |
| 590 | `_.random(130, 350)` | `Phaser.Math.Between(130, 350)` |
| 592 | `_.random(20000, 30000)` | `Phaser.Math.Between(20000, 30000)` |

### 4.6 Конвертировать stateSettings.js → src/client/scenes/SettingsScene.ts

**Текущий файл:** 448 строк, прототип.

#### Замены Phaser API:

| Строка | Phaser v2 | Phaser v3 |
|---|---|---|
| 30–64 | `sprite.inputEnabled = true; sprite.events.onInputDown/Up.add(fn)` | `sprite.setInteractive(); sprite.on('pointerdown'/'pointerup', fn)` |
| 72–76 | `this.game.world.bringToTop(sprite)` | `this.children.bringToTop(sprite)` |
| 101 | `this.game.state.start('stateMagicBall')` | `this.scene.start('MagicBall')` |
| 121 | `this.game.add.sprite(...)` | `this.add.sprite(...)` |
| 122 | `sprite.input.enableDrag()` | `this.input.setDraggable(sprite)` + `sprite.on('drag', ...)` |
| 135 | `this.game.make.text(...)` → child | `this.add.text(...)` с позиционированием |
| 145 | `this.game.make.sprite(...)` → child | `this.add.sprite(...)` с позиционированием |
| 228 | `sprite.input.disableDrag()` | `this.input.setDraggable(sprite, false)` |
| 295–312 | `this.game.add.inputField(...)` (Fabrique плагин) | HTML `<input>` через `this.add.dom(...)` |

**Критическая замена: Fabrique InputField плагин (строки 295–318)**

Плагин `phaser-input` не поддерживается в Phaser 3. Варианты замены:
1. **Рекомендуемый:** Phaser 3 DOM Element — `this.add.dom(x, y, 'input', styles)`
2. Альтернатива: rexUI плагин для Phaser 3

```typescript
// Вместо строк 295-312:
const inputElement = document.createElement('input');
inputElement.type = 'text';
inputElement.maxLength = 45;
inputElement.placeholder = 'Введите ответ';
inputElement.style.cssText = 'font-size:32px; width:685px; text-align:center;';
const domInput = this.add.dom(375, 200, inputElement);
```

### 4.7 Конвертировать main.js → src/client/index.ts

**Текущий файл:** 22 строки — инициализация Phaser.

```typescript
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MagicBallScene } from './scenes/MagicBallScene';
import { SettingsScene } from './scenes/SettingsScene';
import { GAME } from './config/gameConfig';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME.WIDTH,
  height: GAME.HEIGHT,
  parent: 'magicball',
  backgroundColor: '#ffffff',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false }
  },
  dom: { createContainer: true },  // для input в Settings
  scene: [BootScene, PreloadScene, MagicBallScene, SettingsScene]
};

new Phaser.Game(config);
```

---

## Фаза 5: Тестирование (2–3 дня)

### 5.1 Тесты для MagicBallService

**Файл:** `src/client/services/__tests__/MagicBallService.test.ts`

```
Тесты:
- Инициализация с ответами по умолчанию (20 штук)
- addPositiveAnswer() — добавляет ответ, сортирует
- addNegativeAnswer() — добавляет ответ, сортирует
- addNeutralAnswer() — добавляет ответ, сортирует
- deleteAnswer() — удаляет по тексту
- deleteAnswer() — не удаляет последний ответ
- getAnswer() — возвращает случайный ответ с полями text и type
- setLanguage('en') — загружает английские ответы
- setLanguage('ru') — загружает русские ответы
- saveAnswers()/loadAnswers() — сохранение и восстановление из localStorage
- loadAnswers() — fallback на defaults при ошибке localStorage
- sortAnswers() — positive перед neutral перед negative
```

### 5.2 Тесты для TextLayoutAlgorithm

**Файл:** `src/client/utils/__tests__/TextLayoutAlgorithm.test.ts`

```
Тесты:
- Короткий текст (1 слово) — помещается в одну строку
- Средний текст — распределяется по 5 строкам
- Длинное слово — переносится с разбиением
- Пустая строка — возвращает пустые строки
- Максимально длинный текст — не выходит за лимиты строк
```

### 5.3 Тесты для StorageService

```
Тесты:
- Сохранение и чтение ответов
- Обработка ошибки QuotaExceededError
- Обработка невалидного JSON при чтении
- Очистка хранилища
```

### 5.4 Тесты для серверной части (Supertest)

```
Тесты:
- GET / — возвращает 200 и рендерит index
- GET /magicball — возвращает 200
- GET /несуществующий — возвращает 404
```

---

## Фаза 6: Стили и PWA (1–2 дня)

### 6.1 Обновить style.css

**Текущий файл:** 9 строк — минимальный стиль.

Добавить:
- CSS-переменные для цветов
- `box-sizing: border-box`
- Сброс отступов для `#magicball`
- `100vh` для полноэкранного холста
- Медиа-запрос `prefers-reduced-motion`

### 6.2 PWA (опционально)

- Создать `public/manifest.json`
- Создать `public/sw.js` (Service Worker для кэширования ассетов)
- Добавить `<link rel="manifest">` в layout.pug

---

## Фаза 7: Финализация (1–2 дня)

### 7.1 ESLint + Prettier

Создать конфигурации для линтинга и форматирования.

### 7.2 Обновить .gitignore

Добавить: `dist/`, `node_modules/`, `.env`

### 7.3 Проверка работоспособности

1. `npm install`
2. `npm run build` — сборка проходит без ошибок
3. `npm run dev` — игра работает
4. `npm test` — все тесты проходят
5. `npm run lint` — нет ошибок
6. Проверить: шар отвечает на клик, настройки работают, язык переключается, ответы сохраняются

### 7.4 Удалить старые файлы

После успешной миграции удалить:
- `public/javascripts/` (весь каталог)
- Старые `app.js`, `bin/www`, `routes/`

---

## Сводная таблица трудозатрат

| Фаза | Задачи | Дни |
|---|---|---|
| 1. Инфраструктура | package.json, tsconfig, vite, структура, удаление vendor | 3–4 |
| 2. Серверная часть | app.ts, www.ts, routes, views | 2–3 |
| 3. Типы и сервис | types, MagicBallService, StorageService, defaultAnswers | 2–3 |
| 4. Phaser миграция | 4 сцены + entities + animations + utils + index.ts | 5–7 |
| 5. Тестирование | Unit-тесты для сервисов, утилит, сервера | 2–3 |
| 6. Стили и PWA | CSS, manifest, service worker | 1–2 |
| 7. Финализация | Lint, проверка, удаление старого | 1–2 |
| **Итого** | | **16–24 дня (~4–5 недель)** |

---

## Чеклист готовности

- [ ] package.json обновлён, `npm install` работает
- [ ] TypeScript компилируется без ошибок
- [ ] Vite собирает клиентский бандл
- [ ] Сервер запускается на порту 4001
- [ ] Все 4 сцены Phaser 3 работают (Boot → Preload → MagicBall → Settings)
- [ ] Шар реагирует на клик и показывает случайный ответ
- [ ] Анимации шара, черепа, паука, облаков работают
- [ ] Настройки: добавление/удаление ответов, смена языка, сброс
- [ ] localStorage сохраняет и восстанавливает ответы
- [ ] Vendor-файлы удалены из репозитория
- [ ] Underscore.js полностью удалена (0 вызовов)
- [ ] Fabrique InputField заменён на DOM input
- [ ] Все тесты проходят
- [ ] ESLint не показывает ошибок
- [ ] Нет использования `var` (только `const`/`let`)
- [ ] Нет prototype-паттернов (только ES6 классы)
