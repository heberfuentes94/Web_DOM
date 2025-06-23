document.addEventListener('DOMContentLoaded', function() {
  // Cargar menú externo si existe el div#menu
  const menuDiv = document.getElementById('menu');
  if (menuDiv) {
    fetch('/src/components/menu.html')
      .then(res => res.text())
      .then(html => {
        menuDiv.innerHTML = html;
        // Activar funcionalidad del menú hamburguesa después de cargarlo
        const menuBtn = menuDiv.querySelector('.header-menu-btn');
        const nav = menuDiv.querySelector('.header-nav');
        menuBtn.addEventListener('click', () => {
          nav.classList.toggle('open');
        });
      });
  } else {
    // Si el menú está en el HTML directamente
    const menuBtn = document.querySelector('.header-menu-btn');
    const nav = document.querySelector('.header-nav');
    if (menuBtn && nav) {
      menuBtn.addEventListener('click', () => {
        nav.classList.toggle('open');
      });
    }
  }
});