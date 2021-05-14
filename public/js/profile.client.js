// Изменение аватара
const myModal = new bootstrap.Modal(document.getElementById('avatarModal'));
const userAvatar = document.getElementById('userAvatar');
const avatarEditButton = document.getElementById('avatar-edit-button');
const avatarInput = document.getElementById('avatarFile');
const avatarUploadButton = document.getElementById('avatar-upload');
const spinnerButton = document.getElementById('btn-hidden');

// Обновление аватара
avatarEditButton.addEventListener('click', () => {
  myModal.show();
});

avatarUploadButton.addEventListener('click', async (event) => {
  event.preventDefault();

  if (avatarInput.value) {
    const formData = new FormData();
    const avatarUploadField = document.getElementById('avatarFile');
    formData.append('avatarFile', avatarUploadField.files[0]);

    avatarUploadButton.hidden = true;
    spinnerButton.hidden = false;

    const response = await fetch('/profile', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    userAvatar.setAttribute('src', `/img/avatar/${result.image}`);

    avatarUploadButton.hidden = true;
    spinnerButton.hidden = true;

    myModal.hide();
  }
});

// Функция рендериинга карты
function renderMap() {
  document.querySelector('.form-map').innerHTML = '';
  ymaps.ready(() => {
    const myMap = new ymaps.Map(
      document.querySelector('.map'),
      {
        center: [55.76, 37.64],
        zoom: 12,
        controls: [
          'typeSelector',
          'fullscreenControl',
          'zoomControl',
          'searchControl',
        ],
      },
      {
        buttonMaxWidth: 300,
        balloonMaxWidth: 200,
        searchControlProvider: 'yandex#search',
      }
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
        // myMap.setCenter(result.geoObjects.position, 12);
      });

    // Отслеживаем щелчки по карте
    myMap.events.add('click', (event) => {
      if (!myMap.balloon.isOpen()) {
        const coords = event.get('coords');
        document
          .getElementById('mapDataHidden')
          .insertAdjacentHTML(
            'beforeend',
            `<input type="text" name="map" style="display: none" class="mapCoordinates" value="${coords}">`
          );
        myMap.geoObjects.add(
          new ymaps.Placemark(
            coords,
            {
              balloonContent: 'цвет <strong>воды пляжа бонди</strong>',
            },
            {
              draggable: true,
            }
          )
        );
      } else {
        myMap.balloon.close();
      }
    });
  });
}

document.addEventListener('click', async (event) => {
  // Открыть взятые приключения
  if (event.target.dataset.id === 'nav-my') {
    const fetchQuery = await fetch('/profile/myadventures', {
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await fetchQuery.text();
    document.getElementById('nav-my').innerHTML = result;
  }

  // Открыть запланированные приключения
  if (event.target.dataset.id === 'nav-plans') {
    const fetchQuery = await fetch('/profile/myadventures/planned', {
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await fetchQuery.text();
    document.getElementById('nav-plans').innerHTML = result;
  }

  // Открыть форму создания приключения
  if (
    event.target.dataset.id === 'nav-create' &&
    !document.querySelector('.trip-creation-form')
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
        </div>
        </div>
      </div>`
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
    const waypointDescriptions = document.querySelectorAll(
      '.waypointDescription'
    );
    const waypointDescriptionsValues = [];
    waypointDescriptions.forEach((el) =>
      waypointDescriptionsValues.push(el.value)
    );
    // Собираем путевые точки с заголовками в один массив
    const waypointsAll = [];
    for (let i = 0; i < waypointTitlesValues.length; i += 1) {
      waypointsAll.push([
        waypointTitlesValues[i],
        waypointDescriptionsValues[i],
      ]);
    }

    const mapCoordinates = [];
    document
      .querySelectorAll('.mapCoordinates')
      .forEach((el) => mapCoordinates.push(el.value.split(',')));

    const titleInput = document.querySelector('#floatingInput');
    const categoryInput = document.querySelector('#floatingSelect');
    const descriptionInput = document.querySelector('#floatingTextarea2');

    if (
      !titleInput.value ||
      !categoryInput.value ||
      !descriptionInput.value ||
      !waypointsAll.length
    ) {
      document.querySelector('#alertBox').removeAttribute('style');
      document.querySelector('#alertMessage').innerText =
        'Заполните обязательные поля!';
    } else {
      const fetchQuery = await fetch('/profile/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleInput.value,
          category: categoryInput.value,
          description: descriptionInput.value,
          routePlan: waypointsAll,
          coordinates: mapCoordinates,
          // photos
        }),
      });

      const result = await fetchQuery.text();
      document.querySelector('#nav-create').innerHTML = result;
    }
  }

  // Отправка формы, редактирование приключения
  if (event.target.dataset.id === 'editAdventure') {
    event.preventDefault();

    // Заголовки путевых точек
    const waypointTitles = document.querySelectorAll('.waypointTitle');
    const waypointTitlesValues = [];
    waypointTitles.forEach((el) => waypointTitlesValues.push(el.value));
    // Описания путевых точек
    const waypointDescriptions = document.querySelectorAll(
      '.waypointDescription'
    );
    const waypointDescriptionsValues = [];
    waypointDescriptions.forEach((el) =>
      waypointDescriptionsValues.push(el.value)
    );
    // Собираем путевые точки с заголовками в один массив
    const waypointsAll = [];
    for (let i = 0; i < waypointTitlesValues.length; i += 1) {
      waypointsAll.push([
        waypointTitlesValues[i],
        waypointDescriptionsValues[i],
      ]);
    }

    const titleInput = document.querySelector('#floatingInput');
    const categoryInput = document.querySelector('#floatingSelect');
    const descriptionInput = document.querySelector('#floatingTextarea2');

    if (
      !titleInput.value ||
      !categoryInput.value ||
      !descriptionInput.value ||
      !waypointsAll.length
    ) {
      document.querySelector('#alertBox').removeAttribute('style');
      document.querySelector('#alertMessage').innerText =
        'Заполните обязательные поля!';
    } else {
      const fetchQuery = await fetch(`/category/owner/${event.target.dataset.adventure}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleInput.value,
          category: categoryInput.value,
          description: descriptionInput.value,
          routePlan: waypointsAll,
        }),
      });

      const result = await fetchQuery.text();
      document.querySelector('.body-wrapper').innerHTML = result;
    }
  }
});

// Удаление приключения
let entryId = '';
let deleteModal = '';
document.addEventListener('click', async (event) => {
  if (event.target.dataset.id === 'delete-btn') {
    entryId = event.target.dataset.entryid;

    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  if (event.target.dataset.id === 'adventure-delete') {
    const adventureDeleteButton = document.getElementById('adventure-delete');
    const deleteSpinnerButton = document.getElementById('delete-btn-hidden');

    adventureDeleteButton.hidden = true;
    deleteSpinnerButton.hidden = false;

    const fetchQuery = await fetch(`/delete/${entryId}`, {
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

    adventureDeleteButton.hidden = false;
    deleteSpinnerButton.hidden = true;

    deleteModal.hide();
  }
});
