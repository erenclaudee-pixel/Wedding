/**
 * ====================================================================
 * RSVP SYSTEM & LIVE GUESTBOOK WISHES WALL (WITH SUPABASE)
 * ====================================================================
 */

class WeddingRSVP {
  constructor() {
    this.config = window.WEDDING_CONFIG?.supabase || {};
    this.form = document.getElementById('rsvp-form');
    this.submitBtn = document.getElementById('rsvp-submit-btn');
    this.alertBox = document.getElementById('rsvp-alert');
    this.attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    this.guestsCountGroup = document.getElementById('guests-count-group');
    this.dietaryGroup = document.getElementById('dietary-group');
    this.wishesListEl = document.getElementById('wishes-list');

    this.isSubmitting = false;
    this.supabaseClient = null;

    this.init();
  }

  init() {
    this.setupSupabaseClient();
    this.bindEvents();
    this.loadWishes();
  }

  /**
   * Initialize Supabase Client if library and valid credentials exist
   */
  setupSupabaseClient() {
    const isConfigured = 
      this.config.url && 
      !this.config.url.includes('your-project') &&
      this.config.anonKey && 
      !this.config.anonKey.includes('your-anon-key');

    if (isConfigured && window.supabase) {
      try {
        this.supabaseClient = window.supabase.createClient(this.config.url, this.config.anonKey);
        console.log('Supabase client initialized successfully.');
      } catch (err) {
        console.warn('Could not initialize Supabase client:', err);
      }
    }
  }

  bindEvents() {
    // Toggle guest count & dietary based on attending or declining
    this.attendanceRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'attending') {
          if (this.guestsCountGroup) this.guestsCountGroup.style.display = 'block';
          if (this.dietaryGroup) this.dietaryGroup.style.display = 'block';
        } else {
          if (this.guestsCountGroup) this.guestsCountGroup.style.display = 'none';
          if (this.dietaryGroup) this.dietaryGroup.style.display = 'none';
        }
      });
    });

    // Form submission
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }
  }

  /**
   * Handle form validation and submission
   */
  async handleSubmit() {
    if (this.isSubmitting) return;

    // Check duplicate submission cache in localStorage
    const lastSubmission = localStorage.getItem('wedding_rsvp_submitted');
    if (lastSubmission) {
      const data = JSON.parse(lastSubmission);
      const isSameName = data.fullName.toLowerCase() === this.form.fullName.value.trim().toLowerCase();
      if (isSameName) {
        const confirmResubmit = confirm("You have already submitted an RSVP for this name. Would you like to update your submission?");
        if (!confirmResubmit) return;
      }
    }

    // Extract form fields
    const fullName = this.form.fullName.value.trim();
    const email = this.form.email ? this.form.email.value.trim() : '';
    const phone = this.form.phone ? this.form.phone.value.trim() : '';
    const attendance = this.form.querySelector('input[name="attendance"]:checked')?.value || 'attending';
    const guestsCount = attendance === 'attending' ? parseInt(this.form.guestsCount?.value || '1', 10) : 0;
    const dietary = attendance === 'attending' ? (this.form.dietary?.value || 'none') : 'none';
    const message = this.form.message ? this.form.message.value.trim() : '';

    // Validation
    if (!fullName) {
      this.showAlert('Please enter your full name.', 'error');
      this.form.fullName.focus();
      return;
    }

    if (email && !this.isValidEmail(email)) {
      this.showAlert('Please enter a valid email address.', 'error');
      this.form.email.focus();
      return;
    }

    // Prepare payload
    const rsvpData = {
      full_name: fullName,
      email: email || null,
      phone: phone || null,
      attendance: attendance,
      guests_count: guestsCount,
      dietary_preference: dietary,
      message: message || null,
      created_at: new Date().toISOString()
    };

    this.setLoading(true);

    try {
      if (this.supabaseClient) {
        // 1. Insert into Supabase 'rsvps' table
        const { error: rsvpError } = await this.supabaseClient
          .from(this.config.table || 'rsvps')
          .insert([rsvpData]);

        if (rsvpError) throw rsvpError;

        // 2. If guest left a message, also insert into 'wishes' guestbook
        if (message) {
          await this.supabaseClient
            .from(this.config.wishesTable || 'wishes')
            .insert([{
              guest_name: fullName,
              attendance: attendance,
              message: message,
              is_approved: true,
              created_at: new Date().toISOString()
            }]);
        }

        this.showAlert('Thank you! Your RSVP has been saved to our guest list.', 'success');
      } else {
        // Fallback mode: Store in localStorage & append to local wishes list
        this.saveToLocal(rsvpData);
        this.showAlert('Thank you! Your RSVP has been received! (Stored locally - Supabase credentials not set)', 'success');
      }

      // Cache submission to prevent duplicates
      localStorage.setItem('wedding_rsvp_submitted', JSON.stringify({ fullName, date: new Date().toISOString() }));

      // Add wish directly to the guestbook wall for instant visual gratification
      if (message) {
        this.appendWishToWall({
          guest_name: fullName,
          attendance: attendance,
          message: message,
          created_at: new Date().toISOString()
        });
      }

      // Reset form
      this.form.reset();
      // Reset radio to attending
      const attendingRadio = this.form.querySelector('input[value="attending"]');
      if (attendingRadio) attendingRadio.checked = true;
      if (this.guestsCountGroup) this.guestsCountGroup.style.display = 'block';
      if (this.dietaryGroup) this.dietaryGroup.style.display = 'block';

      if (window.showToast) {
        window.showToast('RSVP submitted successfully!');
      }
    } catch (error) {
      console.error('Supabase RSVP submission error:', error);
      // Fallback save so guest response is never lost
      this.saveToLocal(rsvpData);
      this.showAlert(`Submission saved locally. (Database note: ${error.message || 'Check Supabase configuration'})`, 'info');
    } finally {
      this.setLoading(false);
    }
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  setLoading(isLoading) {
    this.isSubmitting = isLoading;
    if (this.submitBtn) {
      this.submitBtn.disabled = isLoading;
      this.submitBtn.innerHTML = isLoading 
        ? `<span class="btn-spinner"></span> Submitting...` 
        : `Send RSVP Confirmation`;
    }
  }

  showAlert(message, type) {
    if (!this.alertBox) return;
    this.alertBox.className = `rsvp-alert ${type}`;
    this.alertBox.textContent = message;
    this.alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  saveToLocal(rsvpData) {
    const list = JSON.parse(localStorage.getItem('wedding_local_rsvps') || '[]');
    list.push(rsvpData);
    localStorage.setItem('wedding_local_rsvps', JSON.stringify(list));
  }

  /**
   * Load wishes / guestbook entries
   */
  async loadWishes() {
    if (!this.wishesListEl) return;

    let wishes = [];

    if (this.supabaseClient) {
      try {
        const { data, error } = await this.supabaseClient
          .from(this.config.wishesTable || 'wishes')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && data && data.length > 0) {
          wishes = data;
        }
      } catch (e) {
        console.warn('Could not fetch wishes from Supabase:', e);
      }
    }

    // Default sample wishes if empty
    if (wishes.length === 0) {
      const localWishes = JSON.parse(localStorage.getItem('wedding_local_wishes') || '[]');
      if (localWishes.length > 0) {
        wishes = localWishes;
      } else {
        wishes = [
          {
            guest_name: "Jonathan & Claire Sterling",
            attendance: "attending",
            message: "Wishing you both a lifetime of unmeasurable happiness, boundless love, and wonderful adventures together! Cannot wait to celebrate with you!",
            created_at: new Date(Date.now() - 3600000 * 4).toISOString()
          },
          {
            guest_name: "Dr. Marcus Aurelius & Family",
            attendance: "attending",
            message: "Heartfelt congratulations to Alexander & Sophia. May your union be blessed with deep affection and everlasting peace.",
            created_at: new Date(Date.now() - 3600000 * 24).toISOString()
          },
          {
            guest_name: "Audrey Dupont",
            attendance: "attending",
            message: "To the most radiant couple! So thrilled to witness your fairytale wedding in Beverly Hills! Sending all our love from Paris.",
            created_at: new Date(Date.now() - 3600000 * 48).toISOString()
          }
        ];
      }
    }

    this.wishesListEl.innerHTML = '';
    wishes.forEach((w) => this.appendWishToWall(w));
  }

  appendWishToWall(wish) {
    if (!this.wishesListEl) return;

    const timeAgo = this.formatTimeAgo(wish.created_at);
    const card = document.createElement('div');
    card.className = 'wish-card reveal-on-scroll fade-in';

    card.innerHTML = `
      <div class="wish-card-header">
        <h4 class="wish-guest-name">${this.escapeHtml(wish.guest_name)}</h4>
        <span class="wish-time">${timeAgo}</span>
      </div>
      <p class="wish-message">${this.escapeHtml(wish.message)}</p>
      <span class="wish-attendance-tag ${wish.attendance}">
        ${wish.attendance === 'attending' ? 'Joyfully Attending' : 'Regretfully Declining'}
      </span>
    `;

    // Prepend to top of wall
    this.wishesListEl.insertBefore(card, this.wishesListEl.firstChild);
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  formatTimeAgo(dateString) {
    try {
      const date = new Date(dateString);
      const diffSecs = Math.floor((Date.now() - date.getTime()) / 1000);

      if (diffSecs < 60) return 'Just now';
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
      if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
      return `${Math.floor(diffSecs / 86400)}d ago`;
    } catch {
      return 'Recently';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.WeddingRSVP = new WeddingRSVP();
});
