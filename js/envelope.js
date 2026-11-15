/**
 * ====================================================================
 * ENVELOPE INTERACTION & 3D OPENING ANIMATION
 * ====================================================================
 */

class WeddingEnvelope {
  constructor() {
    this.screen = document.getElementById('envelope-screen');
    this.wrapper = document.getElementById('envelope-wrapper');
    this.waxSealBtn = document.getElementById('wax-seal-btn');
    this.openCta = document.getElementById('envelope-cta');
    this.reopenBtn = document.getElementById('reopen-envelope-btn');
    this.guestNameEl = document.getElementById('envelope-guest-name');
    this.isOpened = false;

    this.init();
  }

  init() {
    this.parseGuestName();
    this.bindEvents();
  }

  /**
   * Parse personalized guest name from URL parameters (e.g. ?to=John+Doe or ?guest=Mr.+Smith)
   */
  parseGuestName() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const guestParam = urlParams.get('to') || urlParams.get('guest') || urlParams.get('u');
      
      if (guestParam && this.guestNameEl) {
        const decodedName = decodeURIComponent(guestParam.replace(/\+/g, ' '));
        this.guestNameEl.textContent = decodedName;

        // Also update any guest greeting in the hero or invitation card
        const heroGuestEl = document.getElementById('hero-guest-name');
        if (heroGuestEl) {
          heroGuestEl.textContent = decodedName;
        }
      }
    } catch (e) {
      console.warn('Could not parse guest parameter from URL:', e);
    }
  }

  bindEvents() {
    // Click on wax seal or anywhere on envelope
    if (this.waxSealBtn) {
      this.waxSealBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEnvelope();
      });
    }

    if (this.wrapper) {
      this.wrapper.addEventListener('click', () => {
        if (!this.isOpened) {
          this.openEnvelope();
        }
      });
    }

    if (this.openCta) {
      this.openCta.addEventListener('click', () => {
        if (!this.isOpened) {
          this.openEnvelope();
        }
      });
    }

    // Reopen envelope button in bottom nav
    if (this.reopenBtn) {
      this.reopenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeEnvelope();
      });
    }

    // Keyboard support (Enter / Space opens the envelope)
    document.addEventListener('keydown', (e) => {
      if (!this.isOpened && (e.key === 'Enter' || e.key === ' ')) {
        this.openEnvelope();
      }
    });
  }

  /**
   * Generate realistic wax seal crack / snap sound using Web Audio API
   */
  playWaxCrackSound() {
    if (!window.WEDDING_CONFIG?.theme?.enableWaxCrackSound) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Crisp wax fracture noise burst
      const bufferSize = ctx.sampleRate * 0.15; // 150ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // High frequency white noise with fast decay
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.18));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to simulate crisp brittle wax stamp cracking
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 3.0;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (err) {
      // Audio context might be restricted or unsupported; fail silently
    }
  }

  /**
   * Open the envelope with animated sequence
   */
  openEnvelope() {
    if (this.isOpened) return;
    this.isOpened = true;

    // 1. Play wax crack sound
    this.playWaxCrackSound();

    // 2. Add opening class to trigger 3D flap fold and letter emergence
    this.wrapper.classList.add('opening');

    // 3. Trigger background music to start playing immediately (since user clicked!)
    if (window.WeddingMusic) {
      window.WeddingMusic.play();
    }

    // 4. After 1.2s, smoothly fade out envelope screen and reveal main wedding invitation
    setTimeout(() => {
      this.screen.classList.add('opened');
      document.body.classList.remove('locked');

      // Scroll smoothly to top of main invitation
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Start falling petals canvas if enabled
      if (window.PetalsEffect) {
        window.PetalsEffect.start();
      }

      // Dispatch global custom event
      window.dispatchEvent(new CustomEvent('wedding:envelopeOpened'));
    }, 1300);
  }

  /**
   * Reclose the envelope so user can view opening animation again
   */
  closeEnvelope() {
    this.isOpened = false;
    document.body.classList.add('locked');
    this.screen.classList.remove('opened');
    this.wrapper.classList.remove('opening');

    window.scrollTo({ top: 0, behavior: 'instant' });

    // Toast notification
    if (window.showToast) {
      window.showToast('Reopened envelope');
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.WeddingEnvelope = new WeddingEnvelope();
});

