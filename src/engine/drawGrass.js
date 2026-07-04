/**
 * drawGrass.js
 * Renders the scrollable 32×32 pixel grass tile grid.
 * Each tile gets a deterministic color and pixel detail pattern
 * so the field looks alive without any external image assets.
 */

import { MAP_CONFIG } from '../data/portfolioData';

const T = MAP_CONFIG.tileSize; // 32

// ── Colour palette (earthy Stardew-style greens) ──────────────────────────────
const BASE_COLORS = [
  '#7ab86e', '#88c070', '#82bc6a', '#90c878',
  '#7cb86c', '#86be70', '#8ac474', '#7ebc6e',
];
const DARK_BLADE   = '#6aaa5c';
const LIGHT_BLADE  = '#98cc86';
const SHADOW_PATCH = '#609050';

/**
 * drawGrassTiles(ctx, worldW, worldH)
 * Call this once per frame before drawing anything else.
 */
export function drawGrassTiles(ctx, worldW, worldH) {
  const cols = Math.ceil(worldW / T) + 1;
  const rows = Math.ceil(worldH / T) + 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * T;
      const y = r * T;

      // ── Base tile colour (deterministic, no Math.random) ────────────────
      const idx = Math.abs((c * 7 + r * 13) ^ (c * r + r)) % BASE_COLORS.length;
      ctx.fillStyle = BASE_COLORS[idx];
      ctx.fillRect(x, y, T, T);

      // ── Pixel-art grass detail ──────────────────────────────────────────
      // A cheap hash that produces varied detail without RNG
      const h = ((c * 7919 + r * 6271) >>> 0) % 100;

      if (h < 30) {
        // Short dark grass blades
        ctx.fillStyle = DARK_BLADE;
        ctx.fillRect(x + 4,  y + 8,  3, 2);
        ctx.fillRect(x + 18, y + 22, 2, 3);
        ctx.fillRect(x + 26, y + 6,  2, 4);
      }
      if (h < 12) {
        // Light highlight blade
        ctx.fillStyle = LIGHT_BLADE;
        ctx.fillRect(x + 10, y + 4,  2, 5);
        ctx.fillRect(x + 22, y + 18, 2, 4);
      }
      if (h < 5) {
        // Occasional dark shadow patch
        ctx.fillStyle = SHADOW_PATCH;
        ctx.fillRect(x + 6, y + 14, 6, 4);
      }

      // ── Subtle tile grid line (very faint) ─────────────────────────────
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      ctx.fillRect(x, y, T, 1);
      ctx.fillRect(x, y, 1, T);
    }
  }
}
