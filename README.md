# Task Manager API

## Описание

REST API для управления задачами (карточками) с поддержкой регистрации, авторизации и CRUD для карточек. Пользователь видит и управляет только своими карточками.

---

## Запуск

1. Установить зависимости:
   ```
npm install
   ```
2. Настроить переменные окружения в `.env`:
   ```
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
   ```
3. Применить миграции:
   ```
npx sequelize-cli db:migrate
   ```
4. Запустить сервер:
   ```
npm start
   ```

---

## API

### Пользователь

#### Регистрация
`POST /api/user/signup`

**Request Body:**
```
{
  "username": "string",
  "password": "string"
}
```
**Response:**
- `201 Created` — `{ id, username }`
- `400 Bad Request` — если не переданы username или password
- `409 Conflict` — если username уже существует

#### Авторизация
`POST /api/user/login`

**Request Body:**
```
{
  "username": "string",
  "password": "string"
}
```
**Response:**
- `200 OK` — `{ token }` (JWT access token)
- `401 Unauthorized` — если неверные данные

---

### Карточки (Cards)

> Все запросы требуют заголовок `Authorization: Bearer <token>`

#### Создать карточку
`POST /api/cards`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
**Request Body:**
```
{
  "title": "string",
  "caption": "string",
  "dueDate": "YYYY-MM-DD",
  "status": "completed" | "uncompleted" | "skipped" | "archived"
}
```
**Response:**
- `201 Created` — объект карточки
  ```json
  {
    "id": 1,
    "title": "Задача 1",
    "caption": "Описание",
    "dueDate": "2024-07-01",
    "status": "uncompleted",
    "userId": 1,
    ...
  }
  ```
- `400 Bad Request` — если невалидные данные

#### Получить все свои карточки
`GET /api/cards`

**Headers:**
```
Authorization: Bearer <token>
```
**Response:**
- `200 OK` — массив карточек
  ```json
  [
    { "id": 1, "title": "Задача 1", ... },
    { "id": 2, "title": "Задача 2", ... }
  ]
  ```

#### Получить одну карточку
`GET /api/cards/:id`

**Headers:**
```
Authorization: Bearer <token>
```
**Response:**
- `200 OK` — объект карточки
- `404 Not Found` — если карточка не найдена или не принадлежит пользователю

#### Частичное обновление карточки (PATCH)
`PATCH /api/cards/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
**Request Body:** (можно передавать только нужные поля)
```
{
  "title": "Новое название",         // не обязательно
  "caption": "Новый текст",          // не обязательно
  "dueDate": "2024-07-10",          // не обязательно
  "status": "completed"              // не обязательно
}
```
**Response:**
- `200 OK` — обновлённая карточка
  ```json
  {
    "id": 1,
    "title": "Новое название",
    "caption": "Новый текст",
    "dueDate": "2024-07-10",
    "status": "completed",
    ...
  }
  ```
- `400 Bad Request` — если не передано ни одного валидного поля или невалидный формат даты
  ```json
  { "message": "No valid fields to update" }
  // или
  { "message": "Invalid dueDate format" }
  ```
- `404 Not Found` — если карточка не найдена или не принадлежит пользователю
  ```json
  { "message": "Card not found" }
  ```

#### Удалить карточку
`DELETE /api/cards/:id`

**Headers:**
```
Authorization: Bearer <token>
```
**Response:**
- `200 OK` — `{ "message": "Card deleted" }`
- `404 Not Found` — если карточка не найдена или не принадлежит пользователю

---

## Примечания
- Все ответы в формате JSON.
- Для защищённых эндпоинтов используйте JWT-токен в заголовке `Authorization: Bearer <token>`.
- Для PATCH можно передавать только те поля, которые нужно изменить. Остальные останутся без изменений.
