/**
 * drawPath.js
 * Renders a winding S-curve dirt path that connects all field nodes
 * using quadratic Bézier curves. Draws three passes:
 *   1. Dark earthy edge (widest)
 *   2. Main dirt fill
 *   3. Subtle dashed centre line (like a real country road)
 */

import { PORTFOLIO_FIELDS } from '../data/portfolioData';

const PATH_EDGE  = '#7a5828';
const PATH_FILL  = '#c8a060';
const PATH_HIGH  = 'rgba(255, 220, 140, 0.28)';
const PATH_DASH  = 'rgba(255, 255, 220, 0.20)';
const PATH_W     = 30; // main path width in world px

/**
 * Draws a smooth path through all field-node coordinates.
 */
export function drawPath(ctx) {
  const coords = PORTFOLIO_FIELDS.map(f => f.coordinates);
  if (coords.length < 2) return;

  ctx.lineCap  = 'round';
  ctx.lineJoin = 'round';

  // ── Pass 1: dark earthy edge ──────────────────────────────────────────────
  ctx.strokeStyle = PATH_EDGE;
  ctx.lineWidth   = PATH_W + 10;
  traceCurve(ctx, coords);
  ctx.stroke();

  // ── Pass 2: main dirt colour ──────────────────────────────────────────────
  ctx.strokeStyle = PATH_FILL;
  ctx.lineWidth   = PATH_W;
  traceCurve(ctx, coords);
  ctx.stroke();

  // ── Pass 3: warm highlight strip (top edge feel) ──────────────────────────
  ctx.strokeStyle = PATH_HIGH;
  ctx.lineWidth   = 6;
  traceCurve(ctx, coords);
  ctx.stroke();

  // ── Pass 4: dashed centre line ────────────────────────────────────────────
  ctx.setLineDash([12, 16]);
  ctx.strokeStyle = PATH_DASH;
  ctx.lineWidth   = 2;
  traceCurve(ctx, coords);
  ctx.stroke();
  ctx.setLineDash([]);
}

/** Builds a smooth quadratic-Bézier chain through an array of {x,y} points */
function traceCurve(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);

  for (let i = 0; i < pts.length - 1; i++) {
    const cur  = pts[i];
    const nxt  = pts[i + 1];
    const mx   = (cur.x + nxt.x) / 2;
    const my   = (cur.y + nxt.y) / 2;
    ctx.quadraticCurveTo(cur.x, cur.y, mx, my);
  }

  // Final segment to the last point
  ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
}
