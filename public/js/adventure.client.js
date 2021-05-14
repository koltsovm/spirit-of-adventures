// Отображаем карту на странице приключения
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
