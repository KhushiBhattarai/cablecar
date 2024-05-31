const navToggle = document.querySelector('nav');
const navToggleBtn = document.querySelector('.nav-toggle-btn');

navToggleBtn.addEventListener('click', () => {
    navToggle.classList.toggle('active');
});