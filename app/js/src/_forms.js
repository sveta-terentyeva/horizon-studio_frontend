document.addEventListener('DOMContentLoaded', function() {
  // Add 'empty' class for empty selects
  const selectsSet = document.querySelectorAll('.js-select');
  for (const select of selectsSet) {
    select.addEventListener('change', () => {
      if (select.value === null || select.value === '') {
        select.classList.add('empty');
      } else {
        select.classList.remove('empty');
      }
    });
    // Trigger 'change' event on all selects
    const event = new Event('change');
    select.dispatchEvent(event);
  }

});
