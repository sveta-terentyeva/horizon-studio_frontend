document.addEventListener('DOMContentLoaded', function() {
  // burger menu
  const header = document.querySelector('.js-main-header');
  const menuOpener = document.querySelector('.js-menu-opener');
  const menu = document.querySelector('.js-main-menu');
  const menuList = document.querySelector('.js-main-menu__list');
  const body = document.body;
  if (menuOpener !== null) {
    menuOpener.addEventListener('click', () => {
      menuOpener.classList.toggle('active');
      menu.classList.toggle('active');
      menuList.classList.toggle('active');
      if (header !== null) {
        if (menu.classList.contains('active') === false && window.scrollY > 50) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      }
      body.classList.toggle('no-scroll');
    });
  }
});
