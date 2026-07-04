/**
 * drawNodes.js
 * Renders every PORTFOLIO_FIELDS entry as a distinct pixel-art structure:
 *   • Fenced flower patch (soil bed + flower cluster)
 *   • Wooden sign post with icon + truncated name
 *   • Pulsing glow ring when the avatar is nearby
 *   • "START" banner for the first node
 *
 * All structures are built from canvas fillRect / arc primitives.
 * No external image assets required.
 */

import { PORTFOLIO_FIELDS } from '../data/portfolioData';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  soil:      '#8c6040',
  soilDark:  '#6a4828',
  fence:     '#b07840',
  fencePost: '#7a4828',
  woodLight: '#c8955a',
  woodDark:  '#7a4828',
  signBg:    '#ecdca8',
  startBg:   '#ffdf70',
  textDark:  '#4a3220',
};

// ── Flower colours per flowerType key ────────────────────────────────────────
const FLOWER_PAL = {
  daisy:     { petals: '#fffcd0', center: '#ffdf00', stem: '#4d8c40' },
  lavender:  { petals: '#c9a8e8', center: '#7848b0', stem: '#688830' },
  sunflower: { petals: '#ffdf00', center: '#8c4a20', stem: '#4d8c40' },
  tulip:     { petals: '#e86060', center: '#ff9090', stem: '#4d8c40' },
  bluebell:  { petals: '#88a8f0', center: '#4060d0', stem: '#4d8c40' },
  rose:      { petals: '#e84060', center: '#ff7090', stem: '#406030' },
};

// Flower cluster offsets (relative to patch center)
const CLUSTER_OFFSETS = [
  { ox:  0,  oy:  0 },
  { ox: -18, oy: -14 },
  { ox:  18, oy: -14 },
  { ox: -12, oy:  16 },
  { ox:  12, oy:  16 },
  { ox:   0, oy: -24 },
  { ox: -22, oy:   2 },
  { ox:  22, oy:   2 },
];

const PATCH = 64; // half = 32 px from centre

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * drawFieldNodes(ctx, nearbyFieldId, frame)
 * @param {CanvasRenderingContext2D} ctx
 * @param {string|null} nearbyFieldId  — id of the field the avatar is near
 * @param {number}      frame          — integer frame counter for animations
 */
export function drawFieldNodes(ctx, nearbyFieldId, frame) {
  PORTFOLIO_FIELDS.forEach((field, idx) => {
    const { x, y } = field.coordinates;
    const isFirst  = idx === 0;
    const isNear   = field.id === nearbyFieldId;
    drawNode(ctx, field, x, y, isNear, isFirst, frame);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function drawNode(ctx, field, cx, cy, isNear, isFirst, frame) {
  const px = cx - PATCH / 2;
  const py = cy - PATCH / 2;

  // ── Glow halo when avatar is nearby ──────────────────────────────────────
  if (isNear) {
    const pulse  = Math.sin(frame * 0.12) * 0.35 + 0.65;
    const radius = 48 + Math.sin(frame * 0.09) * 6;
    const grad   = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, `rgba(255,220,120,${0.30 * pulse})`);
    grad.addColorStop(1, 'rgba(255,220,120,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Fence ─────────────────────────────────────────────────────────────────
  drawFence(ctx, px - 10, py - 10, PATCH + 20, PATCH + 20);

  // ── Soil bed ──────────────────────────────────────────────────────────────
  ctx.fillStyle = C.soilDark;
  ctx.fillRect(px, py, PATCH, PATCH);
  ctx.fillStyle = C.soil;
  ctx.fillRect(px + 2, py + 2, PATCH - 4, PATCH - 4);
  // Soil texture rows
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (let row = 1; row < 4; row++) {
    ctx.fillRect(px + 4, py + row * 14, PATCH - 8, 2);
  }

  // ── Flower cluster ────────────────────────────────────────────────────────
  const fc = FLOWER_PAL[field.flowerType] || FLOWER_PAL.daisy;
  drawFlowerCluster(ctx, cx, cy, fc, isNear, frame);

  // ── Wooden sign post ──────────────────────────────────────────────────────
  drawSignPost(ctx, cx, py, field.icon, field.name, isFirst, field.themeColor, isNear);

  // ── Near-field pulsing ring ───────────────────────────────────────────────
  if (isNear) {
    const alpha  = (Math.sin(frame * 0.14) + 1) * 0.4;
    const rOuter = 44 + Math.sin(frame * 0.10) * 5;
    ctx.strokeStyle = `rgba(255, 230, 100, ${alpha})`;
    ctx.lineWidth   = 3;
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

// ── Fence ─────────────────────────────────────────────────────────────────────
function drawFence(ctx, x, y, w, h) {
  // Rails
  ctx.fillStyle = C.fence;
  ctx.fillRect(x,       y,       w, 4);   // top
  ctx.fillRect(x,       y+h-4,   w, 4);   // bottom
  ctx.fillRect(x,       y,       4, h);   // left
  ctx.fillRect(x+w-4,   y,       4, h);   // right

  // Corner posts (darker, slightly larger)
  ctx.fillStyle = C.fencePost;
  const corners = [[x-3,y-3],[x+w-4,y-3],[x-3,y+h-4],[x+w-4,y+h-4]];
  corners.forEach(([px, py]) => ctx.fillRect(px, py, 7, 7));
}

// ── Flower cluster ────────────────────────────────────────────────────────────
function drawFlowerCluster(ctx, cx, cy, fc, animated, frame) {
  CLUSTER_OFFSETS.forEach(({ ox, oy }, i) => {
    const bob = animated ? Math.sin(frame * 0.08 + i * 1.1) * 1.8 : 0;
    drawFlower(ctx, cx + ox, cy + oy + bob, fc);
  });
}

function drawFlower(ctx, x, y, fc) {
  const bx = Math.floor(x);
  const by = Math.floor(y);

  // Stem
  ctx.fillStyle = fc.stem;
  ctx.fillRect(bx - 1, by, 2, 8);

  // 4-directional petals (pixel style)
  ctx.fillStyle = fc.petals;
  ctx.fillRect(bx - 5, by - 3, 3, 3); // left
  ctx.fillRect(bx + 2,  by - 3, 3, 3); // right
  ctx.fillRect(bx - 2, by - 6, 3, 3); // top
  ctx.fillRect(bx - 2, by,     3, 3); // bottom

  // Centre dot
  ctx.fillStyle = fc.center;
  ctx.fillRect(bx - 2, by - 3, 3, 3);
}

// ── Wooden sign post ──────────────────────────────────────────────────────────
function drawSignPost(ctx, cx, topY, icon, name, isStart, themeColor, isNear) {
  // Vertical post
  ctx.fillStyle = C.woodDark;
  ctx.fillRect(cx - 2, topY - 50, 4, 44);

  // Sign board dimensions
  const shortName = name.length > 15 ? name.slice(0, 14) + '…' : name;
  const signW  = Math.min(shortName.length * 6 + 28, 120);
  const signH  = 28;
  const signX  = cx - signW / 2;
  const signY  = topY - 84;

  // Drop shadow
  ctx.fillStyle = '#5a3020';
  ctx.fillRect(signX + 4, signY + 4, signW, signH);

  // Board face — START gets a golden board, others use wood colour
  ctx.fillStyle = isStart ? C.startBg : C.signBg;
  ctx.fillRect(signX, signY, signW, signH);

  // Board border (2px pixel style)
  ctx.strokeStyle = C.woodDark;
  ctx.lineWidth   = 2;
  ctx.strokeRect(signX, signY, signW, signH);

  // Wood grain lines
  ctx.strokeStyle = 'rgba(140,90,50,0.15)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(signX + 4, signY + 9);  ctx.lineTo(signX + signW - 4, signY + 9);
  ctx.moveTo(signX + 4, signY + 18); ctx.lineTo(signX + signW - 4, signY + 18);
  ctx.stroke();

  // Glow tint on board when nearby
  if (isNear) {
    ctx.fillStyle = 'rgba(255,230,100,0.18)';
    ctx.fillRect(signX, signY, signW, signH);
  }

  // Icon (top line)
  ctx.fillStyle = C.textDark;
  ctx.font      = '9px "Press Start 2P", monospace';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, cx, signY + 9);

  // Name text (bottom line, monospace fallback for safety)
  ctx.font = '5px monospace';
  ctx.fillText(shortName, cx, signY + 21);

  // "START" banner underneath the first node
  if (isStart) {
    const bw = 54, bh = 14;
    const bx = cx - bw / 2;
    const by = topY + PATCH / 2 + 14;

    ctx.fillStyle = '#3a7230';
    ctx.fillRect(bx + 2, by + 2, bw, bh);
    ctx.fillStyle = '#5cb048';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = '#2a5220';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = '#ffffff';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText('START', cx, by + 7);
  }
}

// ── Exclamation proximity bubble (drawn on canvas above the node) ─────────────
/**
 * drawProximityBubble(ctx, fieldId, frame)
 * Shows an animated "!" + SPACE key bubble above the active nearby node.
 */
export function drawProximityBubble(ctx, fieldId, frame) {
  const field = PORTFOLIO_FIELDS.find(f => f.id === fieldId);
  if (!field) return;

  const { x, y } = field.coordinates;
  const topY  = y - PATCH / 2;
  const bounce = Math.sin(frame * 0.15) * 4;
  const alpha  = 0.75 + Math.sin(frame * 0.12) * 0.25;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Bubble
  const bw = 86, bh = 18;
  const bx = x - bw / 2;
  const by = topY - 108 + bounce;

  ctx.fillStyle   = 'rgba(255, 248, 210, 0.95)';
  ctx.strokeStyle = C.woodDark;
  ctx.lineWidth   = 2;
  roundRect(ctx, bx, by, bw, bh, 4);
  ctx.fill();
  ctx.stroke();

  // Tail triangle
  ctx.fillStyle = 'rgba(255, 248, 210, 0.95)';
  ctx.beginPath();
  ctx.moveTo(x - 5, by + bh);
  ctx.lineTo(x + 5, by + bh);
  ctx.lineTo(x,     by + bh + 6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = C.woodDark;
  ctx.lineWidth   = 1;
  ctx.stroke();

  // Text
  ctx.fillStyle    = C.textDark;
  ctx.font         = '5px "Press Start 2P", monospace';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('[SPACE] Enter', x, by + 9);

  ctx.restore();
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y,     x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x,     y + h, x,     y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x,     y,     x + r, y);
  ctx.closePath();
}
