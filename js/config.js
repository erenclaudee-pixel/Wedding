/**
 * ====================================================================
 * WEDDING INVITATION CONFIGURATION
 * ====================================================================
 * Customize all wedding details from this single file.
 * No need to modify HTML or other JavaScript files.
 */

const WEDDING_CONFIG = {
  // Couple Information
  couple: {
    groom: {
      fullName: "Yvan King Malitic",
      shortName: "Yvan King",
      initial: "Y",
      fatherName: "Mr. Malitic",
      motherName: "Mrs. Malitic",
      title: "The Groom",
      bio: "A man of passion, devotion, and strength. Finding Marielle made every horizon brighter and gave every dream its true meaning.",
      photo: "images/couple/groom.jpg",
      instagram: "https://instagram.com",
    },
    bride: {
      fullName: "Marielle Brimbuela",
      shortName: "Marielle",
      initial: "M",
      fatherName: "Mr. Brimbuela",
      motherName: "Mrs. Brimbuela",
      title: "The Bride",
      bio: "A woman of gentle grace, radiance, and boundless warmth. Yvan brings laughter, love, and comfort to every moment.",
      photo: "images/couple/bride.jpg",
      instagram: "https://instagram.com",
    },
    monogram: "Y & M",
    quote: "“Two souls with but a single thought, two hearts that beat as one.”",
    quoteAuthor: "John Keats",
    heroImage: "images/couple/couple-hero.jpg"
  },

  // Wedding Date & Time
  // Format: YYYY-MM-DDTHH:mm:ss (Local Time)
  weddingDate: "2027-09-18T10:00:00",
  displayDate: "Saturday, 18 September 2027",
  timezone: "GMT+07:00",

  // Events Details
  events: {
    ceremony: {
      title: "Holy Matrimony & Blessing",
      date: "Saturday, September 18, 2027",
      time: "10:00 AM – 11:30 AM",
      venue: "The Glasshouse Conservatory",
      building: "St. James Estate & Gardens",
      address: "124 Grand Vista Boulevard, Beverly Hills, CA 90210",
      mapUrl: "https://maps.google.com/?q=The+Glasshouse+Conservatory+Beverly+Hills",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105785.49479361819!2d-118.4727142!3d34.0736204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000",
      dressCode: "Formal Elegance / Champagne & Soft Pastels"
    },
    reception: {
      title: "Wedding Dinner & Reception",
      date: "Saturday, September 18, 2027",
      time: "06:00 PM – 10:00 PM",
      venue: "The Grand Mirrored Ballroom",
      building: "The Royal Fairmont Hotel",
      address: "437 Sunset Crest Parkway, Los Angeles, CA 90028",
      mapUrl: "https://maps.google.com/?q=The+Royal+Fairmont+Los+Angeles",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105785.49479361819!2d-118.4727142!3d34.0736204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bf07045269bf%3A0x868e4c198f398725!2sHollywood%2C%20Los%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000001",
      dressCode: "Black Tie Optional / Evening Luxe"
    }
  },

  // Event Schedule / Itinerary
  itinerary: [
    {
      time: "09:30 AM",
      title: "Guest Arrival & Welcome Refreshments",
      description: "Arrival at Conservatory courtyard with harp preludes and artisan iced teas.",
      icon: "glass"
    },
    {
      time: "10:00 AM",
      title: "Holy Matrimony Ceremony",
      description: "The exchange of sacred vows, rings, and romantic blessings in the glass chapel.",
      icon: "ring"
    },
    {
      time: "11:30 AM",
      title: "Confetti Blessing & Family Portraits",
      description: "Rose petal toss and photographs with honored family, bridal party, and guests.",
      icon: "camera"
    },
    {
      time: "05:30 PM",
      title: "Twilight Cocktail Reception",
      description: "Canapés, signature French 75 cocktails, and sunset string quartet serenade.",
      icon: "cocktail"
    },
    {
      time: "06:30 PM",
      title: "Grand Entrance & Banquet Dinner",
      description: "Welcoming the newlyweds followed by a curated four-course dining experience.",
      icon: "utensils"
    },
    {
      time: "08:00 PM",
      title: "Champagne Toast & Wedding Cake Cutting",
      description: "Heartfelt speeches from parents, best friends, and the ceremonial cake cutting.",
      icon: "cake"
    },
    {
      time: "08:30 PM",
      title: "First Dance & Celebration Party",
      description: "Opening the dance floor under twinkling chandeliers until the late evening.",
      icon: "music"
    }
  ],

  // Love Story Highlights
  story: [
    {
      year: "2021",
      title: "The First Encounter",
      description: "A chance conversation in front of Monet's Water Lilies at a contemporary art gallery. A rainy afternoon turned into hours of shared laughter."
    },
    {
      year: "2023",
      title: "The Unforgettable Journey",
      description: "Traveling along the sunlit cliffs of the Amalfi Coast, discovering a shared love for quiet ocean waves, vintage records, and handwritten letters."
    },
    {
      year: "2025",
      title: "She Said Yes!",
      description: "Under a canopy of fairy lights overlooking the calm waters at twilight, Yvan got down on one knee. With joyful tears, Marielle said yes to forever."
    },
    {
      year: "2027",
      title: "The Beginning of Always",
      description: "Surrounded by our dearest family and friends, Yvan and Marielle begin the most beautiful chapter of our lives as husband and wife."
    }
  ],

  // Photo Gallery
  gallery: [
    {
      src: "images/gallery/photo1.jpg",
      thumb: "images/gallery/photo1.jpg",
      title: "Golden Hour Glow",
      category: "prewedding"
    },
    {
      src: "images/gallery/photo2.jpg",
      thumb: "images/gallery/photo2.jpg",
      title: "A Gentle Whisper",
      category: "engagement"
    },
    {
      src: "images/gallery/photo3.jpg",
      thumb: "images/gallery/photo3.jpg",
      title: "Lakeside Romance",
      category: "prewedding"
    },
    {
      src: "images/gallery/photo4.jpg",
      thumb: "images/gallery/photo4.jpg",
      title: "Hand in Hand",
      category: "moments"
    },
    {
      src: "images/gallery/photo5.jpg",
      thumb: "images/gallery/photo5.jpg",
      title: "Laughter in the Sun",
      category: "moments"
    },
    {
      src: "images/gallery/photo6.jpg",
      thumb: "images/gallery/photo6.jpg",
      title: "The Engagement Ring",
      category: "engagement"
    },
    {
      src: "images/gallery/photo7.jpg",
      thumb: "images/gallery/photo7.jpg",
      title: "Dance Under the Stars",
      category: "prewedding"
    },
    {
      src: "images/gallery/photo8.jpg",
      thumb: "images/gallery/photo8.jpg",
      title: "Promise of Eternity",
      category: "engagement"
    }
  ],

  // Background Music
  music: {
    title: "A Thousand Years (Acoustic Piano & Cello)",
    artist: "The Wedding Symphony Orchestra",
    // Can be an audio file path or external stream URL
    url: "assets/music/wedding-melody.mp3",
    autoplayOnEnvelopeOpen: true
  },

  // Gift & Digital Registry
  gifts: {
    message: "Your presence, warm smiles, and heartfelt blessings are the greatest gifts we could ever ask for. However, should you wish to honor us with a wedding gift, a digital contribution toward our new home and future journey together would be warmly appreciated.",
    accounts: [
      {
        bankName: "Bank of America",
        accountNumber: "4839 2018 9402 1194",
        accountHolder: "Yvan King Malitic",
        type: "bank",
        badge: "Groom's Account",
        logo: "assets/icons/bank-boa.svg"
      },
      {
        bankName: "Chase Bank",
        accountNumber: "9283 1047 5582 3019",
        accountHolder: "Marielle Brimbuela",
        type: "bank",
        badge: "Bride's Account",
        logo: "assets/icons/bank-chase.svg"
      },
      {
        bankName: "Zelle & GCash",
        accountNumber: "yvan.marielle.wedding@gmail.com",
        accountHolder: "Yvan King & Marielle",
        type: "digital",
        badge: "Instant Transfer",
        logo: "assets/icons/zelle.svg"
      }
    ],
    shippingAddress: {
      recipient: "Yvan King Malitic & Marielle Brimbuela",
      address: "742 Evergreen Terrace, Suite 104, Beverly Hills, CA 90210",
      phone: "+1 (310) 555-0199"
    }
  },

  // Supabase Configuration for RSVP & Wishes
  // Replace these with your Supabase project credentials in Vercel environment variables or directly here
  supabase: {
    url: window.ENV_SUPABASE_URL || "https://ktrfxdqhndjvggjiqibk.supabase.co",
    anonKey: window.ENV_SUPABASE_ANON_KEY || "sb_publishable_z1UO9L1-R2H74_naTT9rTA_2Qmk0TF2",
    table: "rsvps",
    wishesTable: "wishes",
    // Set to true to automatically fallback to localStorage when Supabase is not connected
    allowDemoFallback: true
  },

  // Visual Theme & Options
  theme: {
    palette: {
      primary: "#C5A880",      // Champagne Gold
      primaryDark: "#9A7B56",  // Deep Antique Gold
      secondary: "#6B5B52",    // Warm Truffle
      accent: "#B85D58",       // Romantic Rose Gold / Terracotta
      cream: "#FAF8F5",        // Ivory Linen
      cardBg: "#FFFFFF",
      textDark: "#2B2625",
      textMuted: "#7A736E"
    },
    enablePetals: true,       // Floating romantic flower petals
    enableWaxCrackSound: true // Web Audio wax seal sound effect
  }
};

// Export to window for browser usage
if (typeof window !== "undefined") {
  window.WEDDING_CONFIG = WEDDING_CONFIG;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = WEDDING_CONFIG;
}

