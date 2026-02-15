---
title: "Drizzle ORM: CRUD и запросы"
name: drizzle-crud
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

# Drizzle ORM: CRUD и запросы

---

## Цель лекции

- Освоить CRUD-операции
- Понять соответствие Drizzle и SQL
- Научиться фильтровать и сортировать данные
- Использовать limit / offset
- Работать с агрегатными функциями
- Подготовиться к лабораторной работе

---

## CRUD как модель работы с данными

CRUD:

- Create
- Read
- Update
- Delete

Соответствие SQL:

- INSERT
- SELECT
- UPDATE
- DELETE

Drizzle — типобезопасный способ писать эти операции.

---

## INSERT

<span class="lab-badge">🧪 drizzle06</span>

```ts
await db.insert(students).values({
  name: "Alice",
  email: "alice@example.com",
});
```

SQL:

```sql
INSERT INTO students (name, email)
VALUES ('Alice', 'alice@example.com');
```

- типы проверяются на этапе компиляции
- обязательные поля контролируются
- лишние поля запрещены

---

## INSERT с возвратом данных

```ts
const inserted = await db
  .insert(students)
  .values({
    name: "Alice",
    email: "alice@example.com",
  })
  .returning();
```

returning():

- возвращает созданную запись
- тип результата выводится автоматически

---

## SELECT без условий

<span class="lab-badge">🧪 drizzle07</span>

```ts
const list = await db
  .select()
  .from(students);
```

SQL:

```sql
SELECT * FROM students;
```

Результат — массив объектов,  
тип соответствует схеме.

---

## WHERE

<span class="lab-badge">🧪 drizzle08</span>

```ts
const student = await db
  .select()
  .from(students)
  .where(eq(students.id, 1));
```

SQL:

```sql
SELECT * FROM students
WHERE id = 1;
```

Drizzle использует функции-операторы: eq, like, inArray.

---

## Проекция полей

<span class="lab-badge">🧪 drizzle11</span>

```ts
const list = await db
  .select({
    id: students.id,
    name: students.name,
  })
  .from(students);
```

SQL:

```sql
SELECT id, name FROM students;
```

Тип результата включает только выбранные поля.

---

## Композиция условий

<span class="lab-badge">🧪 drizzle14</span>

```ts
const result = await db
  .select()
  .from(students)
  .where(
    and(
      like(students.name, "%Ali%"),
      eq(students.email, "alice@example.com")
    )
  );
```

SQL (and / or отражают логическую структуру SQL):

```sql
WHERE name LIKE '%Ali%'
AND email = 'alice@example.com'
```


---

## Сортировка и пагинация

<span class="lab-badge">🧪 drizzle12–13</span>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start;">

<div>

```ts
const ordered = await db
  .select()
  .from(students)
  .orderBy(students.name);

const paginated = await db
  .select()
  .from(students)
  .limit(10)
  .offset(20);
```

</div>

<div>

**ORDER BY**

- управляет порядком строк  
- используется для сортировки  

**LIMIT / OFFSET**

- ограничивает размер выборки  
- используется для пагинации  

</div>

</div>

---

## UPDATE

<span class="lab-badge">🧪 drizzle09</span>

```ts
await db
  .update(students)
  .set({ name: "Updated" })
  .where(eq(students.id, 1));
```

SQL:

```sql
UPDATE students
SET name = 'Updated'
WHERE id = 1;
```

- обновляются только указанные поля
- WHERE обязателен для контроля изменений

---

## DELETE

<span class="lab-badge">🧪 drizzle10</span>

```ts
await db
  .delete(students)
  .where(eq(students.id, 1));
```

SQL:

```sql
DELETE FROM students
WHERE id = 1;
```

Удаление без WHERE приведёт к удалению всех строк.

---

## Агрегатные функции

<span class="lab-badge">🧪 drizzle15</span>

```ts
const result = await db
  .select({
    total: count(),
  })
  .from(students);
```

SQL:

```sql
SELECT COUNT(*) FROM students;
```

Результат:

- массив из одного объекта
- поле total имеет числовой тип

---

## Несколько агрегатов

```ts
const stats = await db
  .select({
    avgScore: avg(grades.score),
    totalScore: sum(grades.score),
  })
  .from(grades);
```

Drizzle:

- типизирует результат
- учитывает возможный null
- сохраняет структуру объекта

---

## Типизация результатов

Drizzle автоматически:

- выводит тип результата
- учитывает projection
- учитывает агрегаты
- предотвращает обращение к несуществующим полям

Ошибки переносятся на этап компиляции.

---

## Лабораторная работа (краткий обзор)

В лабораторной требуется:

- реализовать insert
- реализовать select
- добавить where
- использовать projection
- применить orderBy
- использовать limit и offset
- реализовать update
- реализовать delete
- использовать агрегатную функцию

Все необходимые конструкции разобраны в лекции.

---

# Итог

После лекции вы:

- уверенно пишете CRUD-запросы
- понимаете соответствие SQL
- умеете фильтровать и сортировать
- используете limit / offset
- работаете с агрегатами
- понимаете типизацию результатов

Следующая лекция — JOIN и транзакции.
