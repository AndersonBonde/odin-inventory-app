const allButtons = document.querySelectorAll('button');

allButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const itemList = button.parentElement.parentElement.querySelector('ul');

    if (itemList.style.display === 'none') {
      itemList.style.display = 'block';
      button.textContent = '-';
    } else {
      itemList.style.display = 'none';
      button.textContent = '+';
    }
  });
});