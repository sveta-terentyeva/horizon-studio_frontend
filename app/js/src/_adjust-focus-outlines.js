document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('keydown', function(e) {
    if (e.code === 'Tab' || e.key === 'Tab' || e.keyCode === 9) {
      document.body.classList.add('show-focus-outlines');
    }
  });
  
  document.addEventListener('click', function(e) {
    document.body.classList.remove('show-focus-outlines');
  });
});
