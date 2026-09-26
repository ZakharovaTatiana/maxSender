# Bug fix: предупреждения консоли

## Цель и наблюдаемое поведение

Устранить предупреждение React Redux о нестабильном результате `selectChats` и два предупреждения React Router о future flags из предоставленного воспроизведения открытия главной страницы. Ожидается стабильная ссылка списка при неизменном состоянии чатов и явно включённое будущее поведение роутера. Сообщение о React DevTools информационное и остаётся.

## Реализация и решение

- `src/entities/chat/model/chatSlice.ts`: `selectChats` вызывает `Object.values().sort()` при каждом обращении. Использовать `createSelector` с существующим `selectChatsState`, сохранив сортировку.
- `src/app/providers/index.tsx`: `BrowserRouter` не получает future flags. Включить `v7_startTransition` и `v7_relativeSplatPath`.
- `src/app/router/index.tsx`: маршруты `/` и `*`; ссылка в `src/pages/not-found/ui/NotFoundPage.tsx` абсолютная. Относительных переходов внутри splat и `React.lazy` внутри компонентов нет.

Подавление console.warn и отключение проверок Redux не устраняют причины и не используются. Зависимости, данные и API не меняются; влияния на приватность нет. Пользовательские изменения `src/app/App.tsx` сохраняются.

## Этапы и проверка

1. Добавить regression test селектора и подтвердить падение до исправления.
2. Мемоизировать селектор и включить флаги роутера.
3. Проверить стабильность ссылки, порядок и обновление списка через Node.js test runner; выполнить build, lint, format:check, git diff --check и git status --short.

Тест хранится рядом с моделью в `src/entities/chat/model/chatSlice.test.mjs`, запускается через `node --experimental-strip-types --test src/entities/chat/model/chatSlice.test.mjs`. Браузерные проверки не выполняются по правилам проекта. Риск: изменение поведения переходов при включении future flags; текущие маршруты не используют относительные splat-переходы.
