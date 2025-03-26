# rest-api-test-2
Это инструкция по запуску проекта у себя локально. Вам нужно сделать следующее:
## 1. Клонируйте репозиторий:
```bash
git clone https://github.com/exxxcellent/rest-api-test-2.git
```
## 2. Создайте .env файл:
Пример такого файлас переменными окружения
```env
#app config
API_PORT=3000
HOST=http://localhost:${API_PORT}
#auth config
PASSWORD_SALT="someonesalt"
ACCESS_TOKEN_SECRET="someaccesssecret"
REFRESH_TOKEN_SECRET="somerefreshsecret"
# db config
POSTGRES_USER=postgres
POSTGRES_PWD=123456
POSTGRES_DB=db_rest_api
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
# redis config
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URL=redis://${REDIS_HOST}:${REDIS_PORT}
```
## Сборка и запуск проекта
### 3.1 Cборка контейнеров:
Не забудьте запустить Docker Desktop)
```yml
docker-compose build
```
### 3.2 Запуск контейнеров:
```yml
docker-compose up -d
```
### 3.3 Или:
```yml
docker-compose up -d --build
```
