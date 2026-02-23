# Magic Ball

Веб-реализация классической игрушки «Магический шар 8» (Magic 8-Ball) — интерактивный гадательный шар, который даёт случайные ответы на вопросы пользователя.

[Demo](https://rufus.pro/magicball/) | [Wikipedia RU](https://ru.wikipedia.org/wiki/Magic_8_ball) | [Wikipedia EN](https://en.wikipedia.org/wiki/Magic_8-Ball)

---

## Стек технологий

| Компонент | Технология |
|---|---|
| Игровой движок | [Phaser 3](https://phaser.io/) |
| Язык | TypeScript 5 |
| Сборщик (клиент) | Vite 6 |
| Сервер | Node.js + Express 4 |
| Шаблонизатор | Pug 3 |
| Тесты | Vitest |
| Линтинг | ESLint 9 + Prettier |
| Контейнеризация | Docker |

---

## Архитектура

### Клиент — 4 сцены Phaser 3

```
Boot → Preload → MagicBall → Settings
```

1. **BootScene** — инициализация, загрузка лого
2. **PreloadScene** — загрузка всех ассетов (28 PNG, 7 спрайтшитов, 2 MP3)
3. **MagicBallScene** — основной экран: шар с анимацией ответа, череп (следит за курсором), паук на паутине, облака, панель «About»
4. **SettingsScene** — управление ответами: добавление/удаление, смена языка (RU/EN), сброс к дефолтным

### Сервер

Минимальный Express-сервер, отдаёт статику (собранный Vite-бандл, изображения, звуки) и рендерит HTML через Pug.

### Структура проекта

```
magicball/
├── src/
│   ├── client/
│   │   ├── index.ts                    # Точка входа, конфиг Phaser
│   │   ├── index.html                  # HTML для Vite dev server
│   │   ├── config/
│   │   │   ├── gameConfig.ts           # Константы игры (размеры, физика, анимации)
│   │   │   ├── assetManifest.ts        # Реестр всех ассетов
│   │   │   └── defaultAnswers.ts       # 20 двуязычных ответов по умолчанию
│   │   ├── scenes/
│   │   │   ├── BootScene.ts            # Инициализация
│   │   │   ├── PreloadScene.ts         # Загрузка ассетов
│   │   │   ├── MagicBallScene.ts       # Основная игровая сцена
│   │   │   └── SettingsScene.ts        # Настройки ответов
│   │   ├── services/
│   │   │   ├── MagicBallService.ts     # Логика ответов (add/delete/get/sort)
│   │   │   └── StorageService.ts       # Обёртка над localStorage
│   │   ├── animations/
│   │   │   └── AnimationController.ts  # Tween-анимации (scale, rotate, alpha, move)
│   │   ├── utils/
│   │   │   └── TextLayoutAlgorithm.ts  # Алгоритм разбиения текста на 5 строк
│   │   └── types/
│   │       └── index.ts                # TypeScript интерфейсы
│   └── server/
│       ├── app.ts                      # Конфигурация Express
│       ├── bin/
│       │   └── www.ts                  # Точка входа сервера (порт 4001)
│       └── routes/
│           └── index.ts                # Маршрут /
├── public/
│   ├── images/                         # 28 PNG-спрайтов
│   ├── sounds/                         # 2 MP3-файла
│   └── stylesheets/
│       └── style.css                   # Стили
├── views/
│   ├── layout.pug                      # Базовый шаблон
│   ├── index.pug                       # Главная страница
│   └── error.pug                       # Страница 404
├── package.json
├── tsconfig.json                       # TypeScript (общий)
├── tsconfig.server.json                # TypeScript (сервер)
├── vite.config.ts                      # Конфигурация Vite
├── vitest.config.ts                    # Конфигурация тестов
├── eslint.config.js                    # ESLint 9 flat config
├── .prettierrc                         # Prettier
├── Dockerfile                          # Multi-stage Docker build
└── docker-compose.yml                  # Docker Compose
```

---

## Запуск

### Требования

- Node.js >= 18
- npm

### Установка

```bash
npm install
```

### Разработка

```bash
npm run dev
```

Запускает параллельно:
- **Vite dev server** — горячая перезагрузка клиента
- **Nodemon** — автоперезапуск сервера при изменениях

### Продакшн-сборка

```bash
npm run build
npm start
```

Приложение будет доступно на http://localhost:4001

### Docker

```bash
docker compose up --build
```

Приложение будет доступно на http://localhost:4001

---

## Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Запуск в режиме разработки (Vite + Nodemon) |
| `npm run build` | Сборка сервера и клиента |
| `npm start` | Запуск продакшн-сервера |
| `npm test` | Запуск тестов (Vitest) |
| `npm run type-check` | Проверка типов TypeScript |
| `npm run lint` | Проверка ESLint |
| `npm run format` | Форматирование Prettier |

---

## Тесты

31 unit-тест в 3 файлах:

- **MagicBallService** (13 тестов) — defaults, add/delete answers, random answer, language switch, sorting, persistence, reset
- **StorageService** (8 тестов) — save/load, invalid JSON, empty data, QuotaExceededError, clear
- **TextLayoutAlgorithm** (10 тестов) — short/long text, word break, all 20 RU and 20 EN default answers

```bash
npm test
```

---

## Игровая механика

### Ответы

- 20 ответов по умолчанию: 10 положительных, 5 нейтральных, 5 негативных
- Двуязычность: русский и английский
- Пользователь может добавлять, удалять и сбрасывать ответы
- Данные сохраняются в localStorage

### Анимации

- **Шар**: появление с масштабированием, тряска (9 кадров движения), показ треугольника с ответом
- **Текст ответа**: распределяется по 5 строкам треугольной формой, масштабируется с шаром
- **Череп**: следит за курсором мыши (десктоп) или движется случайно (мобильные)
- **Паук**: сидит на паутине, при столкновении с черепом отлетает и возвращается
- **Облака**: плывут по экрану с случайной скоростью и масштабом

### Модель данных

```typescript
interface Answer {
  text: string;
  type: 'positive' | 'neutral' | 'negative';
}
```

---

## Автор

**Jirufik** — jirufik@gmail.com
