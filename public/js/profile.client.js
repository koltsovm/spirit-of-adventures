// Изменение аватара
const myModal = new bootstrap.Modal(document.getElementById('avatarModal'));
const userAvatar = document.getElementById('userAvatar');
const avatarEditButton = document.getElementById('avatar-edit-button');
const avatarInput = document.getElementById('avatarFile');
const avatarUploadButton = document.getElementById('avatar-upload');
const spinnerButton = document.getElementById('btn-hidden');

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
