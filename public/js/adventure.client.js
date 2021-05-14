// Отображение карты на странице приключения
if (document.querySelector('.adventure-card-map')) {
  const coordinatesText = document.querySelector('#coordinatesStorage').value;
  const coordinates = coordinatesText.split(',');
  const coordinatesFormatted = [];
  for (let i = 0; i < coordinates.length; i += 2) {
    coordinatesFormatted.push([coordinates[i], coordinates[i + 1]]);
  }

  const routePlanItemsTitles = document.querySelectorAll('.routePlanItemTitle');
  const routePlanItemsDescriptions = document.querySelectorAll(
    '.routePlanItemDescription'
  );

  ymaps.ready(() => {
    const myMap = new ymaps.Map(
      document.querySelector('.map'),
      {
        center: coordinatesFormatted[0],
        zoom: 12,
        controls: ['typeSelector', 'fullscreenControl', 'zoomControl'],
      },
      { buttonMaxWidth: 300, balloonMaxWidth: 200 }
    );

    for (let i = 0; i < coordinatesFormatted.length; i += 1) {
      myMap.geoObjects.add(
        new ymaps.Placemark(
          coordinatesFormatted[i],
          {
            balloonContent: `<b>${routePlanItemsTitles[i].innerText}</b><br>${routePlanItemsDescriptions[i].innerText}`,
          },
          {
            draggable: false,
          }
        )
      );
    }
  });
}

document
  .getElementById('adventure-controls')
  .addEventListener('click', async (event) => {
    // Переключение кнопок "запланировать и начать приключение" после нажатия
    // if (event.target.id === 'plan-button') {
    //   document.getElementById('plan-button').hidden = true;
    //   document.getElementById('unplan-button').hidden = false;
    // }

    // if (event.target.id === 'unplan-button') {
    //   document.getElementById('unplan-button').hidden = true;
    //   document.getElementById('plan-button').hidden = false;
    // }

    // Старт приключения
    if (event.target.id === 'start-button') {
      const response = await fetch(
        `/profile/myadventures/start/${event.target.dataset.id}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const result = await response.json();

      if (result.status === 'ok') {
        document.getElementById('start-button').hidden = true;
        document.getElementById('stop-button').hidden = false;
        document.getElementById('plan-button').hidden = true;
        document.getElementById('unplan-button').hidden = true;
      }
    }

    // Стоп приключения
    if (event.target.id === 'stop-button') {
      const response = await fetch(
        `/profile/myadventures/stop/${event.target.dataset.id}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const result = await response.json();

      if (result.status === 'ok') {
        document.getElementById('stop-button').hidden = true;
        document.getElementById('start-button').hidden = false;
        document.getElementById('plan-button').hidden = false;
        document.getElementById('unplan-button').hidden = true;
      }
    }

    // Планирование приключения
    if (event.target.id === 'plan-button') {
      const response = await fetch(
        `/profile/myadventures/plan/${event.target.dataset.id}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const result = await response.json();

      if (result.status === 'ok') {
        document.getElementById('plan-button').hidden = true;
        document.getElementById('unplan-button').hidden = false;
      }
    }

    // Отмена планирования
    if (event.target.id === 'unplan-button') {
      const response = await fetch(
        `/profile/myadventures/unplan/${event.target.dataset.id}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const result = await response.json();

      if (result.status === 'ok') {
        document.getElementById('plan-button').hidden = false;
        document.getElementById('unplan-button').hidden = true;
      }
    }
  });
