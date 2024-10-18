/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', function() {
  calcTrueVh();

  // Listen to the resize event and calc true viewpoert height value
  window.addEventListener('resize', calcTrueVh);

  function calcTrueVh() {
    // Get the viewport height and multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
});
