# 💍 Premium Animated Digital Wedding Invitation Website

A luxury, responsive, and interactive Digital Wedding Invitation website featuring a realistic 3D animated envelope opening with wax seal physics, real-time wedding countdown timer, personalized guest greeting, RSVP system powered by Supabase, photo gallery with lightbox, background music player, and digital gift registry.

Built with clean Vanilla HTML5, CSS3, and ES6+ JavaScript. Ready for instant deployment on **Vercel**.

---

## ✨ Features & Highlights

1. **3D Animated Envelope Opening**:
   - Realistic envelope with flap, gold trim, and inner damask floral liner.
   - Interactive 3D wax seal with monogram stamp and synthetic wax crack sound effect (Web Audio API).
   - Smooth 180° flap unfolding and letter emergence animation.
   - Dynamic guest addressing from URL query parameter (e.g. `?to=Jonathan+Sterling`).
   - "Reopen Envelope" button to re-experience the opening sequence at any time.

2. **Luxury Editorial Wedding Aesthetic**:
   - Champagne gold, ivory linen, warm truffle, and cream color palette.
   - Editorial serif typography (*Cormorant Garamond*, *Playfair Display*) paired with romantic script fonts (*Alex Brush*, *Great Vibes*).
   - Minimalist botanical floral dividers, gold leaf corner ornaments, and monogram crests.
   - Ambient floating rose petals and golden sparkles canvas effect.

3. **Groom & Bride Couple Showcase**:
   - Elegant portrait frames with gold filigree accents.
   - Parents' names, bios, and social media links.
   - "Our Love Story" interactive milestone timeline (2021 – 2027).

4. **Real-Time Wedding Countdown**:
   - Live Days, Hours, Minutes, and Seconds countdown calculated from `config.js`.
   - "Add to Calendar" integration:
     - Direct Google Calendar template link.
     - Universal iCalendar (`.ics`) file download for Apple Calendar and Outlook.

5. **Wedding Ceremony & Reception Details**:
   - Holy Matrimony & Dinner Reception cards with venues, addresses, and dress code color guidelines.
   - "Open in Google Maps" direct links.
   - Wedding day itinerary schedule with time markers.

6. **Photo Gallery & Lightbox**:
   - Curated grid of engagement, pre-wedding, and candid moments.
   - Category filtering (*All, Pre-Wedding, Engagement, Cherished Moments*).
   - Full-featured custom lightbox modal:
     - Keyboard navigation (`Left Arrow`, `Right Arrow`, `Escape`).
     - Mobile touch-swipe gesture support.
     - Photo counter and captions.

7. **Romantic Background Music**:
   - Autoplays smoothly after user interaction (tapping the wax seal or opening the envelope) in compliance with browser autoplay policies.
   - Floating music player widget with spinning vinyl disc animation and equalizer soundwaves.
   - Play/pause toggle and song title tooltip.
   - Dual-mode audio engine: plays audio track, with an acoustic piano/harp synthesizer fallback using Web Audio API if offline.

8. **RSVP System with Supabase Integration**:
   - Collects guest name, email, phone, attendance status, party size, dietary restrictions, and congratulatory message.
   - Validates all input fields and guards against duplicate submissions.
   - Connects to Supabase with public Row Level Security (RLS).
   - Live Guestbook / Wishes Wall: dynamically displays messages and blessings left by guests.
   - Graceful fallback: stores submissions in `localStorage` if Supabase credentials are not yet configured.

9. **Digital Wedding Registry & Angpao**:
   - Elegant bank account cards (Bank of America, Chase, Zelle/PayPal).
   - One-click "Copy Account Number" button with visual "Copied!" checkmark and toast notifications.
   - Physical gift delivery address with copy functionality.

10. **Accessibility & Performance**:
    - Mobile-first, fully responsive design tested on mobile, tablet, and desktop viewports.
    - Full support for `prefers-reduced-motion` for motion-sensitive guests.
    - Zero heavy external JavaScript frameworks.

---

## 📂 Project Structure

```text
wedding-invitation/
│
├── index.html                  # Main invitation document
├── vercel.json                 # Vercel deployment & caching configuration
├── package.json                # Project manifest and scripts
├── supabase-schema.sql         # Supabase database schema with RLS policies
├── README.md                   # Documentation and deployment guide
│
├── css/
│   ├── style.css               # Core design system, typography, card layouts
│   ├── animations.css          # Keyframes, envelope 3D physics, scroll reveal
│   └── responsive.css          # Responsive breakpoints for mobile & tablet
│
├── js/
│   ├── config.js               # Centralized wedding configuration
│   ├── envelope.js             # Envelope opening logic & wax seal sound
│   ├── countdown.js            # Countdown timer & calendar link generators
│   ├── music.js                # Music player & Web Audio synthesizer fallback
│   ├── gallery.js              # Photo gallery filter & lightbox modal
│   ├── rsvp.js                 # RSVP form & Supabase guestbook wall
│   └── main.js                 # App coordinator, petals canvas, copy to clipboard
│
├── images/
│   ├── couple/                 # Groom, bride, and hero portraits
│   ├── gallery/                # Pre-wedding and engagement photos
│   ├── backgrounds/            # Paper texture and watermarks
│   └── decorations/            # Wax seal, botanical corners, rings, crests
│
└── assets/
    ├── icons/                  # Bank & digital wallet logos
    └── music/                  # Romantic wedding melody audio file
```

---

## ⚙️ Centralized Configuration (`js/config.js`)

You can customize the entire wedding invitation without editing HTML or stylesheets! Simply open `js/config.js` and modify:

```javascript
const WEDDING_CONFIG = {
  couple: {
    groom: {
      fullName: "Alexander Christian Hayes",
      shortName: "Alexander",
      fatherName: "Mr. Robert Hayes",
      motherName: "Mrs. Eleanor Hayes",
      bio: "...",
      photo: "images/couple/groom.jpg",
      instagram: "https://instagram.com"
    },
    bride: {
      fullName: "Sophia Isabella Vance",
      shortName: "Sophia",
      fatherName: "Mr. William Vance",
      motherName: "Mrs. Catherine Vance",
      bio: "...",
      photo: "images/couple/bride.jpg",
      instagram: "https://instagram.com"
    },
    monogram: "A & S",
    quote: "“Two souls with but a single thought, two hearts that beat as one.”"
  },

  // Wedding Date (Format: YYYY-MM-DDTHH:mm:ss)
  weddingDate: "2027-09-18T10:00:00",
  displayDate: "Saturday, 18 September 2027",

  // Events (Venues, Times, Addresses, Maps)
  events: {
    ceremony: { ... },
    reception: { ... }
  },

  // Bank & Gift Accounts
  gifts: {
    accounts: [ ... ]
  },

  // Supabase Database Connection
  supabase: {
    url: window.ENV_SUPABASE_URL || "https://your-project.supabase.co",
    anonKey: window.ENV_SUPABASE_ANON_KEY || "your-anon-key-here"
  }
};
```

---

## 💌 Personalized Guest Invitations (URL Feature)

Share personalized links with your guests by appending `?to=` or `?guest=` to the URL:

- `https://your-wedding.vercel.app/?to=Jonathan+Sterling`
- `https://your-wedding.vercel.app/?to=Mr.+%26+Mrs.+Anderson`
- `https://your-wedding.vercel.app/?guest=Dr.+Marcus+Aurelius`

The guest's name will automatically appear on the front of the envelope's golden address pill!

---

## 🗄️ Supabase Setup Guide

1. Sign up or log into [Supabase](https://supabase.com/).
2. Create a new project (e.g., `wedding-invitation`).
3. In the left navigation, click **SQL Editor**.
4. Open the included `supabase-schema.sql` file, copy its contents, paste them into the SQL Editor, and click **Run**.
   - This script creates the `rsvps` and `wishes` tables.
   - Configures Row Level Security (RLS) allowing anonymous guests to `INSERT` and read approved wishes.
   - Creates indexes and populates initial sample wishes.
5. In your Supabase Dashboard, navigate to **Project Settings** > **API**.
6. Copy:
   - **Project URL**
   - **Project API Keys** -> `anon` (public key).
   *(Note: Never use or expose the `service_role` key).*
7. Update `js/config.js` or set them as Vercel Environment Variables:
   - `ENV_SUPABASE_URL`: Your Supabase Project URL
   - `ENV_SUPABASE_ANON_KEY`: Your Supabase Anon Key

---

## 🚀 Vercel Deployment Instructions

### Method 1: Deploy with Vercel CLI

```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Deploy from the project root directory
vercel

# 3. Follow the terminal prompts to link and deploy to production
vercel --prod
```

### Method 2: Deploy via GitHub & Vercel Dashboard

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of premium animated wedding invitation"
   git branch -M main
   git remote add origin https://github.com/your-username/wedding-invitation.git
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com/) and click **Add New** > **Project**.
3. Import your GitHub repository.
4. Under **Environment Variables**, optionally add:
   - `ENV_SUPABASE_URL`
   - `ENV_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel will build and assign a live production URL (e.g. `https://wedding-invitation-alpha.vercel.app`).

---

## 💻 Local Testing & Preview

To preview the website locally on your computer:

```bash
# Start a simple local server
npx serve . -l 3000
```

Then open `http://localhost:3000` in your web browser.

---

## 🔒 Security Best Practices

- **Row Level Security (RLS)** is enabled on all tables in `supabase-schema.sql`.
- Only the public `anon` key is used on the client-side.
- The `service_role` key is strictly prohibited in frontend client code.
- Input fields are escaped to prevent XSS vulnerabilities.
- Vercel HTTP response headers enforce `X-Content-Type-Options: nosniff` and `X-Frame-Options: SAMEORIGIN`.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use and customize it for your special day!

