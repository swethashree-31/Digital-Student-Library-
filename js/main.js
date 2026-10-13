/* ============================================================
   DATA SCIENCE – DIGITAL LIBRARY
   Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoad();
  initMagicalBackground();
  initNavbar();
  initProfileCard();
  initScrollReveal();
  initCardEffects();
});

/* -------------------------------------------------------
   1. MAGICAL PAGE-LOAD OVERLAY
   ------------------------------------------------------- */
function initPageLoad() {
  const overlay = document.getElementById('page-load-overlay');
  if (!overlay) return;
  setTimeout(() => {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 800);
  }, 900);
}

/* -------------------------------------------------------
   2. FLOATING CANDLES & SPARKLE BACKGROUND
   ------------------------------------------------------- */
function initMagicalBackground() {
  const bg = document.getElementById('magical-bg');
  if (!bg) return;

  // Create floating candles
  const candleCount = 12;
  for (let i = 0; i < candleCount; i++) {
    const candle = document.createElement('div');
    candle.className = 'floating-candle';
    candle.style.left = `${5 + Math.random() * 90}%`;
    candle.style.top = `${5 + Math.random() * 85}%`;
    candle.style.animationDuration = `${4 + Math.random() * 5}s`;
    candle.style.animationDelay = `${Math.random() * 4}s`;
    candle.style.opacity = 0.3 + Math.random() * 0.5;
    candle.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
    bg.appendChild(candle);
  }

  // Create sparkle particles
  const sparkleCount = 30;
  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.setProperty('--dur', `${2 + Math.random() * 4}s`);
    sparkle.style.setProperty('--delay', `${Math.random() * 5}s`);
    sparkle.style.width = `${2 + Math.random() * 4}px`;
    sparkle.style.height = sparkle.style.width;
    bg.appendChild(sparkle);
  }
}

/* -------------------------------------------------------
   3. NAVBAR (Mobile hamburger & active state)
   ------------------------------------------------------- */
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Set active link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* -------------------------------------------------------
   4. STUDENT PROFILE CARD (Photo upload + editable fields)
   ------------------------------------------------------- */
function initProfileCard() {
  // ---- Photo Upload ----
  const editBtn = document.getElementById('edit-photo-btn');
  const photoInput = document.getElementById('photo-input');
  const profilePhotos = document.querySelectorAll('.profile-photo-img');

  if (editBtn && photoInput) {
    editBtn.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        // Save to localStorage
        try { localStorage.setItem('studentPhoto', dataUrl); } catch (err) { console.warn('Photo too large for localStorage'); }
        // Update all profile photo elements on page
        profilePhotos.forEach(el => {
          el.innerHTML = `<img src="${dataUrl}" alt="Student Photo">`;
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // Load saved photo
  const savedPhoto = localStorage.getItem('studentPhoto');
  if (savedPhoto) {
    profilePhotos.forEach(el => {
      el.innerHTML = `<img src="${savedPhoto}" alt="Student Photo">`;
    });
  }

  // ---- Editable Details ----
  const editableFields = document.querySelectorAll('.detail-value[contenteditable]');
  editableFields.forEach(field => {
    const key = field.dataset.key;
    // Load saved value
    const saved = localStorage.getItem(`profile_${key}`);
    if (saved) field.textContent = saved;

    // Save on blur
    field.addEventListener('blur', () => {
      localStorage.setItem(`profile_${key}`, field.textContent.trim());
    });
    // Allow Enter to confirm
    field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        field.blur();
      }
    });
  });
}

/* -------------------------------------------------------
   5. SCROLL REVEAL
   ------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------
   6. CARD MOUSE-TRACKING GLOW
   ------------------------------------------------------- */
function initCardEffects() {
  const cards = document.querySelectorAll('.card, .tool-card, .module-box, .experiment-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}

/* -------------------------------------------------------
   7. MODULE & EXPERIMENT TOGGLES
   ------------------------------------------------------- */
function toggleModule(element) {
  const box = element.closest('.module-box');
  if (box) box.classList.toggle('open');
}

function toggleExperiment(element) {
  const card = element.closest('.experiment-card');
  if (card) card.classList.toggle('open');
}

function toggleSubExperiment(element) {
  const sub = element.closest('.sub-experiment');
  if (sub) sub.classList.toggle('open');
}

/* -------------------------------------------------------
   8. TOOLS PAGE - FILTER & SEARCH
   ------------------------------------------------------- */
function initToolsFilter() {
  const searchInput = document.getElementById('tools-search');
  const chips = document.querySelectorAll('.filter-chip');
  const toolCards = document.querySelectorAll('.tool-card');
  const categories = document.querySelectorAll('.tool-category');
  let activeRole = 'all';

  // Chip click
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeRole = chip.dataset.role;
      filterTools();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', filterTools);
  }

  function filterTools() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    toolCards.forEach(card => {
      const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';
      const roles = card.dataset.roles ? card.dataset.roles.toLowerCase() : '';
      const desc = card.querySelector('.tool-desc') ? card.querySelector('.tool-desc').textContent.toLowerCase() : '';
      const matchesSearch = !query || name.includes(query) || desc.includes(query) || roles.includes(query);
      const matchesRole = activeRole === 'all' || roles.includes(activeRole.toLowerCase());
      card.classList.toggle('hidden', !(matchesSearch && matchesRole));
    });

    // Hide empty categories
    categories.forEach(cat => {
      const visibleCards = cat.querySelectorAll('.tool-card:not(.hidden)');
      cat.style.display = visibleCards.length === 0 ? 'none' : '';
    });
  }
}

/* -------------------------------------------------------
   9. FLIPBOOK VIEWER (PDF.js + StPageFlip placeholder)
   ------------------------------------------------------- */
function initFlipbook(containerId, pdfPath) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const canvasArea = container.querySelector('.flipbook-canvas-area');
  const pageInfo = container.querySelector('.page-info');

  // Show placeholder message since PDF files are placeholders
  canvasArea.innerHTML = `
    <div class="flipbook-placeholder">
      <span class="scroll-icon">📜</span>
      <p>PDF Flipbook Viewer</p>
      <p>Place your PDF file at:</p>
      <span class="path-hint">${pdfPath}</span>
      <p style="margin-top:1rem; font-size:0.85rem; opacity:0.6;">
        The viewer will render page-by-page with flip animation<br>
        once a valid PDF is placed at the above path.
      </p>
    </div>
  `;

  if (pageInfo) pageInfo.textContent = 'No PDF loaded';
}
