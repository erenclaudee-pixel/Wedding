/**
 * ====================================================================
 * ROMANTIC BACKGROUND MUSIC CONTROLLER
 * ====================================================================
 * Manages audio playback, floating player UI, and Web Audio fallback synthesis.
 */

class WeddingMusic {
  constructor() {
    this.config = window.WEDDING_CONFIG?.music || {};
    this.audioEl = document.getElementById('wedding-audio');
    this.musicBtn = document.getElementById('floating-music-btn');
    this.isPlaying = false;
    this.isMuted = false;
    this.synthActive = false;
    this.synthInterval = null;
    this.audioCtx = null;

    this.init();
  }

  init() {
    if (!this.audioEl) return;

    // Set audio source from config
    this.audioEl.src = this.config.url || 'assets/music/wedding-melody.mp3';
    this.audioEl.loop = true;
    this.audioEl.volume = 0.5;

    // Handle error / fallback to Web Audio synthesizer
    this.audioEl.addEventListener('error', (e) => {
      console.warn('Audio file could not be played directly. Activating Web Audio synthesizer fallback.', e);
      if (this.isPlaying) {
        this.startSynthPlayback();
      }
    });

    // Floating Button click toggle
    if (this.musicBtn) {
      this.musicBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }
  }

  /**
   * Start music playback
   */
  play() {
    this.isPlaying = true;

    if (this.audioEl) {
      const playPromise = this.audioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.updateUI(true);
          })
          .catch((err) => {
            console.warn('HTML5 Audio autoplay restricted. Starting Web Audio synth fallback:', err);
            this.startSynthPlayback();
            this.updateUI(true);
          });
      }
    } else {
      this.startSynthPlayback();
      this.updateUI(true);
    }
  }

  /**
   * Pause music playback
   */
  pause() {
    this.isPlaying = false;

    if (this.audioEl) {
      this.audioEl.pause();
    }

    if (this.synthActive) {
      this.stopSynthPlayback();
    }

    this.updateUI(false);
  }

  /**
   * Toggle between play and pause
   */
  toggle() {
    if (this.isPlaying) {
      this.pause();
      if (window.showToast) window.showToast('Music paused');
    } else {
      this.play();
      if (window.showToast) window.showToast(`Playing: ${this.config.title || 'Wedding Melody'}`);
    }
  }

  updateUI(isPlaying) {
    if (!this.musicBtn) return;
    if (isPlaying) {
      this.musicBtn.classList.add('playing');
      this.musicBtn.setAttribute('title', `Playing: ${this.config.title || 'Wedding Melody'}`);
      this.musicBtn.setAttribute('aria-label', 'Pause music');
    } else {
      this.musicBtn.classList.remove('playing');
      this.musicBtn.setAttribute('title', 'Play background music');
      this.musicBtn.setAttribute('aria-label', 'Play music');
    }
  }

  /**
   * Built-in Web Audio API romantic harp/piano synthesizer fallback
   * Plays Canon in D arpeggio progression in warm acoustic timbre
   */
  startSynthPlayback() {
    if (this.synthActive) return;
    this.synthActive = true;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      this.audioCtx = new AudioCtx();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const chords = [
        [293.66, 369.99, 440.0, 587.33], // D, F#, A, D
        [220.0, 277.18, 329.63, 440.0],  // A, C#, E, A
        [246.94, 293.66, 369.99, 493.88],// B, D, F#, B
        [185.0, 220.0, 277.18, 369.99],  // F#, A, C#, F#
        [196.0, 246.94, 293.66, 392.0],  // G, B, D, G
        [146.83, 220.0, 293.66, 369.99], // D, A, D, F#
        [196.0, 246.94, 293.66, 392.0],  // G, B, D, G
        [220.0, 277.18, 329.63, 440.0]   // A, C#, E, A
      ];

      let chordIdx = 0;
      let noteStep = 0;

      const playNextArpeggioNote = () => {
        if (!this.synthActive || !this.audioCtx) return;

        const currentChord = chords[chordIdx];
        const freq = currentChord[noteStep];

        // Play gentle piano tone
        this.playTone(freq, 0.7);

        noteStep++;
        if (noteStep >= 4) {
          noteStep = 0;
          chordIdx = (chordIdx + 1) % chords.length;
        }
      };

      // Play notes every 375ms (approx 80 BPM romantic waltz tempo)
      this.synthInterval = setInterval(playNextArpeggioNote, 375);
    } catch (e) {
      console.warn('Could not start Web Audio synthesizer:', e);
    }
  }

  playTone(frequency, duration) {
    if (!this.audioCtx || this.audioCtx.state === 'closed') return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      // Soft triangle wave for harp/electric piano tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, now);

      // Lowpass warmth filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + duration);

      // Gentle piano envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch (err) {
      // Ignore audio glitches
    }
  }

  stopSynthPlayback() {
    this.synthActive = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.WeddingMusic = new WeddingMusic();
});
