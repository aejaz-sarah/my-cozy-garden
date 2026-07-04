/* postcss.config.js
 * ─────────────────────────────────────────────────────────────────────────────
 * PostCSS configuration for the My Cozy Garden project.
 *
 * NOTE: With Tailwind CSS v4 + @tailwindcss/vite, PostCSS is NOT required
 * for Tailwind processing (the Vite plugin handles that directly).
 * This file is provided for tooling compatibility and any additional
 * PostCSS plugins you may want to add (e.g., cssnano for production builds).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export default {
  plugins: {
    // Tailwind v4: processed by @tailwindcss/vite, not postcss-plugin
    // If you need v3-style PostCSS integration, replace with:
    // tailwindcss: {},
    autoprefixer: {},
  },
};
