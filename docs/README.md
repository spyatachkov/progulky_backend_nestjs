# Докумантация по работе с API PROgulky

### Терминология

*Экскурсия* - объект имеющий название, автора и массив мест (точек на карте).
Является главной сущностью вокруг которой строится всё API.

*Место* - точка на карте, объект, имеющий название и координаты, который можно добавить
к экскурсии
<hr>

## Предметные области API

1. [Авторизация и регистрация](#auth)
2. [Роли](#roles)
3. [Экскурсия и место](#excursion)
4. [Механизм создания экскурсии](#create_excursion)
5. [Избранное](#favorites)
6. [Картинки](#images)

<hr>

## <a name="auth"></a>Авторизация и регистрация

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

*Уникальным в базе является имя пользователя ```"email"```, а поэтому создать двух
пользователей с одинаковой почтой не получится.*

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
экскурсий, мест, добавления их в избранное.

*Примечание: на данный момент токен нужен для создания экскурсий, добавления их в избранное, удаления из избранного,
показа всех экскурсий включая избранные.*

#### Авторизация

Для авторизации пользователя необходимо отправить POST-запрос на ручку
```/auth/login``` с объектом

```json
{
  "email": "email@email.ru",
  "password": "password"
}
```

В ответе вернется полный объект со всеми данными пользователя
(такой же объект что в ответе при регистрации).


<hr>

## <a name="roles"></a>Роли

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

<hr>

## <a name="excursion"></a>Экскурсия и место

#### Экскурсия (Excursion)

В API есть две фундаментальные сущности, которые должны быть связаны между собой.
Одно из них это Экскурсия.

***Excursion*** - объект имеющий название, автора и массив мест (достопримечательностей),
который описывает цельную стуктуру некоторого собятия, прогулки и т.п.

Объект **Excursion** имеет важные следующие свойства:

1. id
2. Заголовок
3. Описание
4. Название картинки
5. OwnerId
6. Флаг isFavorite (по умолчанию false, но если ручку дергает авторизованный пользователь, то те экскурсии, которые он добавил в избранное помечаются флагом true)
7. Значение роли пользователя, который создал экскурсию
8. Places []<br>И др. (cм. Swagger)

***OwnerId*** - идентификатор пользователя, который создаёт экскурсию.
По нему получается свойство owner с объектом создателя. Это свойство приходит из авторизационного токена, как userId.

***Places[]*** - массив объектов мест (точек) экскурсии.

*Пример объекта, который возвращается при GET-запросе по ручке ```/excursions```:*

```json
    {
  "id": 1,
  "title": "Интересная Москва",
  "description": "Интерересное описание экскурсии",
  "ownerId": 15,
  "isFavorite": false,
  "ownerRoleValue": "guide",
  "image": "5220-4f26-8f78-67dbc13bd1c0.jpg",
  "rating": 4.91,
  "duration": 60,
  "distance": 3.3,
  "numberOfPoints": 3,
  "owner": {
    "id": 15,
    "name": "Семен",
    "email": "user@email.ru"
  },
  "places": []
}
```

#### Место (Place)

***Place*** - объект имеющий название и координаты, который можно добавить
к экскурсии. Это может быть достопримечательность, интересное место и т. д.

Объект *Place* имеет следующие свойства:

1. Название
2. Описание
3. Название картинки
4. Адрес
5. Город
6. Широта точки на карте
7. Долгота точки на карте

*Пример объекта Place:*

```json
{
  "title": "Большой театр",
  "description": "Самый большой театр в стране. Поэтому и называется большой",
  "image": "5220-4f26-8f78-67dbc13bd1c0.jpg",
  "address": "Театральная площадь, 1",
  "city": "Москва",
  "latitude": 55.760452,
  "longitude": 37.618373
}
```

Объект места создаётся отдельно от экскурсии (отдельным POST-запросом типа ```multipart/form-data```).
Для создания места нужно передать необходимые параметры и картинку места в POST-запросе с типом ```multipart/form-data```,
где картинка передается как File, а все остальное как Text.

Место никак не связывается с пользователем, который создаёт это место.
То есть у созданного места нет автора (это стоит помнить).

После создания места, бэкенд возвращает ```id``` этого созданного места, которое необходимо запоминать
на фронте, чтобы потом создать экскурсию с этим местом.

<hr>

## <a name="create_excursion"></a>Механизм создания экскурсии

Создание экскурсии происходит через метод```/excursions``` POST-запросом.
Чтобы создать экскурсию нужно приготовить все необходимые поля.

Тело запроса на создание экскурсии надо создавать в соотвествии с типом  ```multipart/form-data```

**Поля multipart/form-data тела POST-запроса на создание экскурсии**

| Название параметра | Описание параметра                                                                 |
|--------------------|:-----------------------------------------------------------------------------------|
| title (Text)       | Заголовок экскурсии                                                                |
| description (Text) | Описание экскурсии                                                                 |
| image (File)       | Файл картинки                                                                      |
| duration (number)  | Продолжительность экскурсии (мин)                                                  |
| distance (number)  | Расстояние всего маршрута (км)                                                     |
| placesIds (Text)   | Строка id-шников мест, которые относятся к этой экскурсии (в порядке на маршруте)  |

В заголовке запроса c ключом "Authorization" подкладывается Bearer токен пользователя, полученный при авторизации.

**Пример заголовка:**

```Authorization: Bearer iIsInR5cCI6IkpXVCJ9jferjfn...fkebrfh```

*Примечания*: 
<br>
***duration*** нужно класть значение именно как Int!
в ***distance***  как Double!
<br>
в ***placesIds*** нужно класть именно СТРОКУ из айдишников мест через запятую, которые надо прикрепить к этой экскурсии, в том порядке,
в котором эти места идут в маршруте!
<br>

**Вывод**
<br>
Экскурсия создается одним POST-запросом c multipart/form-data, в котором присваиваются все места этой экскурсии,
путем передачи id-шников этих мест. Id-шники передаются строкой через запятую.
<br>
Файл прикрепляется в поле image, как File.

## <a name="favorites"></a>Механизм доабвление экскурсий в избранное и удаление их оттуда

Все методы работы с избранным требуют авторизационного токена. Если токена нет - вернется 401.
В заголовке Authorization передаем Bearer токен, т.к в токене содержится информация о пользователе, который добавляет экскурсию к себе в избранное.

1. Для добавления экскурсии необходимо отправить POST-запрос на ручку ```/excursions/add_favorite``` у которого в теле запроса необходимо 
передать id добавляемой экскурсии.

*Пример если хотим добавить экскурсию с id = 1*
```json
{
  "excursionId": 1
}
```
2. Для удаления экскурсии из избранного необходимо отправить DELETE-запрос на ручку ```/excursions/delete_favorite```, у которого в теле запроса необходимо передать
 id удаляемой экскурсии.

*Пример если хотим удалить экскурсию с id = 1*
```json
{
  "excursionId": 1
}
```
<hr>

## <a name="images"></a>Картинки

В объектах Excursion() и Place() в GET-запросе в свойстве ```"image"``` находится название с которым
картинка сохранилась на диск. Картинки экскурсий и картинки мест сохраняются по разным путям.

Картинку можно получить:
<br>
1. Для Excursion -> ```/images/excursions/<image_name.jpg>```
2. Для Place -> ```/images/places/<image_name.jpg>```

<hr>

*Последнее обновление: 5.12.2022*