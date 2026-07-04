/**
 * drawDecorations.js
 * Renders scattered world decorations:
 *   • Pixel-art pine/round trees
 *   • Red-cap mushrooms
 *   • An animated wandering cat
 *   • Golden sun disc (top of sky)
 *
 * All positions are fixed so the world feels hand-crafted.
 * No external images — pure canvas shapes.
 */

// ── Static positions ──────────────────────────────────────────────────────────
const TREES = [
  { x:  55, y: 110, type: 'pine'  },
  { x: 210, y:  90, type: 'round' },
  { x: 440, y:  75, type: 'pine'  },
  { x: 660, y: 100, type: 'round' },
  { x: 960, y:  85, type: 'pine'  },
  { x:1120, y: 180, type: 'pine'  },
  { x:1140, y: 520, type: 'round' },
  { x:  70, y: 380, type: 'pine'  },
  { x: 260, y: 730, type: 'round' },
  { x: 880, y: 730, type: 'pine'  },
  { x: 480, y: 730, type: 'round' },
];

const MUSHROOMS = [
  { x: 165, y: 590 },
  { x: 505, y: 430 },
  { x: 845, y: 310 },
  { x: 975, y: 565 },
  { x: 355, y: 745 },
  { x: 690, y: 680 },
];

// Cat wanders near the start area
const CAT_BASE = { x: 230, y: 710 };

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

export function drawDecorations(ctx, frame) {
  drawSunDisc(ctx);
  TREES.forEach(t => drawTree(ctx, t.x, t.y, t.type));
  MUSHROOMS.forEach(m => drawMushroom(ctx, m.x, m.y));
  drawCat(ctx, CAT_BASE.x, CAT_BASE.y, frame);
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// ── Sun disc ──────────────────────────────────────────────────────────────────
function drawSunDisc(ctx) {
  // Outer warm glow
  const glow = ctx.createRadialGradient(1050, 40, 10, 1050, 40, 80);
  glow.addColorStop(0, 'rgba(255,230,100,0.35)');
  glow.addColorStop(1, 'rgba(255,180,60,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(1050, 40, 80, 0, Math.PI * 2);
  ctx.fill();

  // Pixel sun body (checkerboard-style)
  const S = 6; // pixel block size
  const sunR = 28;
  for (let dy = -sunR; dy < sunR; dy += S) {
    for (let dx = -sunR; dx < sunR; dx += S) {
      if (dx * dx + dy * dy < sunR * sunR) {
        const shade = (Math.abs(dx) + Math.abs(dy)) < 10 ? '#fff8c0' : '#ffdf50';
        ctx.fillStyle = shade;
        ctx.fillRect(1050 + dx, 40 + dy, S, S);
      }
    }
  }
}

// ── Pine tree ─────────────────────────────────────────────────────────────────
function drawTree(ctx, x, y, type) {
  if (type === 'pine') {
    drawPineTree(ctx, x, y);
  } else {
    drawRoundTree(ctx, x, y);
  }
}

function drawPineTree(ctx, x, y) {
  // Trunk
  ctx.fillStyle = '#8e5e3c';
  ctx.fillRect(x - 4, y + 6, 8, 16);

  // Three layered triangles (bottom → top)
  const layers = [
    { yOff: 0,   half: 16, col: '#4d8c40' },
    { yOff:-12,  half: 13, col: '#3a7230' },
    { yOff:-22,  half: 10, col: '#4d8c40' },
    { yOff:-30,  half:  7, col: '#5ca050' },
    { yOff:-37,  half:  4, col: '#4d8c40' },
  ];
  layers.forEach(({ yOff, half, col }) => {
    ctx.fillStyle = col;
    ctx.fillRect(x - half, y + yOff, half * 2, 14);
  });

  // Highlight streak
  ctx.fillStyle = '#78cc68';
  ctx.fillRect(x,     y - 34, 4, 12);
  ctx.fillRect(x + 2, y - 20, 3,  8);
}

function drawRoundTree(ctx, x, y) {
  // Trunk
  ctx.fillStyle = '#8e5e3c';
  ctx.fillRect(x - 4, y + 2, 8, 18);

  // Foliage (stacked squares for pixel look)
  const blobs = [
    { ox: 0, oy: 0,  r: 18, col: '#4d8c40' },
    { ox:-8, oy:-8,  r: 12, col: '#3a7230' },
    { ox: 8, oy:-6,  r: 11, col: '#5ca050' },
    { ox: 0, oy:-14, r:  9, col: '#4d8c40' },
  ];
  blobs.forEach(({ ox, oy, r, col }) => {
    ctx.fillStyle = col;
    ctx.fillRect(x + ox - r, y + oy - r, r * 2, r * 2);
  });

  // Highlight
  ctx.fillStyle = '#78cc68';
  ctx.fillRect(x - 4, y - 22, 6, 6);
}

// ── Mushroom ──────────────────────────────────────────────────────────────────
function drawMushroom(ctx, x, y) {
  // Stem
  ctx.fillStyle = '#f0e0c8';
  ctx.fillRect(x - 3, y, 7, 10);

  // Cap (dark underside then red top)
  ctx.fillStyle = '#c02810';
  ctx.fillRect(x - 9, y - 6, 18, 7);
  ctx.fillStyle = '#e84020';
  ctx.fillRect(x - 8, y - 10, 17, 6);

  // White spots
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 5, y - 9, 3, 3);
  ctx.fillRect(x + 1,  y - 7, 2, 2);
  ctx.fillRect(x - 2, y - 5, 2, 2);
}

// ── Animated cat ─────────────────────────────────────────────────────────────
function drawCat(ctx, x, y, frame) {
  // Cat slowly paces left/right
  const walk    = Math.sin(frame * 0.018) * 30;
  const tailWag = Math.sin(frame * 0.06) * 4;
  const cx      = x + walk;
  const cy      = y;

  // Body
  ctx.fillStyle = '#c0b8a8';
  ctx.fillRect(cx - 9, cy - 6, 18, 12);

  // Head
  ctx.fillStyle = '#c0b8a8';
  ctx.fillRect(cx - 7, cy - 16, 14, 12);

  // Ears
  ctx.fillStyle = '#c0b8a8';
  ctx.fillRect(cx - 7, cy - 22, 5, 7);
  ctx.fillRect(cx + 2,  cy - 22, 5, 7);
  ctx.fillStyle = '#e8a0a0';
  ctx.fillRect(cx - 6, cy - 21, 3, 5);
  ctx.fillRect(cx + 3,  cy - 21, 3, 5);

  // Eyes (slanted for cat look)
  ctx.fillStyle = '#608060';
  ctx.fillRect(cx - 5, cy - 12, 3, 2);
  ctx.fillRect(cx + 2,  cy - 12, 3, 2);
  ctx.fillStyle = '#000000';
  ctx.fillRect(cx - 4, cy - 12, 1, 2);
  ctx.fillRect(cx + 3,  cy - 12, 1, 2);

  // Nose & whiskers
  ctx.fillStyle = '#e08090';
  ctx.fillRect(cx - 1, cy - 9, 2, 2);
  ctx.fillStyle = '#a0a090';
  ctx.fillRect(cx - 8, cy - 9, 6, 1); // left whisker
  ctx.fillRect(cx + 2,  cy - 9, 6, 1); // right whisker

  // Legs
  ctx.fillStyle = '#a8a098';
  const legAnim = Math.sin(frame * 0.04) * 2;
  ctx.fillRect(cx - 8, cy + 6, 4, 7 + legAnim);
  ctx.fillRect(cx - 2, cy + 6, 4, 7 - legAnim);
  ctx.fillRect(cx + 4,  cy + 6, 4, 7 + legAnim);

  // Tail
  ctx.fillStyle = '#c0b8a8';
  ctx.fillRect(cx + 9,  cy - 2 + tailWag, 4, 5);
  ctx.fillRect(cx + 11, cy - 6 + tailWag, 4, 5);
  ctx.fillRect(cx + 13, cy - 9 + tailWag, 4, 5);

  // Tail tip (slightly lighter)
  ctx.fillStyle = '#e0d8c8';
  ctx.fillRect(cx + 13, cy - 11 + tailWag, 5, 4);
}
