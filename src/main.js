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

        // Ocultar menú si se hace click fuera
        document.addEventListener('click', function(event) {
          const isMenuOpen = nav.classList.contains('open');
          if (
            isMenuOpen &&
            !nav.contains(event.target) &&
            !menuBtn.contains(event.target)
          ) {
            nav.classList.remove('open');
          }
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
      document.addEventListener('click', function(event) {
        const isMenuOpen = nav.classList.contains('open');
        if (
          isMenuOpen &&
          !nav.contains(event.target) &&
          !menuBtn.contains(event.target)
        ) {
          nav.classList.remove('open');
        }
      });
    }
  }

  // Generar portada de Rick and Morty para app en index.html
  const appDiv = document.getElementById('app');
  if (appDiv) {
    appDiv.innerHTML = `
      <img src="https://rickandmortyapi.com/icons/icon-512x512.png" alt="Rick and Morty Logo" class="cover-logo" />
      <h1 class="cover-title">Rick and Morty Web App</h1>
      <p class="cover-desc">
        Explora personajes, ubicaciones y episodios del multiverso de <strong>Rick and Morty</strong>.<br>
        ¡Haz clic en el menú para comenzar tu aventura!
      </p>
      <div class="cover-team-box">
        <h3 class="cover-subtitle">👨‍💻 Miembros del equipo</h3>
        <ul class="cover-team">
          <li>Manuel Astul Laínez</li>
          <li>Daniel Alejandro Carrillo</li>
          <li>Heber Francisco Fuentes</li>
        </ul>
      </div>
    `;
    appDiv.classList.add('cover');
  }

  // Mostrar locations si existe el contenedor
  function getLocations(page = 1) {
    const locationContainer = document.getElementById('location-list');
    if (!locationContainer) return;

    locationContainer.innerHTML = '<p>Cargando ubicaciones...</p>';

    fetch(`https://rickandmortyapi.com/api/location?page=${page}`)
      .then(res => res.json())
      .then(data => {
        locationContainer.innerHTML = '';
        data.results.forEach(location => {
          const card = document.createElement('div');
          card.classList.add('location-card');
          card.innerHTML = `
            <h3>🌎 ${location.name}</h3>
            <p><strong>Tipo:</strong> ${location.type}</p>
            <p><strong>Dimensión:</strong> ${location.dimension === 'unknown' ? '❌' : '✅'} ${location.dimension}</p>
            <p><strong>Residentes:</strong> ${location.residents.length}</p>
            <button class="show-residents-btn" data-residents='${JSON.stringify(location.residents.slice(0, 5))}'>
              Ver residentes
            </button>
          `;
          locationContainer.appendChild(card);
        });

        // Paginación
        const pagination = document.createElement('div');
        pagination.className = 'pagination';
        if (data.info.prev) {
          const prevBtn = document.createElement('button');
          prevBtn.textContent = 'Anterior';
          prevBtn.onclick = () => getLocations(page - 1);
          pagination.appendChild(prevBtn);
        }
        if (data.info.next) {
          const nextBtn = document.createElement('button');
          nextBtn.textContent = 'Siguiente';
          nextBtn.onclick = () => getLocations(page + 1);
          pagination.appendChild(nextBtn);
        }
        locationContainer.appendChild(pagination);

        // Evento para mostrar residentes
        locationContainer.querySelectorAll('.show-residents-btn').forEach(btn => {
          btn.addEventListener('click', async function() {
            const urls = JSON.parse(this.dataset.residents);
            if (urls.length === 0) {
              showModal('Sin residentes en esta ubicación.');
              return;
            }
            // Obtener IDs de los residentes
            const ids = urls.map(url => url.split('/').pop()).join(',');
            const res = await fetch(`https://rickandmortyapi.com/api/character/${ids}`);
            const chars = await res.json();
            let residentsHtml = '';
            if (Array.isArray(chars)) {
              residentsHtml = chars.map(c => `
                <div class="resident-card">
                  <img src="${c.image}" alt="${c.name}" />
                  <span>${c.name}</span>
                </div>
              `).join('');
            } else {
              residentsHtml = `
                <div class="resident-card">
                  <img src="${chars.image}" alt="${chars.name}" />
                  <span>${chars.name}</span>
                </div>
              `;
            }
            showModal(residentsHtml);
          });
        });
      })
      .catch(() => {
        locationContainer.innerHTML = '<p>Error al cargar ubicaciones.</p>';
      });
  }

  // Modal simple para mostrar residentes
  function showModal(content) {
    let modal = document.getElementById('modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close-modal" style="cursor:pointer;font-size:2rem;float:right;">&times;</span>
          <div id="modal-body"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
      modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
    }
    modal.querySelector('#modal-body').innerHTML = content;
    modal.style.display = 'block';
  }

  // Llama a la función si estás en la página de locations
  if (document.getElementById('location-list')) {
    getLocations();
  }
});