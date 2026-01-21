# API Документация

## Базовый URL

```
http://localhost:5000
```

## Аутентификация

Все защищенные эндпоинты требуют заголовок `user-id` в запросе:

```
user-id: <числовой идентификатор пользователя>
```

Если пользователь не существует, он будет автоматически зарегистрирован при первом запросе.

---

## Пользователи

### GET `/user`

Получить информацию о текущем пользователе.

**Аутентификация:** Требуется

**Заголовки:**

- `user-id` (обязательный) - числовой идентификатор пользователя

**Параметры запроса:** Нет

**Пример запроса:**

```bash
curl -X GET http://localhost:5000/user \
  -H "user-id: 123456"
```

**Пример ответа (200 OK):**

```json
{
    "id": "...",
    "userId": 123456,
    "username": "test",
    "first_name": "test",
    "last_name": "test",
    "addedAt": "2024-01-01T00:00:00.000Z"
}
```

**Ошибки:**

- `404 Not Found` - пользователь не найден

---

## Аукционы

### GET `/auction`

Получить список аукционов по статусу.

**Аутентификация:** Не требуется

**Параметры запроса (query):**

- `status` (обязательный) - статус аукциона: `"active"` или `"ended"`

**Пример запроса:**

```bash
curl -X GET "http://localhost:5000/auction?status=active"
```

**Пример ответа (200 OK):**

```json
[
    {
        "id": "...",
        "status": "active",
        "roundCount": 5,
        "currentRound": 1,
        "roundDuration": 60000,
        "roundStartTime": "2024-01-01T00:00:00.000Z",
        "roundEndTime": "2024-01-01T00:01:00.000Z",
        "giftCollectionId": "...",
        "supplyCount": 10,
        "addedAt": "2024-01-01T00:00:00.000Z",
        "endedAt": null
    }
]
```

**Ошибки:**

- `400 Bad Request` - неверный параметр `status`

### PUT `/auction`

Создать новый аукцион.

**Аутентификация:** Не требуется

**Тело запроса (JSON):**

- `roundCount` (обязательный, число) - количество раундов (1-100)
- `roundDuration` (обязательный, число) - длительность раунда в миллисекундах (минимум 5000)
- `supplyCount` (обязательный, число) - количество подарков (минимум 1)
- `giftCollectionId` (обязательный, строка) - идентификатор коллекции подарков

**Пример запроса:**

```bash
curl -X PUT http://localhost:5000/auction \
  -H "Content-Type: application/json" \
  -d '{
    "roundCount": 5,
    "roundDuration": 60000,
    "supplyCount": 10,
    "giftCollectionId": "507f1f77bcf86cd799439011"
  }'
```

**Пример ответа (200 OK):**

```json
{
    "id": "...",
    "status": "active",
    "roundCount": 5,
    "currentRound": 1,
    "roundDuration": 60000,
    "roundStartTime": "2024-01-01T00:00:00.000Z",
    "roundEndTime": "2024-01-01T00:01:00.000Z",
    "giftCollectionId": "507f1f77bcf86cd799439011",
    "supplyCount": 10,
    "addedAt": "2024-01-01T00:00:00.000Z",
    "endedAt": null
}
```

**Ошибки:**

- `400 Bad Request` - неверные параметры запроса

### GET `/auction/info`

Получить информацию об аукционе с историей ставок.

**Аутентификация:** Не требуется

**Параметры запроса (query):**

- `auctionId` (обязательный, строка) - идентификатор аукциона
- `limit` (опциональный, число) - количество ставок для возврата (по умолчанию 10, максимум 10)
- `offset` (опциональный, число) - смещение для пагинации (по умолчанию 0)

**Пример запроса:**

```bash
curl -X GET "http://localhost:5000/auction/info?auctionId=507f1f77bcf86cd799439011&limit=10&offset=0"
```

**Пример ответа (200 OK):**

```json
{
    "auction": {
        "id": "507f1f77bcf86cd799439011",
        "status": "active",
        "roundCount": 5,
        "currentRound": 1,
        "roundDuration": 60000,
        "roundStartTime": "2024-01-01T00:00:00.000Z",
        "roundEndTime": "2024-01-01T00:01:00.000Z",
        "giftCollectionId": "...",
        "supplyCount": 10,
        "addedAt": "2024-01-01T00:00:00.000Z",
        "endedAt": null
    },
    "bets": [
        {
            "id": "...",
            "userId": 123456,
            "auctionId": "507f1f77bcf86cd799439011",
            "amount": 100,
            "round": 1,
            "addedAt": "2024-01-01T00:00:00.000Z",
            "metaData": {}
        }
    ]
}
```

**Ошибки:**

- `400 Bad Request` - неверные параметры запроса
- `400 Bad Request` - `limit` должен быть меньше 10

### POST `/auction/bet`

Сделать ставку в аукционе.

**Аутентификация:** Требуется

**Заголовки:**

- `user-id` (обязательный) - числовой идентификатор пользователя
- `Content-Type: application/json`

**Тело запроса (JSON):**

- `auctionId` (обязательный, строка) - идентификатор аукциона
- `amount` (обязательный, число) - сумма ставки
- `balanceType` (обязательный, строка) - тип баланса: `"stars"`

**Пример запроса:**

```bash
curl -X POST http://localhost:5000/auction/bet \
  -H "user-id: 123456" \
  -H "Content-Type: application/json" \
  -d '{
    "auctionId": "507f1f77bcf86cd799439011",
    "amount": 100,
    "balanceType": "stars"
  }'
```

**Пример ответа (204 No Content):**

```
(пустое тело ответа)
```

**Ошибки:**

- `400 Bad Request` - неверные параметры запроса
- `400 Bad Request` - недостаточно средств на балансе
- `400 Bad Request` - аукцион не активен или раунд завершен

---

## Подарки

### GET `/gifts/my`

Получить список подарков текущего пользователя.

**Аутентификация:** Требуется

**Заголовки:**

- `user-id` (обязательный) - числовой идентификатор пользователя

**Параметры запроса:** Нет

**Пример запроса:**

```bash
curl -X GET http://localhost:5000/gifts/my \
  -H "user-id: 123456"
```

**Пример ответа (200 OK):**

```json
[
    {
        "id": "...",
        "giftId": "507f1f77bcf86cd799439011",
        "ownerId": 123456,
        "serialNumber": 1,
        "addedAt": "2024-01-01T00:00:00.000Z"
    }
]
```

**Ошибки:** Нет

### GET `/gifts/collections`

Получить список всех доступных коллекций подарков.

**Аутентификация:** Не требуется

**Параметры запроса:** Нет

**Пример запроса:**

```bash
curl -X GET http://localhost:5000/gifts/collections
```

**Пример ответа (200 OK):**

```json
[
    {
        "id": "507f1f77bcf86cd799439011",
        "collection": "plush_pepe",
        "supplyCount": 100,
        "addedAt": "2024-01-01T00:00:00.000Z"
    },
    {
        "id": "507f1f77bcf86cd799439012",
        "collection": "plush_fox",
        "supplyCount": 50,
        "addedAt": "2024-01-01T00:00:00.000Z"
    }
]
```

**Ошибки:** Нет

---

## Коды ошибок

- `400 Bad Request` - неверные параметры запроса или валидация не прошла
- `404 Not Found` - ресурс не найден
- `500 Internal Server Error` - внутренняя ошибка сервера

## Формат ошибок

При ошибке валидации (400) ответ имеет следующий формат:

```json
{
    "error": [
        {
            "code": "invalid_type",
            "expected": "string",
            "received": "number",
            "path": ["auctionId"],
            "message": "Expected string, received number"
        }
    ]
}
```

При ошибке в запросе ставки (400):

```json
{
    "message": "Invalid input",
    "errors": [
        {
            "code": "invalid_type",
            "expected": "string",
            "received": "number",
            "path": ["auctionId"],
            "message": "Expected string, received number"
        }
    ]
}
```
