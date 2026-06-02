# TotDay 🕊

Планировщик свадьбы: быстрый расчёт стоимости, сметы по сценариям, каталог подрядчиков, список гостей с RSVP и сайт-приглашение.

## Запуск локально

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build      # билд в dist/
npm run preview    # предпросмотр билда
```

## Деплой на Vercel

1. Залить проект в GitHub.
2. На vercel.com → New Project → импортировать репозиторий.
3. Framework Preset определится как **Vite** автоматически.
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy.

Либо через CLI:

```bash
npm i -g vercel
vercel
```

## Хранение данных

MVP хранит всё в `localStorage` браузера (пользователь, опросы, смета, гости, приглашение). Бэкенд и БД — следующий этап.
