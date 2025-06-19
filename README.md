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

#### Получить все свои карточки
`GET /api/cards`

**Response:**
- `200 OK` — массив карточек

#### Получить одну карточку
`GET /api/cards/:id`

**Response:**
- `200 OK` — объект карточки
- `404 Not Found` — если карточка не найдена или не принадлежит пользователю

#### Обновить карточку
`PUT /api/cards/:id`

**Request Body:** (любое из полей)
```
{
  "title": "string",
  "caption": "string",
  "dueDate": "YYYY-MM-DD",
  "status": "completed" | "uncompleted" | "skipped" | "archived"
}
```
**Response:**
- `200 OK` — обновлённая карточка
- `404 Not Found` — если карточка не найдена или не принадлежит пользователю

#### Удалить карточку
`DELETE /api/cards/:id`

**Response:**
- `200 OK` — `{ message: "Card deleted" }`
- `404 Not Found` — если карточка не найдена или не принадлежит пользователю

---

## Примечания
- Все ответы в формате JSON.
- Для защищённых эндпоинтов используйте JWT-токен в заголовке `Authorization: Bearer <token>`. 