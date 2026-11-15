/**
 * ====================================================================
 * PHOTO GALLERY & INTERACTIVE LIGHTBOX
 * ====================================================================
 */

class WeddingGallery {
  constructor() {
    this.galleryData = window.WEDDING_CONFIG?.gallery || [];
    this.currentCategory = 'all';
    this.filteredItems = [...this.galleryData];
    this.currentIndex = 0;

    // DOM Elements
    this.gridEl = document.getElementById('gallery-grid');
    this.filterBtns = document.querySelectorAll('.gallery-filter-btn');
    this.modal = document.getElementById('lightbox-modal');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.lightboxCaption = document.getElementById('lightbox-caption');
    this.lightboxCounter = document.getElementById('lightbox-counter');
    this.prevBtn = document.getElementById('lightbox-prev');
    this.nextBtn = document.getElementById('lightbox-next');
    this.closeBtn = document.getElementById('lightbox-close');

    // Touch swipe coordinates
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    if (!this.gridEl) return;
    this.gridEl.innerHTML = '';

    this.filteredItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'gallery-item reveal-on-scroll fade-up';
      card.setAttribute('data-category', item.category);
      card.setAttribute('data-index', index);

      card.innerHTML = `
        <img class="gallery-thumb" src="${item.thumb || item.src}" alt="${item.title}" loading="lazy" />
        <div class="gallery-overlay">
          <span class="gallery-category">${item.category}</span>
          <h4 class="gallery-title">${item.title}</h4>
        </div>
      `;

      card.addEventListener('click', () => {
        this.openLightbox(index);
      });

      this.gridEl.appendChild(card);
    });

    // Re-trigger scroll observer for new items
    if (window.ScrollObserver) {
      window.ScrollObserver.observeNewElements();
    }
  }

  bindEvents() {
    // Category Filter buttons
    this.filterBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        this.filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-filter');
        this.filterCategory(cat);
      });
    });

    // Lightbox Controls
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showPrev();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showNext();
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeLightbox();
      });
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal || e.target.classList.contains('lightbox-content')) {
          this.closeLightbox();
        }
      });

      // Mobile Touch Swipe gestures
      this.modal.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      this.modal.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.modal || !this.modal.classList.contains('active')) return;

      if (e.key === 'Escape') {
        this.closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        this.showPrev();
      } else if (e.key === 'ArrowRight') {
        this.showNext();
      }
    });
  }

  filterCategory(category) {
    this.currentCategory = category;
    if (category === 'all') {
      this.filteredItems = [...this.galleryData];
    } else {
      this.filteredItems = this.galleryData.filter((i) => i.category.toLowerCase() === category.toLowerCase());
    }
    this.render();
  }

  openLightbox(index) {
    this.currentIndex = index;
    this.updateLightboxContent();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  showPrev() {
    this.currentIndex = (this.currentIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
    this.updateLightboxContent();
  }

  showNext() {
    this.currentIndex = (this.currentIndex + 1) % this.filteredItems.length;
    this.updateLightboxContent();
  }

  updateLightboxContent() {
    const item = this.filteredItems[this.currentIndex];
    if (!item) return;

    if (this.lightboxImg) {
      this.lightboxImg.src = item.src;
      this.lightboxImg.alt = item.title;
    }

    if (this.lightboxCaption) {
      this.lightboxCaption.textContent = item.title;
    }

    if (this.lightboxCounter) {
      this.lightboxCounter.textContent = `${this.currentIndex + 1} of ${this.filteredItems.length}`;
    }
  }

  handleSwipe() {
    const swipeDistance = this.touchEndX - this.touchStartX;
    const threshold = 50;

    if (swipeDistance > threshold) {
      // Swiped Right -> Previous
      this.showPrev();
    } else if (swipeDistance < -threshold) {
      // Swiped Left -> Next
      this.showNext();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.WeddingGallery = new WeddingGallery();
});

