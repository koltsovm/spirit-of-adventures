# spirit-of-adventures

## MVP

### Release 0. DataBase
* Подключение БД
* Создание моделей БД
  * Модель пользователя
    * Имя
    * Фамилия
    * Никнейм
    * Имейл
    * Пароль
  * Модель путешествия
    * Название
    * Автор
    * Категория
    * Описание
    * Путевой план (в каком виде?)
    * Координаты путевых точек
    * Фотографии
### Release 1. Server, authorization
* Сервер на express
* Авторизация и аутентификация на session-express
### Release 2. Frontend
* Frontend
  * Главная страница
    * Хэдер
      * Лого, название, навбар (войти/зарегистрароваться), личный кабинет
    * Блок - фотка с заголовком
    * Основной блок - категории путешествий.
    * Футер
  * Страницы входа и регистрации (модалка?)
  * Личный кабинет
    * Мои приключения (пройденные/активные/запланированные)
    * Авторский раздел (создание приключений)
  * Страницы приключений в каждой категории
  * Страница отдельного приключения
    * Название
    * Описание
    * Путевой план полностью или частично, если платное
    * Карта (полностью или частично)
    * Кнопки "купить"/"начать приключение"/"запланировать"/"лайк"/"отзыв"
    * Отзывы, рейтинг
  * "О проекте" (опиционально)
