/**
 * portfolioData.js
 * ─────────────────────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH for every "Flower Field" node on the RPG map.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const PORTFOLIO_FIELDS = [
  // ── FIELD 01 ─ Profile Info ────────────────────────────────────────
  {
    id: 'profile',
    name: 'The Welcome Sign',
    chapter: 'Prologue',
    coordinates: { x: 120, y: 680 },
    themeColor: 'hsl(25, 90%, 65%)', // Warm peach/orange
    flowerType: 'daisy',
    icon: '🌸',
    items: [
      {
        label: 'Sarah Aejaz',
        description:
          '2nd-year CS (AI & ML) undergrad at G Narayanamma Institute of Technology and Science (GNITS).',
        highlight: true,
      },
      {
        label: 'GitHub',
        description: 'Check out my code repositories and contributions.',
        link: { href: 'https://github.com/', label: 'View GitHub →' },
      },
      {
        label: 'LinkedIn',
        description: 'Let\'s connect and talk about AI, Tech, and opportunities.',
        link: { href: 'https://linkedin.com/', label: 'View LinkedIn →' },
      },
      {
        label: 'LeetCode',
        description: 'My algorithmic problem-solving journey.',
        link: { href: 'https://leetcode.com/', label: 'View LeetCode →' },
      },
    ],
  },

  // ── FIELD 02 ─ Experience ────────────────────────────────────────
  {
    id: 'experience',
    name: 'Experience Grove',
    chapter: 'Chapter I · Work',
    coordinates: { x: 340, y: 510 },
    themeColor: 'hsl(110, 45%, 55%)', // Earthy green
    flowerType: 'lavender',
    icon: '🌿',
    items: [
      {
        label: 'AI Engineer Intern @ Qovai',
        description:
          '(May 2026 – Present) Developing AI features and content creation solutions for the e-commerce platform.',
        highlight: true,
        tags: ['AI', 'E-commerce', 'Content Creation'],
      },
      {
        label: 'PR Lead @ Innovation and Incubation Cell, GNITS',
        description:
          'Managing public relations, outreach, and event promotion strategies.',
        tags: ['Public Relations', 'Leadership', 'Event Management'],
      },
      {
        label: 'Student Ambassador @ We-Hub',
        description:
          'Campus lead for the We-Enable program.',
        tags: ['Ambassador', 'Leadership', 'Community'],
      },
    ],
  },

  // ── FIELD 03 ─ Projects ────────────────────────────────────────
  {
    id: 'projects',
    name: 'Project Pastures',
    chapter: 'Chapter II · Builds',
    coordinates: { x: 580, y: 340 },
    themeColor: 'hsl(45, 95%, 60%)', // Golden sun
    flowerType: 'sunflower',
    icon: '🛠️',
    items: [
      {
        label: 'GENIE',
        description:
          'Emotionally Aware Gamified Educational Platform — built an interactive AI chatbot with personalized avatars.',
        highlight: true,
        tags: ['React', 'Tailwind', 'Python', 'GenAI'],
      },
      {
        label: 'CogniPal',
        description:
          'Gamified Platform for Alzheimer\'s Patients — cognitive games for elderly users, accessible UI.',
        tags: ['React', 'Tailwind', 'Python'],
      },
      {
        label: 'SchroomScope',
        description:
          'Mushroom Species Classifier — data preprocessing and classification model built for DataNyx.',
        tags: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib'],
      },
    ],
  },

  // ── FIELD 04 ─ Achievements ────────────────────────────────────────
  {
    id: 'achievements',
    name: 'Trophy Gardens',
    chapter: 'Chapter III · Milestones',
    coordinates: { x: 780, y: 200 },
    themeColor: 'hsl(15, 80%, 65%)', // Warm sunset red/orange
    flowerType: 'tulip',
    icon: '🏆',
    items: [
      {
        label: 'Hack Revolution 2025 Winner',
        description:
          'Cash prize, Top 15/300+ teams, recognized by Google & Microsoft judges for fast implementation.',
        highlight: true,
        tags: ['Winner', 'Hackathon', 'Fast Implementation'],
      },
      {
        label: 'WE HUB Letter of Recommendation',
        description:
          'Recognized for leadership and community engagement.',
        tags: ['Leadership', 'Community'],
      },
      {
        label: 'DataNyx National Datathon Participant',
        description:
          'Competed in a national-level data science and analytics hackathon.',
        tags: ['Datathon', 'Data Science'],
      },
    ],
  },

  // ── FIELD 05 ─ Certifications ────────────────────────────────────────
  {
    id: 'certifications',
    name: 'Wisdom Woods',
    chapter: 'Chapter IV · Learning',
    coordinates: { x: 900, y: 440 },
    themeColor: 'hsl(35, 90%, 65%)', // Wood tone/orange
    flowerType: 'bluebell',
    icon: '📜',
    items: [
      {
        label: 'Generative AI',
        description: 'Completed certification on Coursera.',
        highlight: true,
        tags: ['Coursera', 'AI'],
      },
      {
        label: 'Preparing Yourself for Change',
        description: 'LinkedIn Learning certification.',
        tags: ['LinkedIn', 'Soft Skills'],
      },
      {
        label: 'Learning Python',
        description: 'LinkedIn Learning certification.',
        tags: ['LinkedIn', 'Python'],
      },
      {
        label: 'Communicating with Transparency...',
        description: 'Asserting Yourself, and Improving Judgment for Better Decision-Making (LinkedIn Learning).',
        tags: ['LinkedIn', 'Communication'],
      },
    ],
  },

  // ── FIELD 06 ─ Skills & Interests ────────────────────────────────────────
  {
    id: 'skills',
    name: 'The Artisan\'s Shed',
    chapter: 'Epilogue · Stack',
    coordinates: { x: 1050, y: 650 },
    themeColor: 'hsl(130, 50%, 45%)', // Deep grass green
    flowerType: 'rose',
    icon: '⚗️',
    items: [
      {
        label: 'Programming Languages',
        description: 'C, Python, HTML, CSS, React, Tailwind.',
        highlight: true,
        tags: ['C', 'Python', 'Web Dev'],
      },
      {
        label: 'Developer Tools',
        description: 'Git, VS Code.',
        tags: ['Git', 'VS Code'],
      },
      {
        label: 'Interests',
        description: 'Artificial Intelligence, Gamified Learning, Research, Generative AI, Cognitive Technology.',
        tags: ['AI', 'Gamified Learning', 'Research'],
      },
    ],
  },
];

// ── Convenience lookup map for O(1) field access ──────────────────────────────
export const FIELDS_BY_ID = Object.fromEntries(
  PORTFOLIO_FIELDS.map((field) => [field.id, field])
);

// ── Ordered list of field IDs defining the canonical path sequence ─────────────
export const PATH_SEQUENCE = PORTFOLIO_FIELDS.map((f) => f.id);

// ── Map canvas dimensions (shared constant) ────────────────────────────────────
export const MAP_CONFIG = {
  /** Logical canvas width in CSS pixels */
  width: 1200,
  /** Logical canvas height in CSS pixels */
  height: 800,
  /** Tile size for the grass grid (px) */
  tileSize: 32,
  /** Avatar walk speed in pixels-per-frame (at 60 fps) */
  avatarSpeed: 3,
  /** Proximity radius (px) within which avatar "arrives" at a field */
  arrivalThreshold: 24,
};
