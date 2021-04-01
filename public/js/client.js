const nameField = document.querySelector('#inputTitle1');
const lastName = document.querySelector('#inputTitle2');
const nicknameField = document.querySelector('#inputTitle3');
const emailField = document.querySelector('#inputTitle4');
const passwordField = document.querySelector('#inputTitle5');
const passwordRepeat = document.querySelector('#inputTitle6');

// Сворачивание панели навигации
const header = $('.navbar');
let scrollPrev = 0;

$(window).scroll(() => {
  const scrolled = $(window).scrollTop();

  if (scrolled > 100 && scrolled > scrollPrev) {
    header.addClass('out');
  } else {
    header.removeClass('out');
  }
  scrollPrev = scrolled;
});

// Функция рендериинга карты
function renderMap() {
  ymaps.ready(() => {
    const myMap = new ymaps.Map(
      document.querySelector('.map'),
      {
        center: [55.76, 37.64],
        zoom: 12,
        controls: ['typeSelector', 'fullscreenControl', 'zoomControl'],
      },
      { buttonMaxWidth: 300, balloonMaxWidth: 200 },
    );

    // eslint-disable-next-line prefer-destructuring
    const geolocation = ymaps.geolocation;

    geolocation
      .get({
        provider: 'yandex',
        mapStateAutoApply: true,
      })
      .then((result) => {
        result.geoObjects.get(0).properties.set({});
        myMap.geoObjects.add(result.geoObjects);
        myMap.setCenter(result.geoObjects.position, 12);
      });

    // Отслеживаем щелчки по карте
    myMap.events.add('click', (event) => {
      if (!myMap.balloon.isOpen()) {
        const coords = event.get('coords');
        myMap.geoObjects.add(new ymaps.Placemark(coords, {
          balloonContent: 'цвет <strong>воды пляжа бонди</strong>',
        }, {
          draggable: true,
        }));
        editor.startEditing();
        // myMap.balloon.open(coords, {
        //   contentHeader: 'Событие!',
        //   contentBody:
        //     `${'<p>Кто-то щелкнул по карте.</p>'
        //     + '<p>Координаты щелчка: '}${
        //       [coords[0].toPrecision(6), coords[1].toPrecision(6)].join(', ')
        //     }</p>`,
        //   contentFooter: '<sup>Щелкните еще раз</sup>',
        // });
      } else {
        myMap.balloon.close();
      }
    });
  });
}

// Проверки для форм
const alertBox = document.querySelector('#alertBox');
alertBox.setAttribute('style', 'display: none');
const alertBox2 = document.querySelector('#alertBox2');
alertBox2.setAttribute('style', 'display: none');

// Слушатель для кликов
document.addEventListener('click', async (event) => {
  // Регистрация
  if (event.target.dataset.id === 'registration') {
    event.preventDefault();

    if (
      !nameField.value
      || !lastName.value
      || !nicknameField.value
      || !emailField.value
      || !passwordField.value
      || !passwordRepeat.value
    ) {
      alertBox.removeAttribute('style');
      document.querySelector('#alertMessage').innerText = 'Заполните обязательные поля!';
    } else if (!document.querySelector('#inputTitle4').value.includes('@')) {
      alertBox.removeAttribute('style');
      document.querySelector('#alertMessage').innerText = 'Неверный формат E-mail!';
    } else if (!document.querySelector('#inputTitle5').value.match(/\d/g)) {
      alertBox.removeAttribute('style');
      document.querySelector('#alertMessage').innerText = 'Пароль должен содержать цифры!';
    } else if (passwordField.value !== passwordRepeat.value) {
      alertBox.removeAttribute('style');
      document.querySelector('#alertMessage').innerText = 'Введенные пароли не совпадают!';
    } else {
      const fetchQuery = await fetch('/registration/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: document.querySelector('#inputTitle1').value,
          lastName: document.querySelector('#inputTitle2').value,
          username: document.querySelector('#inputTitle3').value,
          email: document.querySelector('#inputTitle4').value,
          city: document.querySelector('#inputCity1').value,
          avatar: document.querySelector('#avatar').value,
          password: document.querySelector('#inputTitle5').value,
        }),
      });
      const result = await fetchQuery.text();
      if (result.includes('Пользователь с таким E-mail уже зарегистрирован!')) {
        document.querySelector('#alertBox').innerHTML = result;
      } else {
        document.querySelector('body').append(result);
        window.location = '/';
      }
    }
  }

  // Логин
  if (event.target.dataset.id === 'login') {
    event.preventDefault();
    const loginEmail = document.querySelector('#loginEmail').value;
    const loginPassword = document.querySelector('#loginPassword').value;

    if (!loginEmail || !loginPassword) {
      alertBox2.removeAttribute('style');
      document.querySelector('#alertMessage2').innerText = 'Заполните все поля!';
    } else if (!loginEmail.includes('@')) {
      alertBox2.removeAttribute('style');
      document.querySelector('#alertMessage2').innerText = 'Неверный формат E-mail!';
    } else {
      const fetchQuery = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
      const result = await fetchQuery.json();

      if (result.status === 'ok') {
        window.location = '/';
      } else {
        alertBox2.removeAttribute('style');
        document.querySelector('#alertMessage2').innerText = 'Неверный логин и/или пароль';
      }
    }
  }

  // Открыть форму создания приключения
  if (
    event.target.dataset.id === 'nav-create'
    && !document.querySelector('.trip-creation-form')
  ) {
    const fetchQuery = await fetch('/profile/create', {
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await fetchQuery.text();
    document.querySelector('#nav-create').innerHTML = result;
  }

  // Открыть созданные приключения
  if (event.target.dataset.id === 'nav-created') {
    const fetchQuery = await fetch('/profile/created', {
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await fetchQuery.text();
    document.querySelector('#nav-contact').innerHTML = result;
  }

  // Удалить свое приключение
  if (event.target.dataset.id === 'delete-btn') {
    alert('Вы уверены, что хотите удалить это приключение?');
    const fetchQuery = await fetch(`/delete/${event.target.dataset.entryid}`, {
      method: 'DELETE',
    });

    const responseJson = await fetchQuery.json();

    if (!responseJson.isDeleteSuccessful) {
      alert(responseJson.errorMessage);
    } else {
      const request = await fetch('/profile/created', {
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await request.text();
      document.querySelector('#nav-contact').innerHTML = result;
    }
  }

  // Добавить путевую точку
  if (event.target.dataset.id === 'addWaypoint') {
    const waypointsList = document.querySelector('#waypointsList');
    waypointsList.insertAdjacentHTML(
      'beforeend',
      `<div class="form-floating col-sm-9">
        <div class="form-floating col-sm-9 mb-3 waypoint">
          <div class="col-md-6 mb-3">
            <label for="waypointTitle" class="form-label">Название точки  <sup style="color: red;">*</sup></label>
            <input type="text" class="form-control waypointTitle" required>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control waypointDescription" placeholder='Например, "Городец за один день"' required>
            <label>Описание <sup style="color: red;">*</sup></label>
          </div>
          <div class="form-floating mb-3">
            <button type="button" data-id="deleteWaypoint" class="btn btn-outline-primary">Удалить точку</button>
          </div>
          <div class="row mb-3">
          <div class="col">
            <p class="col-sm-5 col-form-label">Карта</p>
            <button type="button" data-id="addMap" class="btn btn-outline-primary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Открыть карту</button>
          </div>
        </div>
        </div>
      </div>`,
    );
  }

  // Отобразить карту
  if (event.target.dataset.id === 'addMap') {
    renderMap();
  }

  // Отправка формы, создание приключения
  if (event.target.dataset.id === 'createAdventure') {
    event.preventDefault();
    // Заголовки путевых точек
    const waypointTitles = document.querySelectorAll('.waypointTitle');
    const waypointTitlesValues = [];
    waypointTitles.forEach((el) => waypointTitlesValues.push(el.value));
    // Описания путевых точек
    const waypointDescriptions = document.querySelectorAll('.waypointDescription');
    const waypointDescriptionsValues = [];
    waypointDescriptions.forEach((el) => waypointDescriptionsValues.push(el.value));
    // Собираем путевые точки с заголовками в один массив
    const waypointsAll = [];
    for (let i = 0; i < waypointTitlesValues.length; i += 1) {
      waypointsAll.push([waypointTitlesValues[i], waypointDescriptionsValues[i]]);
    }

    console.log(waypointsAll);

    const fetchQuery = await fetch('/profile/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: document.querySelector('#floatingInput').value,
        category: document.querySelector('#floatingSelect').value,
        description: document.querySelector('#floatingTextarea2').value,
        routePlan: waypointsAll,
        // coordinates
        // photos
      }),
    });

    const result = await fetchQuery.text();
    document.querySelector('#nav-create').innerHTML = result;
  }
});

// AJAX-подгрузка главной страницы
let scrollCounter = 0;
window.addEventListener('scroll', async () => {
  scrollCounter += 1;
  if (
    document.querySelector('#carouselExampleSlidesOnly')
    && !document.querySelector('#main')
    && scrollCounter <= 1
  ) {
    const fetchQuery = await fetch('/main', {
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await fetchQuery.text();
    document.querySelector('main').innerHTML = result;
  }

  if ($('.category-container')) {
    setTimeout(() => {
      const main = $('.category-container');
      main.addClass('show');
    }, 710);
  }
});
