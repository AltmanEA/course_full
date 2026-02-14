---
title: tRPC в Next.js — Клиентский слой и архитектурная целостность
name: trpc-client
canvasWidth: 800
routerMode: hash
---

# tRPC в Next.js — Клиентский слой и архитектурная целостность

---

# Цель лекции

- Понять, как router порождает типизированные hooks
- Освоить useQuery и useMutation
- Разобраться с cache и invalidate
- Построить архитектуру клиентского слоя
- Сформировать целостную модель client data-flow

---

# От API к клиентскому data-flow

Лекции 1–3:

- контракт
- CRUD
- middleware
- архитектура API

Лекция 4:

- как клиент работает с этим контрактом
- как данные синхронизируются

---

# Router как источник hooks

Router:

- определяет namespace
- определяет input/output
- определяет типизацию

Client автоматически получает типизированные hooks.

Контракт не дублируется.

---

# trpc31 — Первый useQuery

```ts
const { data, isLoading } =
  trpc.user.getById.useQuery({
    id: '1'
  })
```

- тип input проверяется
- тип data выводится автоматически

End-to-end типизация.

---

# useQuery — что происходит

- формируется query key
- выполняется запрос
- результат кэшируется
- повторный вызов берёт данные из cache

React Query управляет состоянием.

---

# trpc32 — useQuery с input

Input — часть ключа кэша.

```ts
trpc.post.getById.useQuery({
  id: '42'
})
```

Разные input → разные cache-записи.

---

# useMutation — изменение состояния

Mutation:

- не кэшируется как query
- инициирует side-effect
- требует синхронизации cache

---

# trpc33 — Первый useMutation

```ts
const mutation =
  trpc.user.create.useMutation()

mutation.mutate({
  name: 'Alice'
})
```

Mutation не обновляет query автоматически.

---

# Проблема синхронизации

После mutation:

- сервер обновлён
- кэш может быть устаревшим

Нужна инвалидация.

---

# trpc34 — invalidate

```ts
const utils = trpc.useUtils()

mutation.mutate(input, {
  onSuccess: () => {
    utils.user.getById.invalidate({ id })
  }
})
```

Invalidate → повторный запрос → синхронизация UI.

---

# onSuccess — архитектурная роль

onSuccess:

- инкапсулирует post-mutation поведение
- не смешивает UI и инфраструктуру
- контролирует data-flow

---

# trpc35 — onSuccess

```ts
trpc.user.update.useMutation({
  onSuccess: () => {
    utils.user.getById.invalidate()
  }
})
```

Mutation управляет реакцией системы.

---

# trpc36 — onError

```ts
trpc.user.create.useMutation({
  onError: (error) => {
    console.error(error.message)
  }
})
```

Ошибка обрабатывается на клиенте.

API остаётся неизменным.

---

# Архитектура hooks по доменам

Плохо:

- все вызовы в одном файле
- хаотичный импорт

Хорошо:

- userHooks
- postHooks
- доменная изоляция

---

# trpc37 — Разделение hooks

```ts
export const userHooks = {
  useGetById: () =>
    trpc.user.getById.useQuery(),
}
```

Клиентский слой структурируется.

---

# trpc38 — Композиция hooks

```ts
export const api = {
  user: userHooks,
  post: postHooks
}
```

Повторяем структуру router.

Архитектурная симметрия.

---

# trpc39 — Централизованный экспорт

```ts
export * from './userHooks'
export * from './postHooks'
```

Единая точка входа.

Упрощение импорта.

---

# Полный client data-flow

```mermaid
flowchart LR
    A[UI Component]
    B[useQuery / useMutation]
    C[tRPC Client]
    D[Router]
    E[Access Layer]
    F[(Database)]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> E
    E --> D
    D --> C
    C --> B
    B --> A
```

Типизация проходит через все уровни.

---

# trpc40 — Полный цикл

1. useQuery загружает данные  
2. useMutation изменяет состояние  
3. onSuccess вызывает invalidate  
4. query перезапрашивается  
5. UI обновляется  

Это замкнутый цикл.

---

# Архитектурные принципы клиентского слоя

- Контракт определяется router
- Hooks повторяют доменную структуру
- Инвалидация — часть data-flow
- UI не знает о реализации API
- Ошибки обрабатываются локально

---

# Анти-паттерны

❌ Прямой fetch вместо tRPC  
❌ Дублирование типов  
❌ Глобальный invalidate без scope  
❌ Бизнес-логика в onSuccess  
❌ Несогласованная структура hooks  

---

# Связь с лабораторными (trpc31–trpc40)

Вы реализуете:

1. useQuery  
2. useQuery с input  
3. useMutation  
4. invalidate  
5. onSuccess  
6. onError  
7. Разделение hooks  
8. Композицию  
9. Централизованный экспорт  
10. Полный client data-flow  

Лекция объясняет архитектуру.  
Практика закрепляет синхронизацию данных.

---

# Итог

Клиентский слой:

- типобезопасен
- симметричен router
- управляет кэшем
- композиционно организован
- замыкает полный data-flow системы

tRPC связывает сервер и клиент в единый типизированный контур.
