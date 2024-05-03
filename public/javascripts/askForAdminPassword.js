const password = 'nqftc1316';

const adminLinks = document.querySelectorAll('.admin_link');
const adminPassword = document.querySelector('.admin_password');

adminLinks.forEach((link) => {
  link.classList.add('disabled');
});

adminPassword.addEventListener('click', (e) => {
  e.preventDefault();
  const pass = prompt('Pasword');
  if (pass == password) {
    adminLinks.forEach((link) => {
      link.classList.remove('disabled');
    });
  }
});
