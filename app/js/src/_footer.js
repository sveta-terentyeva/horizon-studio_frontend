document.addEventListener('DOMContentLoaded', function() {
  const footerEl = document.querySelector('.js-main-footer');
  if (footerEl !== null) {
    const copyYearEl = footerEl.querySelector('.js-main-footer__copy-year');
    const year = new Date().getFullYear();
    const curYear = +copyYearEl.textContent;
    if (year > curYear) {
      copyYearEl.textContent = year;
    }
  }
});
