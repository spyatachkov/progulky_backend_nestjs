# Докумантация по работа с API PROgulky

### Терминология

*Экскурсия* - объект имеющий название, автора и массив мест (точек на карте). 
Является главной сущностью вокруг которой строится всё API.

*Место* - точка на карте, объект, имеющий название и координаты, который можно добавить 
к экскурсии

## Предметные области API

1. [Авторизация и регистрация](#auth)
2. [Роли](#roles)
4. [Экскурсия и место](#excursion)


### <a name="auth"></a>Авторизация и регистрация

Для создания экскурсии необходим автор, поэтому создавать экскурсии может только
авторизованный пользователь.
<br>
Просмотр списка всех экскурсий (GET-запрос ```/excursions```) работает без авторизации.

#### Регистрация
Для регистрации пользователя необходимо отправить POST-запрос на ручку
```/auth/registration``` с объектом 
```json
{
  "name": "Имя",
  "email": "mail@email.ru",
  "password": "password"
}
```
*Уникальным в базе является имя пользователя ```"name"```, а поэтому создать двух 
пользователей с одинаковыми именами не получится.*

После регистрации бэкенд возвращает клиенту объект:
```json
{
  "token": "eyJhbGciOi1NiIsInR5cCIVCJ9-.1i_WC_pfx_kb7ljN4hnVGrrnr2eWB_Tv6AiJ4QHq",
  "name": "Имя",
  "id": 1,
  "email": "mail@mail.ru",
  "role": {
    "id": 2,
    "value": "user",
    "description": "Пользователь"
  }
}
```
С полученным токеном и id пользователь в дальнейшем может посылать запросы на создание
экскурсий и мест.

*Примечание: на данный момент токен не участвует в отправки запросов и доступность
методов никак не ограничена в зависимости от ролей пользователя*

#### Авторизация
Для авторизации пользователя необходимо отправить POST-запрос на ручку
```/auth/login``` с объектом
```json
{
  "name": "Имя",
  "password": "password"
}
```

В ответе вернется полный объект со всеми данными пользователя
(такой же объект что в ответе при регистрации).

**Важно!** На данный момент важно запоминать ```id``` пользователя для отправки 
запросов на создание чего либо. Так как создание экскурсий 
требует наличие этого идентификатора. В дальнейшем от этого избавимся (всё будет 
приходить в токене)

### <a name="roles"></a>Роли

***Пока разграничения доступности методов API по ролям нет
(в будущем это будет реализовано).
Прямо сейчас это нужно только для того, чтобы на фронте рисовать зеленую плашку
«от экскурсовода», если экскурсия была создана пользователем в ролью экскурсовод.***

В API заложено три роли:
1. Пользователь
2. Экскурсовод
3. Администратор

Роль **«Пользователь»** получает пользователь при регистрации.

Роль **«Экскурсовод»** получает пользователь по требованию от администрации проекта.
Роль экскурсовод добавляет всем созданным экскурсиям плашку «от экскурсовода».
От этого все созданные экскурсии пользователем под этой ролью становятся более привлекательными.

Роль **«Администратор»** получают администраторы проекта.
Роль должна позволяет удалять/изменять/банить всё и всех.


### <a name="excursion"></a>Экскурсия и место

#### Экскурсия (Excursion)

В API есть две фундаментальные сущности, которые должны быть связаны между собой.
Одно из них это Экскурсия. 

***Excursion*** - объект имеющий название, автора и массив мест (достопримечательностей), 
который описывает цельную стуктуру некоторого собятия, прогулки и т.п.

Объект **Excursion** имеет важные следующие свойства:
1. Заголовок
2. Описание
3. URL-Картинки
4. OwnerId
5. Places []<br>И др. (cм. Swagger)

***OwnerId*** - идентификатор пользователя, который создаёт экскурсию.
По нему получается свойство owner с объектом создателя.

***Places[]*** - массив объектов мест (точек) экскурсии.

*Пример объекта, который возвращается при GET-запросе по ручке ```/excursions```:*
```json
    {
        "title": "Интересная Москва",
        "description": "Интерересное описание экскурсии",
        "ownerId": 15,
        "imagePath": "site.com/image/pic/pic.img",
        "rating": 4.91,
        "duration": "2 часа",
        "owner": {
            "id": 15,
            "name": "Семен",
            "email": "user@email.ru"
        },
        "places": []
    },
```

#### Место (Place)

***Place*** - объект имеющий название и координаты, который можно добавить
к экскурсии. Это может быть достопримечательность, интересное место и т. д.

   Объект *Place* имеет следующие свойства:
1. Название
2. Описание
3. URL-картинки
4. Адрес
5. Город
6. Широта точки на карте
7. Долгота точки на карте

*Пример объекта Place:*
```json
{
  "title": "Большой театр",
  "description": "Самый большой театр в стране. Поэтому и называется большой",
  "imagePath": "site.com/image/pic/pig.img",
  "address": "Театральная площадь, 1",
  "city": "Москва",
  "latitude": "55.760452",
  "longitude": "37.618373"
}
```

Объект места создаётся отдельно от экскурсии (отдельным POST-запросом).
Для создания места нужно только лишь передать необходимые свойства в POST-запросе.
Место никак не связывается с пользователем, который создаёт это место.
То есть у созданного места нет автора (это стоит помнить).

Созданное место необходимо ***«привязать»*** к экскурсии, чтобы это место появилось в 
массиве объектов ```places[]``` объекта экскурсии.

Привязка места осуществляется отдельным  POST-запросом,
(методом ```/excursions/add_place```) в котором передаётся
excursionId (id экскурсии) и placeId (Id места),
а кроме этого порядковый номер этого места в этой экскурсии
(необходимо для упорядочивания мест на маршруте внутри одной экскурсии).

*Пример POST-запроса, который привязывает точку с ```id = 1``` экскурсии с ```id = 2```,
а кроме этого задает порядковый номер точки в экскурсии.*
```json
{
  "placeId": 1,
  "excursionId": 2,
  "sort": 1
}
```

То есть, чтобы создать полноценную экскурсию, надо:
1. Создать объект экскурсии
2. Создать (или найти) необходимые места
3. Привязать каждое необходимое место к экскурсии

<hr>

*Последнее обновление: 29.10.2022*