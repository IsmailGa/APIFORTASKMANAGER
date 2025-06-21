# Personal Task Manager API

## Описание

REST API для управления задачами в стиле Trello с поддержкой досок, колонок и карточек. Пользователи могут создавать доски, организовывать задачи по колонкам, перетаскивать карточки между колонками и управлять приоритетами, метками и назначениями.

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
   PORT=3000
   ```

3. Создать базу данных:
   ```
   npx sequelize-cli db:create
   ```

4. Применить миграции:
   ```
   npx sequelize-cli db:migrate
   ```

5. Запустить сервер:
   ```
   npm start
   ```

---

## API

### Пользователь

#### Регистрация
`POST /api/user/register`

**Request Body:**
```json
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
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
- `200 OK` — `{ token }` (JWT access token)
- `401 Unauthorized` — если неверные данные

---

### Доски (Boards)

> Все запросы требуют заголовок `Authorization: Bearer <token>`

#### Создать доску
`POST /api/boards`

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "color": "string (hex color)"
}
```

**Response:**
- `201 Created` — объект доски с колонками
- `400 Bad Request` — если невалидные данные

#### Получить все доски пользователя
`GET /api/boards`

**Response:**
- `200 OK` — массив досок с колонками и карточками

#### Получить одну доску
`GET /api/boards/:id`

**Response:**
- `200 OK` — объект доски с колонками и карточками
- `404 Not Found` — если доска не найдена

#### Обновить доску
`PUT /api/boards/:id`

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "color": "string"
}
```

**Response:**
- `200 OK` — обновлённая доска
- `404 Not Found` — если доска не найдена

#### Удалить доску
`DELETE /api/boards/:id`

**Response:**
- `200 OK` — `{ "message": "Board deleted" }`
- `404 Not Found` — если доска не найдена

---

### Колонки (Columns)

#### Создать колонку
`POST /api/columns`

**Request Body:**
```json
{
  "title": "string",
  "boardId": "number",
  "position": "number"
}
```

**Response:**
- `201 Created` — объект колонки
- `400 Bad Request` — если невалидные данные

#### Получить колонки доски
`GET /api/boards/:boardId/columns`

**Response:**
- `200 OK` — массив колонок с карточками

#### Обновить колонку
`PUT /api/columns/:id`

**Request Body:**
```json
{
  "title": "string",
  "position": "number"
}
```

**Response:**
- `200 OK` — обновлённая колонка
- `404 Not Found` — если колонка не найдена

#### Удалить колонку
`DELETE /api/columns/:id`

**Response:**
- `200 OK` — `{ "message": "Column deleted" }`
- `404 Not Found` — если колонка не найдена

---

### Карточки (Cards)

#### Создать карточку
`POST /api/cards`

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "dueDate": "YYYY-MM-DD",
  "priority": "low" | "medium" | "high",
  "labels": ["string"],
  "assignees": ["string"],
  "attachments": ["string"],
  "boardId": "number",
  "columnId": "number",
  "position": "number"
}
```

**Response:**
- `201 Created` — объект карточки
- `400 Bad Request` — если невалидные данные

#### Получить все карточки пользователя
`GET /api/cards`

**Response:**
- `200 OK` — массив карточек с досками и колонками

#### Получить карточки доски
`GET /api/boards/:boardId/cards`

**Response:**
- `200 OK` — массив карточек с колонками

#### Получить одну карточку
`GET /api/cards/:id`

**Response:**
- `200 OK` — объект карточки
- `404 Not Found` — если карточка не найдена

#### Обновить карточку
`PUT /api/cards/:id`

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "dueDate": "YYYY-MM-DD",
  "priority": "low" | "medium" | "high",
  "labels": ["string"],
  "assignees": ["string"],
  "attachments": ["string"],
  "status": "completed" | "uncompleted" | "skipped" | "archived"
}
```

**Response:**
- `200 OK` — обновлённая карточка
- `404 Not Found` — если карточка не найдена

#### Переместить карточку
`PATCH /api/cards/:id/move`

**Request Body:**
```json
{
  "columnId": "number",
  "position": "number"
}
```

**Response:**
- `200 OK` — обновлённая карточка
- `404 Not Found` — если карточка или колонка не найдена

#### Удалить карточку
`DELETE /api/cards/:id`

**Response:**
- `200 OK` — `{ "message": "Card deleted" }`
- `404 Not Found` — если карточка не найдена

---

## Модели данных

### Board
```javascript
{
  id: number,
  title: string,
  description: string,
  color: string,
  userId: number,
  createdAt: date,
  updatedAt: date,
  columns: [Column]
}
```

### Column
```javascript
{
  id: number,
  title: string,
  position: number,
  boardId: number,
  createdAt: date,
  updatedAt: date,
  cards: [Card]
}
```

### Card
```javascript
{
  id: number,
  title: string,
  description: string,
  dueDate: date,
  priority: "low" | "medium" | "high",
  labels: [string],
  assignees: [string],
  attachments: [string],
  status: "completed" | "uncompleted" | "skipped" | "archived",
  position: number,
  boardId: number,
  columnId: number,
  userId: number,
  createdAt: date,
  updatedAt: date
}
```

### User
```javascript
{
  id: number,
  username: string,
  password: string (hashed),
  createdAt: date,
  updatedAt: date
}
```

---

## Особенности

### Drag & Drop
- Карточки можно перетаскивать между колонками
- Автоматическое обновление позиций карточек
- Поддержка переупорядочивания в рамках одной колонки

### Приоритеты
- `low` - низкий приоритет
- `medium` - средний приоритет  
- `high` - высокий приоритет

### Статусы карточек
- `uncompleted` - не выполнено (по умолчанию)
- `completed` - выполнено
- `skipped` - пропущено
- `archived` - архивировано

### Безопасность
- JWT аутентификация для всех защищённых эндпоинтов
- Пользователи видят только свои доски и карточки
- Валидация входных данных
- Хеширование паролей

### Производительность
- Оптимизированные запросы с включением связанных данных
- Индексы на внешние ключи
- Пагинация для больших списков (планируется)

---

## Примечания
- Все ответы в формате JSON
- Для защищённых эндпоинтов используйте JWT-токен в заголовке `Authorization: Bearer <token>`
- Даты передаются в формате `YYYY-MM-DD`
- Массивы (labels, assignees, attachments) передаются как JSON массивы
- Позиции (position) используются для сортировки элементов
