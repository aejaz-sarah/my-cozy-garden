/**
 * drawAvatar.js
 * Renders the player avatar — a cute straw-hat gardener sprite
 * assembled entirely from canvas fillRect / arc primitives.
 *
 * Sprite breakdown (in world pixels):
 *   Total height ≈ 32px  |  width ≈ 24px
 *   Straw hat  : 16px wide × 14px tall (top)
 *   Head       : 10px wide × 10px tall
 *   Body/shirt : 12px wide × 10px tall
 *   Overalls   : 10px wide ×  8px tall
 *   Legs/shoes :  5px wide each × 7px tall
 *   Watering can (idle, left hand)
 *
 * Walking animation: 4-frame foot cycle driven by `frame` counter.
 * Direction: 'up' | 'down' | 'left' | 'right' — adjusts eye placement.
 */

export function drawAvatar(ctx, x, y, direction, isMoving, frame) {
  const bx = Math.floor(x);
  const by = Math.floor(y);

  // ── Ground shadow ────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath();
  ctx.ellipse(bx, by + 15, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Walking cycle ────────────────────────────────────────────────────────
  const walkFrame  = isMoving ? Math.floor(frame * 0.14) % 4 : 0;
  const legCycle   = [0, 3, 0, -3]; // vertical offsets per frame
  const lLeg       = legCycle[walkFrame];
  const rLeg       = legCycle[(walkFrame + 2) % 4]; // opposite phase
  const armSwing   = isMoving ? Math.sin(frame * 0.28) * 2 : 0;

  // ── Legs (drawn first so body overlaps them) ─────────────────────────────
  // Left leg
  ctx.fillStyle = '#8c7050';
  ctx.fillRect(bx - 7, by + 9 + lLeg, 5, 6);
  // Right leg
  ctx.fillRect(bx + 2,  by + 9 + rLeg, 5, 6);

  // Shoes
  ctx.fillStyle = '#5a3820';
  ctx.fillRect(bx - 8,  by + 14 + lLeg, 7, 3);
  ctx.fillRect(bx + 1,  by + 14 + rLeg, 7, 3);

  // ── Arms ─────────────────────────────────────────────────────────────────
  ctx.fillStyle = '#f0c890'; // skin tone
  // Left arm
  ctx.fillRect(bx - 11, by - 4 + armSwing,  5, 9);
  // Right arm
  ctx.fillRect(bx + 6,  by - 4 - armSwing,  5, 9);

  // ── Overalls (body) ───────────────────────────────────────────────────────
  ctx.fillStyle = '#7a8c50'; // earthy olive green
  ctx.fillRect(bx - 5, by + 1, 10, 9);

  // Bib
  ctx.fillStyle = '#8a9c60';
  ctx.fillRect(bx - 3, by - 3, 6, 5);

  // Suspenders
  ctx.fillStyle = '#5a6c38';
  ctx.fillRect(bx - 4, by - 5, 2, 7);
  ctx.fillRect(bx + 2,  by - 5, 2, 7);

  // ── Shirt (torso) ─────────────────────────────────────────────────────────
  ctx.fillStyle = '#f2e8d0'; // cream white
  ctx.fillRect(bx - 6, by - 7, 12, 9);

  // ── Head ─────────────────────────────────────────────────────────────────
  ctx.fillStyle = '#f2c890'; // skin
  ctx.fillRect(bx - 5, by - 17, 10, 11);

  // Hair (dark brown peek below hat brim)
  ctx.fillStyle = '#7a4828';
  ctx.fillRect(bx - 5, by - 17, 10, 4);

  // ── Eyes (direction-aware) ────────────────────────────────────────────────
  ctx.fillStyle = '#2a1808';
  if (direction === 'up') {
    // Facing away — show back of head, no eyes
    ctx.fillStyle = '#7a4828';
    ctx.fillRect(bx - 5, by - 17, 10, 9); // hair covers face
  } else if (direction === 'left') {
    ctx.fillRect(bx - 4, by - 12, 2, 2);
  } else if (direction === 'right') {
    ctx.fillRect(bx + 2,  by - 12, 2, 2);
  } else {
    // down / default — two eyes
    ctx.fillRect(bx - 4, by - 12, 2, 2);
    ctx.fillRect(bx + 2,  by - 12, 2, 2);
  }

  // Blush
  if (direction !== 'up') {
    ctx.fillStyle = 'rgba(255,150,120,0.55)';
    ctx.fillRect(bx - 5, by - 10, 3, 2);
    ctx.fillRect(bx + 2,  by - 10, 3, 2);
  }

  // ── Straw hat ─────────────────────────────────────────────────────────────
  // Wide brim
  ctx.fillStyle = '#c8a040';
  ctx.fillRect(bx - 12, by - 19, 24, 4);

  // Brim highlight
  ctx.fillStyle = '#e0bc60';
  ctx.fillRect(bx - 11, by - 19, 22, 2);

  // Crown
  ctx.fillStyle = '#c8a040';
  ctx.fillRect(bx - 8,  by - 30, 16, 13);

  // Crown shading (left darker, right lighter)
  ctx.fillStyle = '#a88030';
  ctx.fillRect(bx - 8,  by - 30, 5, 13);
  ctx.fillStyle = '#dfc060';
  ctx.fillRect(bx + 1,  by - 30, 4, 13);

  // Hat band
  ctx.fillStyle = '#8c6828';
  ctx.fillRect(bx - 8,  by - 20, 16, 3);

  // Hat top pixel highlight
  ctx.fillStyle = '#f0d870';
  ctx.fillRect(bx - 2,  by - 30, 4, 2);

  // ── Watering can (idle only, left hand) ───────────────────────────────────
  if (!isMoving) {
    // Body of can
    ctx.fillStyle = '#7090a0';
    ctx.fillRect(bx - 18, by + 1, 9, 7);
    // Spout
    ctx.fillStyle = '#607890';
    ctx.fillRect(bx - 22, by + 2, 5, 3);
    // Handle
    ctx.fillStyle = '#506878';
    ctx.fillRect(bx - 15, by - 1, 5, 3);
    // Water drops (animated — only when not moving)
    const drip = (frame >> 3) % 3;
    ctx.fillStyle = 'rgba(120,180,255,0.8)';
    if (drip >= 1) ctx.fillRect(bx - 24, by + 6, 2, 3);
    if (drip >= 2) ctx.fillRect(bx - 26, by + 9, 2, 2);
  }
}
