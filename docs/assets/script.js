// Skyline Snacks — minimal interactions
(() => {
  const menuBtn = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      const open = menu.classList.toggle('show');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          menu?.classList.remove('show');
          menuBtn?.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Render menu from JSON
  fetch('data/menu.json')
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById('menu-grid');
      if (!grid) return;
      const renderItem = (item) => {
        const el = document.createElement('article');
        el.className = 'menu-card';
        el.innerHTML = \`
          <div>
            <h3>\${item.name}</h3>
            <p class="muted">\${item.desc}</p>
          </div>
          <div>
            <span class="price">€ \${item.price.toFixed(2)}</span>
            \${item.tag ? '<span class="tag">' + item.tag + '</span>' : ''}
          </div>\`;
        return el;
      };

      const items = [];
      for (const section of data.sections) {
        for (const it of section.items) {
          items.push({ ...it, section: section.title });
        }
      }

      // Default render (without combos)
      const draw = (withCombos=false) => {
        grid.innerHTML = '';
        items
          .filter(x => withCombos ? true : x.section.toLowerCase() !== 'combos')
          .forEach(x => grid.appendChild(renderItem(x)));
      };

      draw(false);

      const toggle = document.getElementById('toggle-combos');
      if (toggle) {
        let show = false;
        toggle.addEventListener('click', () => {
          show = !show;
          draw(show);
        });
      }
    })
    .catch(() => {});
})();