# Курс: Better Auth в архитектуре Next.js  
### (Drizzle ORM + PostgreSQL + tRPC + DI)

Формат: 4 лекции по 2 академических часа  
Контекст: Next.js (App Router), tRPC, Drizzle ORM, PostgreSQL  
Цель курса: встроить Better Auth в существующую fullstack-архитектуру с корректным разделением ответственности и продакшен-подходом к безопасности.

---

# Лекция 1. Аутентификация как инфраструктурный слой

## Цель лекции

Понять архитектурное место аутентификации в fullstack-системе и встроить Better Auth в существующую слоистую модель.

---

## 1. Проблема аутентификации в fullstack

- Почему auth — это не «форма логина»
- Stateful vs Stateless
- Session vs JWT
- Где хранится пользователь
- Cookie vs localStorage
- Почему безопасность начинается с архитектуры

---

## 2. Модель угроз (обзор)

- Что защищаем в приложении
- Основные векторы атак:
  - XSS
  - CSRF
  - Session hijacking
- Почему HttpOnly cookie критичны
- Уязвимые места в SSR и App Router

---

## 3. Архитектурное место Better Auth

Существующая архитектура:

UI  
↓  
tRPC  
↓  
Access layer  
↓  
Drizzle  
↓  
PostgreSQL  

Добавление auth:

- Проверка session до вызова бизнес-логики
- Передача пользователя через context
- Auth как cross-cutting слой

---

## 4. Инициализация Better Auth

- Конфигурация auth-модуля
- Подключение PostgreSQL
- Разделение конфигурации и бизнес-логики
- Почему auth — отдельный инфраструктурный модуль

---

## 5. Таблицы и схема в PostgreSQL

- users
- sessions
- accounts (для OAuth)
- Связь auth-пользователя и доменной модели
- Миграции через Drizzle

---

## 6. Session lifecycle

- Login
- Создание session
- Установка cookie
- Проверка на каждом запросе
- Expiration

---

## 7. Итоговая схема data-flow

Регистрация → Login → Cookie →  
Request → Session validation →  
Context → tRPC → Access layer → DB

---

# Лекция 2. Интеграция с tRPC и DI

## Цель лекции

Корректно встроить auth в DI-модель и защитить API-слой без нарушения архитектурных границ.

---

## 1. Получение session на сервере

- Server environment в Next.js
- Получение текущего пользователя
- SSR vs client-only сценарии

---

## 2. Передача пользователя в tRPC context

- Расширение ctx
- Inject user как зависимость
- Почему нельзя использовать глобальные импорты

---

## 3. protectedProcedure

- Централизация проверки авторизации
- Ошибка UNAUTHORIZED
- Переиспользуемость

---

## 4. RBAC (Role-Based Access Control)

- Роли в таблице users
- ADMIN / USER
- adminProcedure
- Композиция middleware

---

## 5. Проверка ownership

- userId === ownerId
- Защита update/delete
- Где должна жить проверка
- Разделение ответственности между router и access layer

---

## 6. Архитектурные границы

- Auth отвечает за "кто"
- Access layer отвечает за "можно ли"
- Router остаётся тонким

---

## 7. Ошибки авторизации

- UNAUTHORIZED
- FORBIDDEN
- Разделение доменной ошибки и ошибки доступа

---

# Лекция 3. Сессионная безопасность и устойчивость к атакам

## Цель лекции

Углублённо понять сессионную модель и её защиту в продакшен-среде.

---

## 1. Параметры cookie

- HttpOnly
- Secure
- SameSite
- Path
- Domain

---

## 2. CSRF

- Почему cookie уязвимы
- Когда необходима CSRF-защита
- Anti-CSRF токены
- Где реализуется защита

---

## 3. Expiration и rotation

- Absolute expiration
- Sliding expiration
- Refresh logic
- Logout и инвалидация

---

## 4. Несколько активных сессий

- Авторизация на нескольких устройствах
- Просмотр активных сессий
- Принудительный logout

---

## 5. Middleware Next.js vs tRPC middleware

- Разница ответственности
- Проверка на уровне маршрута
- Проверка на уровне процедуры
- Edge vs Node runtime

---

## 6. Расширение user-модели

- Дополнительные поля
- Связь с доменной моделью
- Профиль пользователя

---

## 7. Масштабирование auth

- Горизонтальное масштабирование
- Sticky sessions
- Возможность выделения auth-сервиса

---

# Лекция 4. Полный защищённый data-flow приложения

## Цель лекции

Сформировать целостную архитектурную модель защищённого fullstack-приложения.

---

## 1. Client integration

- Получение текущего пользователя
- currentUser query
- Guard-компоненты

---

## 2. UI-level защита

- Conditional rendering
- Layout-level guards
- Redirect при отсутствии авторизации

---

## 3. Router-level защита

- protectedProcedure
- adminProcedure
- Ownership checks

---

## 4. Access-layer защита

- Проверка инвариантов
- Повторная валидация прав
- Почему нельзя полагаться только на router

---

## 5. Полный жизненный цикл запроса

Регистрация → Login → Cookie →  
Session → Context → Protected mutation →  
Access layer → DB → Response → UI update

---

## 6. Анти-паттерны

- Проверка роли только в UI
- Бизнес-логика в router
- Глобальные auth-импорты
- Прямая работа с БД из процедуры

---

## 7. Итоговая архитектурная модель

- Auth как cross-cutting слой
- DI + Auth
- Масштабируемость
- Готовность к production

---

# Результат курса

После завершения курса студент:

- понимает модель угроз веб-приложений;
- умеет встроить Better Auth в Next.js + tRPC + Drizzle + PostgreSQL;
- реализует RBAC и ownership;
- корректно организует DI + auth;
- понимает session lifecycle и безопасность cookie;
- выстраивает продакшен-ориентированную fullstack-архитектуру.

