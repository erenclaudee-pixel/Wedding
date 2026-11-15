/**
 * ====================================================================
 * REAL-TIME WEDDING COUNTDOWN TIMER & CALENDAR INTEGRATION
 * ====================================================================
 */

class WeddingCountdown {
  constructor() {
    this.targetDate = new Date(window.WEDDING_CONFIG?.weddingDate || "2027-09-18T10:00:00").getTime();
    this.daysEl = document.getElementById('countdown-days');
    this.hoursEl = document.getElementById('countdown-hours');
    this.minutesEl = document.getElementById('countdown-minutes');
    this.secondsEl = document.getElementById('countdown-seconds');
    this.timerInterval = null;

    this.init();
  }

  init() {
    this.update();
    this.timerInterval = setInterval(() => this.update(), 1000);
    this.bindCalendarEvents();
  }

  /**
   * Update countdown numbers
   */
  update() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance <= 0) {
      if (this.daysEl) this.daysEl.textContent = '00';
      if (this.hoursEl) this.hoursEl.textContent = '00';
      if (this.minutesEl) this.minutesEl.textContent = '00';
      if (this.secondsEl) this.secondsEl.textContent = '00';
      clearInterval(this.timerInterval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.setDigit(this.daysEl, days);
    this.setDigit(this.hoursEl, hours);
    this.setDigit(this.minutesEl, minutes);
    this.setDigit(this.secondsEl, seconds);
  }

  setDigit(element, value) {
    if (!element) return;
    const formatted = String(value).padStart(2, '0');
    if (element.textContent !== formatted) {
      element.textContent = formatted;
    }
  }

  /**
   * Calendar Integration (Google Calendar & iCal .ics download)
   */
  bindCalendarEvents() {
    const addToCalBtn = document.getElementById('add-to-calendar-btn');
    const modal = document.getElementById('calendar-modal');
    const closeBtn = document.getElementById('calendar-modal-close');
    const googleBtn = document.getElementById('cal-google');
    const appleBtn = document.getElementById('cal-apple');

    if (addToCalBtn && modal) {
      addToCalBtn.addEventListener('click', () => {
        modal.classList.add('active');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }

    if (googleBtn) {
      googleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openGoogleCalendar();
      });
    }

    if (appleBtn) {
      appleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.downloadICalendar();
      });
    }
  }

  /**
   * Generate Google Calendar web link
   */
  openGoogleCalendar() {
    const config = window.WEDDING_CONFIG;
    const couple = `${config.couple.groom.shortName} & ${config.couple.bride.shortName}`;
    const title = encodeURIComponent(`The Wedding of ${couple}`);
    
    // Convert 2027-09-18T10:00:00 to 20270918T100000Z
    const startDate = new Date(config.weddingDate);
    const endDate = new Date(startDate.getTime() + (6 * 60 * 60 * 1000)); // 6 hours duration

    const formatGDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const dates = `${formatGDate(startDate)}/${formatGDate(endDate)}`;

    const details = encodeURIComponent(
      `You are joyfully invited to celebrate the wedding of ${couple}.\n\n` +
      `Ceremony: ${config.events.ceremony.venue}\n` +
      `Reception: ${config.events.reception.venue}\n\n` +
      `Dress Code: ${config.events.ceremony.dressCode}`
    );

    const location = encodeURIComponent(`${config.events.ceremony.venue}, ${config.events.ceremony.address}`);

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(googleUrl, '_blank');
  }

  /**
   * Generate standard RFC 5545 iCalendar (.ics) file for Apple Calendar & Outlook
   */
  downloadICalendar() {
    const config = window.WEDDING_CONFIG;
    const couple = `${config.couple.groom.shortName} & ${config.couple.bride.shortName}`;
    const startDate = new Date(config.weddingDate);
    const endDate = new Date(startDate.getTime() + (6 * 60 * 60 * 1000));

    const formatICalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Digital Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:wedding-${startDate.getTime()}@digitalwedding.invitation`,
      `DTSTAMP:${formatICalDate(new Date())}`,
      `DTSTART:${formatICalDate(startDate)}`,
      `DTEND:${formatICalDate(endDate)}`,
      `SUMMARY:The Wedding of ${couple}`,
      `DESCRIPTION:Celebration of Holy Matrimony & Wedding Reception of ${couple}.\\nVenue: ${config.events.ceremony.venue}`,
      `LOCATION:${config.events.ceremony.venue}\\, ${config.events.ceremony.address}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Wedding-${config.couple.groom.shortName}-${config.couple.bride.shortName}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.showToast) {
      window.showToast('Calendar event downloaded!');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.WeddingCountdown = new WeddingCountdown();
});
