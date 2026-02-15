---
title: trpc-crud
name: trpc-crud
canvasWidth: 800
routerMode: hash
---
<style>
.lab-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 999px;
    background: #eef2ff;
    color: #3730a3;
    font-weight: 600;
    font-size: 0.9em;
}
.mermaid-fit {
  transform: scale(0.7);
  transform-origin: top center;
}
</style>

# tRPC в Next.js — CRUD и архитектура API-слоя

---

# Цель лекции

- Построить полноценный CRUD через tRPC
- Интегрировать API с data-access слоем
- Освоить доменную структуру router
- Понять корректную модель ошибок API
- Подготовиться к задачам trpc11–trpc20

---

# От минимального API к архитектуре

Лекция 1:

- процедура как функция

Лекция 2:

- API как orchestration-слой
- CRUD как контракт
- доменная структура
- DI и архитектурная чистота

---

# Router как orchestration-слой

Router:

- не содержит бизнес-логику
- не работает напрямую с БД
- координирует вызовы нижних слоёв

API ≠ Data layer

---

# Data-access через context

<span class="lab-badge">🧪 trpc11</span>

Dependency injection через ctx.

```ts
createUser: publicProcedure
  .mutation(async ({ ctx, input }) => {
    return ctx.userAccess.create(input)
  })
```

Router не импортирует access напрямую.

---

# Почему не прямой импорт?

Плохо:

```ts
import { createUser } from '@/db/user'

createUser(...)
```

Проблемы:

- скрытая зависимость
- сложность тестирования
- нарушение DI-принципа

---

# Create — mutation

CRUD: Create → mutation

```ts
create: publicProcedure
  .input(userSchema)
  .mutation(({ ctx, input }) => {
    return ctx.userAccess.create(input)
  })
```

Mutation = изменение состояния.

---

# Read — query

CRUD: Read → query

```ts
getById: publicProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.userAccess.findById(input.id)
  })
```

Query = чтение.

---

# Nullable результат

Access-слой может вернуть null.

```ts
return ctx.userAccess.findById(id)
// → User | null
```

Но null — техническое состояние.

API — контракт.

---

# Nullable vs доменная ошибка

<div style="display:flex; gap:40px;">

<div style="flex:1;">

### Nullable

- возвращает null
- клиент обязан проверять
- семантика размыта

</div>

<div style="flex:1;">

### Domain error

- выбрасывается NOT_FOUND
- контракт однозначен
- ошибка типизирована

</div>

</div>

---

# TRPCError

<span class="lab-badge">🧪 trpc16</span>

Краткая модель ошибок:

```ts
import { TRPCError } from '@trpc/server'

throw new TRPCError({
  code: 'NOT_FOUND',
  message: 'User not found'
})
```

Ошибка — часть API-контракта.

---

# Стандартные коды ошибок

Примеры:

- NOT_FOUND
- BAD_REQUEST
- UNAUTHORIZED
- INTERNAL_SERVER_ERROR

API сообщает семантику, а не технические детали.

---

# Update — mutation

CRUD: Update → mutation

```ts
update: publicProcedure
  .input(updateSchema)
  .mutation(({ ctx, input }) => {
    return ctx.userAccess.update(input)
  })
```

API не дублирует логику изменения.

---

# Delete — mutation

CRUD: Delete → mutation

```ts
remove: publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(({ ctx, input }) => {
    return ctx.userAccess.delete(input.id)
  })
```

Симметрия CRUD важна для архитектуры.

---

# Доменные router

API масштабируется по сущностям.

userRouter  
postRouter  

Каждый отвечает за свою область.

---

# userRouter

<span class="lab-badge">🧪 trpc17</span>

```ts
export const userRouter = router({
  create: ...,
  getById: ...,
  update: ...,
  remove: ...
})
```

Доменная изоляция.

---

# postRouter

<span class="lab-badge">🧪 trpc18</span>

```ts
export const postRouter = router({
  create: ...,
  getById: ...,
  update: ...,
  remove: ...
})
```

Одинаковые принципы, разная сущность.

---

# Объединение router

<span class="lab-badge">🧪 trpc19</span>

```ts
export const appRouter = router({
  user: userRouter,
  post: postRouter
})
```

Namespace формируется автоматически.

API становится модульным.

---

# Корневой router

appRouter:

- точка сборки доменов
- источник AppRouter-типа
- единый контракт приложения

---

# Архитектурная чистота DI (trpc20)

API-слой:

- не знает о реализации БД
- не создаёт зависимости
- получает их через context

Контракт отделён от инфраструктуры.

---

# Анти-паттерны

❌ Бизнес-логика в router  
❌ Прямой импорт DB  
❌ Обработка ошибок в стиле try/catch без семантики  
❌ Возврат null вместо доменной ошибки  

---

# Модель API-контракта

Хороший API:

- семантически однозначен
- типобезопасен
- не раскрывает детали реализации
- масштабируется по доменам

---

# Связь с лабораторными (trpc11–trpc20)

Вы реализуете:

1. DI через context  
2. Create  
3. Read (nullable)  
4. Update  
5. Delete  
6. NOT_FOUND  
7. userRouter  
8. postRouter  
9. Объединение router  
10. Проверку архитектурной чистоты DI  

Лекция объясняет архитектурную модель.  
Практика закрепляет её в коде.

---

# Итог

CRUD через tRPC — это:

- тонкий orchestration-слой
- строгий контракт
- доменная модульность
- DI вместо глобальных зависимостей
- ошибки как часть API-семантики

API становится архитектурной границей системы.
