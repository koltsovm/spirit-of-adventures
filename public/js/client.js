const nameField = document.querySelector('#inputTitle1');
const lastName = document.querySelector('#inputTitle2');
const nicknameField = document.querySelector('#inputTitle3');
const emailField = document.querySelector('#inputTitle4');
const passwordField = document.querySelector('#inputTitle5');
const passwordRepeat = document.querySelector('#inputTitle6');

const alertBox = document.querySelector('#alertBox');
alertBox.setAttribute('style', 'display: none');

document.addEventListener('click', async (event) => {
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
});
