---
title: tRPC в Next.js — Middleware, context и расширяемость API
name: trpc-adv
canvasWidth: 800
routerMode: hash
---

# tRPC в Next.js — Middleware, context и расширяемость API

---

# Цель лекции

- Понять API как расширяемую архитектурную границу
- Освоить middleware как механизм композиции
- Разделить доменные и API-ошибки
- Научиться расширять context безопасно
- Подготовиться к задачам trpc21–trpc30

---

# От CRUD к расширяемости

Лекция 2:

- API как orchestration-слой

Лекция 3:

- API как инфраструктурный конвейер
- Поведение добавляется без изменения процедур
- Cross-cutting логика вне бизнес-кода

---

# Context как инфраструктурный контейнер

Context может содержать:

- requestId
- logger
- auditService
- user
- role

Это не бизнес-логика.

Это инфраструктура запроса.

---

# trpc21 — Metadata из context

```ts
getRequestId: publicProcedure
  .query(({ ctx }) => {
    if (!ctx.requestId) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

    return ctx.requestId
  })
```

Procedure использует инфраструктурные данные.

---

# Middleware — идея

Middleware:

- оборачивает procedure
- выполняется до и после
- не изменяет бизнес-логику напрямую

Procedure остаётся чистой.

---

# Модель выполнения middleware

```mermaid
flowchart LR
    A[Request] --> B[Middleware 1]
    B --> C[Middleware 2]
    C --> D[Procedure]
    D --> C
    C --> B
    B --> E[Response]
```

Стековая модель.

---

# Базовый middleware

```ts
const timingMiddleware = t.middleware(async (opts) => {
  const start = Date.now()

  const result = await opts.next()

  const duration = Date.now() - start
  opts.ctx.logger.info(duration)

  return result
})
```

Procedure не знает о логировании.

---

# Структура result (кратко)

```ts
const result = await opts.next()

if (result.ok) {
  result.data
} else {
  result.error
}
```

Middleware может анализировать результат.

---

# trpc22 — Timing middleware

Измеряет время.

Не меняет контракт.

Добавляет observability.

---

# trpc23 — Audit middleware

```ts
const auditMiddleware = t.middleware(async (opts) => {
  const result = await opts.next()

  await opts.ctx.auditService.record({
    path: opts.path,
    data: result.ok ? result.data : null
  })

  return result
})
```

API расширяется без изменения процедур.

---

# Response shaping (trpc24)

Middleware может трансформировать ответ.

```ts
const responseWrapper = t.middleware(async (opts) => {
  const result = await opts.next()

  if (!result.ok) return result

  return {
    ...result,
    data: {
      requestId: opts.ctx.requestId,
      payload: result.data
    }
  }
})
```

Контракт модифицируется централизованно.

---

# protectedProcedure как композиция

```ts
const protectedProcedure =
  publicProcedure.use(authMiddleware)
```

Политика доступа вынесена из процедур.

---

# trpc25 — Role-based доступ

```ts
const adminProcedure =
  protectedProcedure.use(roleMiddleware('ADMIN'))
```

RBAC реализуется композиционно.

---

# Ошибки: три уровня

<div style="display:flex; gap:40px;">

<div style="flex:1;">

### Доменная ошибка

- EntityNotFoundError
- бизнес-смысл

</div>

<div style="flex:1;">

### API-ошибка

- TRPCError
- NOT_FOUND
- BAD_REQUEST

</div>

</div>

Инфраструктура ≠ домен.

---

# trpc26 — Error factory

```ts
function createNotFoundError(entity: string) {
  return new TRPCError({
    code: 'NOT_FOUND',
    message: `${entity} not found`
  })
}
```

Стандартизация API-ошибок.

---

# trpc27 — Нормализация доменной ошибки

```ts
try {
  return await ctx.userAccess.findById(id)
} catch (e) {
  if (e instanceof EntityNotFoundError) {
    throw createNotFoundError('User')
  }
  throw e
}
```

Домен и API разделены.

---

# Deterministic logging (trpc28)

```ts
const loggingMiddleware = t.middleware(async (opts) => {
  const result = await opts.next()

  if (result.ok && result.data === 'ok') {
    opts.ctx.logger.info('ok')
  } else {
    opts.ctx.logger.error('error')
  }

  return result
})
```

Поведение зависит от результата.

---

# Порядок middleware (trpc29)

```ts
procedure
  .use(prefixMiddleware)
  .use(suffixMiddleware)
```

Порядок влияет на результат.

Композиция не коммутативна.

---

# Расширение context (trpc30)

```ts
const requestIdMiddleware = t.middleware(async (opts) => {
  return opts.next({
    ctx: {
      ...opts.ctx,
      requestId: generateId()
    }
  })
})
```

Context расширяется безопасно.

---

# Принципы расширяемого API

- Процедуры — чистые
- Cross-cutting логика — в middleware
- Ошибки стандартизированы
- Context — единственный канал зависимостей
- Композиция важнее наследования

---

# Анти-паттерны

❌ Логирование внутри каждой процедуры  
❌ Авторизация через if в бизнес-коде  
❌ Смешивание доменной и API-ошибки  
❌ Глобальные singletons вместо ctx  

---

# Связь с лабораторными (trpc21–trpc30)

Вы реализуете:

1. Metadata из context  
2. Timing middleware  
3. Audit middleware  
4. Response shaping  
5. Role-based procedure  
6. Error factory  
7. Нормализацию ошибок  
8. Deterministic logging  
9. Порядок middleware  
10. Расширение context  

Лекция объясняет архитектурную модель.  
Практика проверяет корректность композиции.

---

# Итог

Middleware делает API:

- расширяемым
- композиционным
- архитектурно чистым

Context делает API:

- управляемым
- тестируемым
- независимым от инфраструктуры

tRPC — это не просто RPC.

Это архитектурная граница системы.
