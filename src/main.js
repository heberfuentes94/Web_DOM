 // Menú hamburguesa funcionalidad
    document.addEventListener('DOMContentLoaded', function() {
      const menuBtn = document.querySelector('.header-menu-btn');
      const nav = document.querySelector('.header-nav');
      menuBtn.addEventListener('click', () => {
        nav.classList.toggle('open');
      });
    });