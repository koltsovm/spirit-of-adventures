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
