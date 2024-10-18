document.addEventListener('DOMContentLoaded', function() {
  // Modal opener
  document.addEventListener('click', (e) => {
    const modalOpener = e.target.closest('.js-modal-opener');
    if (modalOpener !== null) {
      e.preventDefault();
      const modalId = modalOpener.dataset.modalId;
      openModal(modalId);
    }
  });

  // Close modal, when click outside of it
  document.addEventListener('click', function(e) {
    if ((e.target.classList.contains('modal')) ||
    (e.target.classList.contains('modal__box')) ||
    (e.target.closest('.js-modal-close'))) {
      closeModals();
    }
  });

  document.addEventListener('keydown', (event) => { 
    if (event.key === 'Escape') { 
      closeModals();
    }
  });

  window.openModal = openModal;
});


export const closeModals = () => {
  const modals =  document.querySelectorAll('.modal');
  if (modals.length > 0) {
    modals.forEach(modal => {
      modal.classList.remove('modal_active');
    });
    document.body.classList.remove('no-scroll');
  }
}

export const openModal = (id) => {
  closeModals();
  const modal = document.querySelector(`.js-modal[data-modal-id=${id}`);
  if (modal !== null) {
    document.body.classList.add('no-scroll');
    modal.classList.add('modal_active');
  }
}
