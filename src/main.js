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
          <li>Jose Daniel Cartagena Ascencio</li>
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

// DANIEL//
// Mostrar personajes si existe el contenedor
let currentCharacterPage = 1; // Lleva el control de la página actual

function getCharacters(page = 1) {
  const container = document.getElementById('character-list');
  if (!container) return;

  if (page === 1) container.innerHTML = '<p>Cargando personajes...</p>';

  fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
    .then(res => res.json())
    .then(data => {
      if (page === 1) container.innerHTML = '';

      data.results.forEach(char => {
        const card = document.createElement('div');
        card.classList.add('character-card');
        card.innerHTML = `
          <h3>${char.name}</h3>
          <img src="${char.image}" alt="${char.name}" style="width: 100%; border-radius: 8px; margin-bottom: 0.7rem;" />
          <p><strong>Especie:</strong> ${char.species}</p>
          <p><strong>Estado:</strong> ${char.status}</p>
          <p><strong>Género:</strong> ${char.gender}</p>
          <button class="ver-mas-btn">Ver más</button>
        `;

        card.querySelector('.ver-mas-btn').addEventListener('click', () => {
          showCharacterModal(char);
        });

        container.appendChild(card);
      });

      // Agregar o actualizar el botón "Cargar más"
      let loadMoreBtn = document.getElementById('load-more-btn');
      if (!loadMoreBtn && data.info.next) {
        loadMoreBtn = document.createElement('button');
        loadMoreBtn.id = 'load-more-btn';
        loadMoreBtn.textContent = 'Cargar más';
        loadMoreBtn.style.margin = '2rem auto';
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.style.padding = '0.7rem 1.4rem';
        loadMoreBtn.style.borderRadius = '8px';
        loadMoreBtn.style.border = 'none';
        loadMoreBtn.style.background = 'var(--marron)';
        loadMoreBtn.style.color = '#fff';
        loadMoreBtn.style.fontWeight = 'bold';
        loadMoreBtn.style.cursor = 'pointer';

        loadMoreBtn.addEventListener('click', () => {
          currentCharacterPage++;
          getCharacters(currentCharacterPage);
        });

        container.parentNode.appendChild(loadMoreBtn);
      } else if (!data.info.next && loadMoreBtn) {
        loadMoreBtn.remove(); // Si ya no hay más páginas, lo quitamos
      }

    })
    .catch(() => {
      container.innerHTML += '<p>Error al cargar más personajes.</p>';
    });
}

// Función modal para mostrar detalles del personaje
function showCharacterModal(char) {
  let modal = document.getElementById('modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div id="modal-body"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modal.querySelector('.modal-content .close-modal').onclick = () => modal.style.display = 'none';
  modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

  const content = `
    <div style="text-align: center;">
      <img src="${char.image}" alt="${char.name}" style="width: 100px; border-radius: 50%; margin-bottom: 1rem;" />
      <h3>${char.name}</h3>
      <p><strong>Especie:</strong> ${char.species}</p>
      <p><strong>Estado:</strong> ${char.status}</p>
      <p><strong>Género:</strong> ${char.gender}</p>
      <p><strong>Origen:</strong> ${char.origin.name}</p>
      <p><strong>Ubicación actual:</strong> ${char.location.name}</p>
    </div>
  `;

  modal.querySelector('#modal-body').innerHTML = content;
  modal.style.display = 'block';
}
// Llama a la función si estás en la página de characters
if (document.getElementById('character-list')) {
  getCharacters();
} 

