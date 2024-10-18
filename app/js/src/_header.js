document.addEventListener('DOMContentLoaded', function() {
  // fixed header outer height
  const header = document.querySelector('.js-main-header');
  let headerHeight
  
  let windowWidth = document.documentElement.clientWidth;
  fixedHeaderHeight();
  getScrollbarWidth();
  
  // header scroll
  let fixedHeaderTimeout;
  window.addEventListener('scroll', function() {
    let scroll = window.scrollY;
    
    clearTimeout(fixedHeaderTimeout);
    
    fixedHeaderTimeout = setTimeout(() => {
      if (scroll > 50) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    }, 1);
  });
  // Trigger 'scroll' event
  const scrollEvent = new Event('scroll');
  window.dispatchEvent(scrollEvent);
  
  let resizeTimeout;
  let resizeCallback = function() {
    // Only when window width was changed
    if (windowWidth !== document.documentElement.clientWidth) {
      windowWidth = document.documentElement.clientWidth;

      fixedHeaderHeight();
      getScrollbarWidth();
    }
  }
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCallback, 100)
  });
  
  function fixedHeaderHeight() {
    header.classList.remove('is-scrolled');
    headerHeight = header.offsetHeight;
    // Set CSS custom property with main-header height value
    document.documentElement.style.setProperty('--main-header-height', headerHeight + "px");
  }
  
  function getScrollbarWidth() {
    const scrollbarWidth = window.innerWidth - windowWidth;
    document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + "px");
  }
});
