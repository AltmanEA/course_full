---
title: tRPC в Next.js — Минимальный tRPC API
name: trpc-min
canvasWidth: 800
routerMode: hash
---


# tRPC в Next.js — Минимальный tRPC API

---

# Цель лекции

- Понять RPC-модель
- Освоить базовые элементы tRPC
- Построить минимальный router
- Осознать принцип end-to-end типобезопасности
- Подготовиться к задачам trpc01–trpc10

---

# Проблема типобезопасности API

REST-контракт:

- URL
- HTTP-метод
- JSON
- DTO на клиенте
- DTO на сервере

Типы существуют отдельно.

TypeScript не контролирует границу HTTP.

---

# Где возникает рассинхронизация?

- сервер изменил структуру ответа
- клиент не обновил интерфейс
- runtime-ошибка вместо compile-time

Типизация разрывается на уровне сети.

---

# RPC-подход

RPC = вызов функции на сервере

Клиент видит:

- имя процедуры
- тип входа
- тип результата

API становится набором типизированных функций.

---

# Что делает tRPC

- не генерирует OpenAPI
- не требует DTO
- не требует схем маршрутов

Он использует TypeScript как источник контракта.

End-to-end type safety.

---

# Архитектура в Next.js

UI → tRPC → access layer → DB


```mermaid
flowchart LR
    A[React UI] --> B[tRPC Router]
    B --> C[Data Access Layer]
    C --> D[(Database)]
```

---

# Инициализация tRPC

Базовая точка входа.

```ts
import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure
```

router — фабрика API  
procedure — фабрика операций

---

# trpc01 — Минимальный router

Контракт приложения — это router.

```ts
export const appRouter = router({})

export type AppRouter = typeof appRouter
```

AppRouter — источник типов для клиента.

---

# Процедура (procedure)

procedure — типизированная функция API.

Два вида:

- query
- mutation

---

# trpc02 — Первая query

```ts
export const appRouter = router({
  hello: publicProcedure
    .query(() => 'hello')
})
```

query — операция чтения.

---

# trpc03 — Структурированный результат

Типизация распространяется на объект.

```ts
hello: publicProcedure
  .query(() => ({
    message: 'hello',
    version: 1
  }))
```

Клиент получит точную структуру.

---

# Входные данные (input)

RPC-процедура принимает аргументы.

Input — часть контракта.


## trpc04 — Input в query

```ts
hello: publicProcedure
  .input(z.object({
    name: z.string()
  }))
  .query(({ input }) => {
    return `Hello, ${input.name}`
  })
```

input типизируется автоматически.

---

# trpc05 — Декларативная валидация

zod выполняет:

- runtime-проверку
- формирование типов

```ts
.input(z.object({
  id: z.string().uuid()
}))
```

Схема = контракт + защита.

---

# query vs mutation

query  
- чтение  
- не меняет состояние  

mutation  
- изменение состояния  
- соответствует CRUD

---

# trpc06 — Первая mutation

```ts
createUser: publicProcedure
  .input(z.object({
    name: z.string()
  }))
  .mutation(async ({ input }) => {
    return { id: '1', name: input.name }
  })
```

mutation семантически обозначает изменение.

---

# Связь с data-access слоем

API не должен работать с БД напрямую.

Он вызывает access-функцию.

## Вызов access-слоя (Drizzle)

```ts
createUser: publicProcedure
  .input(userSchema)
  .mutation(async ({ input }) => {
    return createUserInDb(input)
  })
```

Router остаётся тонким.

Бизнес-логика — ниже.

---

# Context как DI-механизм

Context передаёт зависимости.

- access layer
- logger
- metadata запроса

Без глобальных импортов.

---

# trpc07 — Context

```ts
createUser: publicProcedure
  .mutation(async ({ ctx }) => {
    return ctx.userAccess.create()
  })
```

DI вместо прямых импортов.

---

# Middleware

Middleware расширяет поведение:

- логирование
- авторизация
- модификация результата

Не смешивается с бизнес-логикой.

---

# trpc08 — Базовый middleware

```ts
const loggerMiddleware = t.middleware(async (opts) => {
  console.log(opts.path)
  return opts.next()
})
```

Подключается к procedure.

---

# protectedProcedure

Композиция middleware.

Архитектурный паттерн защиты API.

---

# trpc09 — protectedProcedure

```ts
const protectedProcedure =
  publicProcedure.use(authMiddleware)
```

Повторное использование политики доступа.

---

# Композиция router

API масштабируется по доменам.

## trpc10 — Вложенные router

```ts
const userRouter = router({
  get: publicProcedure.query(...)
})

export const appRouter = router({
  user: userRouter
})
```

Namespace формируется автоматически.

---

# Полный data-flow

```mermaid
flowchart LR
    A[UI] --> B[Procedure]
    B --> C[Access Layer]
    C --> D[(DB)]
    D --> C
    C --> B
    B --> A
```

Типизация проходит через все уровни.

---

# Что важно понять

- Router = контракт приложения
- Procedure = типизированная операция
- zod = входная защита
- Context = DI
- Middleware = расширяемость
- tRPC = RPC, а не REST

---

# Связь с лабораторными (trpc01–trpc10)

Вы реализуете:

1. Router
2. Query
3. Структурированный ответ
4. Input
5. Валидацию
6. Mutation
7. Context
8. Middleware
9. protectedProcedure
10. Композицию router

Лекция объясняет концепции.  
Практика — закрепляет реализацию.

---

# Итог

tRPC:

- устраняет разрыв типов
- превращает API в набор функций
- делает TypeScript источником истины
- поддерживает DI и масштабируемость

Минимальный API — это уже архитектурный контракт.
