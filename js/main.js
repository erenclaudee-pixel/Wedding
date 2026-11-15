/**
 * ====================================================================
 * MAIN WEDDING INVITATION CONTROLLER
 * ====================================================================
 * Coordinates configuration injection, animations, scroll effects, and UI.
 */

// Global Toast Notification Helper
window.showToast = function(message, duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.35s ease forwards';
    setTimeout(() => toast.remove(), 350);
  }, duration);
};

// Clipboard Helper
window.copyToClipboard = function(text, buttonElement, successLabel = 'Copied!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      handleCopySuccess(buttonElement, successLabel);
    }).catch(() => {
      fallbackCopy(text, buttonElement, successLabel);
    });
  } else {
    fallbackCopy(text, buttonElement, successLabel);
  }
};

function fallbackCopy(text, buttonElement, successLabel) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    handleCopySuccess(buttonElement, successLabel);
  } catch (err) {
    window.showToast('Could not copy to clipboard.');
  }
  document.body.removeChild(textarea);
}

function handleCopySuccess(btn, successLabel) {
  if (btn) {
    const originalText = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      ${successLabel}
    `;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = originalText;
    }, 2200);
  }
  window.showToast('Copied to clipboard!');
}

/**
 * Falling Petals & Golden Sparkles Canvas Effect
 */
class PetalsCanvasEffect {
  constructor() {
    this.canvas = document.getElementById('petals-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.maxPetals = 28;
    this.isRunning = false;
    this.animationFrame = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createPetals();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createPetals() {
    this.petals = [];
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.newPetal(true));
    }
  }

  newPetal(randomY = false) {
    const isGold = Math.random() > 0.65;
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: Math.random() * 9 + 6,
      speedX: Math.random() * 1.5 - 0.75,
      speedY: Math.random() * 1.2 + 0.8,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 1.5 - 0.75,
      swayAngle: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.025 + 0.01,
      opacity: Math.random() * 0.45 + 0.35,
      color: isGold 
        ? { r: 223, g: 189, b: 142 } // Golden shimmer petal
        : { r: 242, g: 218, b: 210 } // Soft blush rose petal
    };
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.swayAngle += p.swaySpeed;
      p.x += Math.sin(p.swayAngle) * 0.8 + p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      // Draw delicate petal shape
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.size * 0.5, p.size, Math.PI / 4, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
      this.ctx.fill();
      this.ctx.restore();

      // Reset when falling out of viewport
      if (p.y > this.height + 20 || p.x < -40 || p.x > this.width + 40) {
        this.petals[i] = this.newPetal(false);
      }
    }

    this.animationFrame = requestAnimationFrame(() => this.loop());
  }
}

/**
 * Intersection Observer for Smooth Scroll Reveal Animations
 */
class WeddingScrollObserver {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    const options = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once animated, stop observing this element
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    this.observeNewElements();
  }

  observeNewElements() {
    const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
    elements.forEach((el) => this.observer.observe(el));
  }
}

/**
 * Inject Configuration Data from WEDDING_CONFIG into the DOM
 */
function injectWeddingConfig() {
  const config = window.WEDDING_CONFIG;
  if (!config) return;

  // 1. Text Replacements by Data Attributes
  document.querySelectorAll('[data-cfg]').forEach((el) => {
    const keyPath = el.getAttribute('data-cfg');
    const value = getNestedValue(config, keyPath);
    if (value !== undefined && value !== null) {
      el.textContent = value;
    }
  });

  // 2. HTML Replacements by Data Attributes
  document.querySelectorAll('[data-cfg-html]').forEach((el) => {
    const keyPath = el.getAttribute('data-cfg-html');
    const value = getNestedValue(config, keyPath);
    if (value !== undefined && value !== null) {
      el.innerHTML = value;
    }
  });

  // 3. Image Sources by Data Attributes
  document.querySelectorAll('[data-cfg-src]').forEach((el) => {
    const keyPath = el.getAttribute('data-cfg-src');
    const value = getNestedValue(config, keyPath);
    if (value) {
      el.src = value;
    }
  });

  // 4. Links / Href by Data Attributes
  document.querySelectorAll('[data-cfg-href]').forEach((el) => {
    const keyPath = el.getAttribute('data-cfg-href');
    const value = getNestedValue(config, keyPath);
    if (value) {
      el.href = value;
    }
  });

  // 5. Build Itinerary Schedule
  buildItinerary(config.itinerary);

  // 6. Build Love Story Timeline
  buildLoveStory(config.story);

  // 7. Build Bank / Digital Gift Cards
  buildGiftCards(config.gifts);
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((prev, curr) => prev?.[curr], obj);
}

function buildItinerary(itineraryList) {
  const container = document.getElementById('itinerary-list');
  if (!container || !itineraryList) return;

  container.innerHTML = '';
  itineraryList.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'itinerary-step reveal-on-scroll fade-up';
    li.innerHTML = `
      <span class="itinerary-step-dot"></span>
      <span class="itinerary-time">${item.time}</span>
      <h4 class="itinerary-step-title">${item.title}</h4>
      <p class="itinerary-step-desc">${item.description}</p>
    `;
    container.appendChild(li);
  });
}

function buildLoveStory(storyList) {
  const container = document.getElementById('story-timeline');
  if (!container || !storyList) return;

  container.innerHTML = '';
  storyList.forEach((story, idx) => {
    const div = document.createElement('div');
    const delayClass = idx % 2 === 0 ? 'fade-up' : 'fade-up';
    div.className = `timeline-item reveal-on-scroll ${delayClass}`;
    div.innerHTML = `
      <span class="timeline-dot"></span>
      <div class="timeline-year">${story.year}</div>
      <h4 class="timeline-title">${story.title}</h4>
      <p class="timeline-desc">${story.description}</p>
    `;
    container.appendChild(div);
  });
}

function buildGiftCards(giftsConfig) {
  const container = document.getElementById('bank-cards-grid');
  if (!container || !giftsConfig?.accounts) return;

  container.innerHTML = '';
  giftsConfig.accounts.forEach((acc) => {
    const card = document.createElement('div');
    card.className = 'bank-card luxury-card reveal-on-scroll fade-up';
    card.innerHTML = `
      <div>
        <div class="bank-card-top">
          <img src="${acc.logo}" alt="${acc.bankName}" class="bank-logo" onerror="this.style.display='none'" />
          <span class="bank-badge">${acc.badge || acc.bankName}</span>
        </div>
        <div class="account-number-display">${acc.accountNumber}</div>
        <div class="account-holder-name">${acc.accountHolder}</div>
      </div>
      <button class="copy-btn" data-copy="${acc.accountNumber}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        Copy Number
      </button>
    `;

    const copyBtn = card.querySelector('.copy-btn');
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.copyToClipboard(acc.accountNumber, copyBtn);
    });

    container.appendChild(card);
  });

  // Shipping address copy button
  const copyShippingBtn = document.getElementById('copy-shipping-btn');
  if (copyShippingBtn && giftsConfig?.shippingAddress) {
    const fullAddress = `${giftsConfig.shippingAddress.recipient}\n${giftsConfig.shippingAddress.address}\nPhone: ${giftsConfig.shippingAddress.phone}`;
    copyShippingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.copyToClipboard(fullAddress, copyShippingBtn, 'Address Copied!');
    });
  }
}

/**
 * Floating Navigation Active Scroll Spy
 */
function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.floating-nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

// Back to Top Button
function setupBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject Config
  injectWeddingConfig();

  // 2. Initialize Scroll Observer
  window.ScrollObserver = new WeddingScrollObserver();

  // 3. Initialize Falling Petals
  if (window.WEDDING_CONFIG?.theme?.enablePetals) {
    window.PetalsEffect = new PetalsCanvasEffect();
  }

  // 4. Scroll Spy & Back to top
  setupScrollSpy();
  setupBackToTop();
});
