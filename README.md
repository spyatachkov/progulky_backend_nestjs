# API for "PROgulky" iOS app

## Description

API for travel app "PROgulky". VK Education 2022 (iOS)

Backend on
[Nest](https://github.com/nestjs/nest) framework TypeScript
<br>
Database: Postgres

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Развертывание
```bash

$ npm i
$ nest build

# PM2 SETUP
pm2 start dist/main.js --name progulkyapi

$ pm2 startup systemd
$ pm2 save

# ----------------
$ pm2 list # посмотреть запущенные процессы
$ pm2 delete <id> # удалить процесс с этим id

```

## Файлы
Файлы (картинки) сохраняются на диск в директорию ```files```. На сервере эта директория
лежит в той же директории что и проект. 

Схема расположения проекта на сервере вместе с директорией под файлы
```
var/www/.../-|
             |---  files  -- |
             |               | --- images --- |
             |               |                |-- excursions
             |               |                |-- places
             |               |-- other_files
             |                 
             |--- project -- |
                             | -- src
                             | -- .env
                             | -- docs
```

