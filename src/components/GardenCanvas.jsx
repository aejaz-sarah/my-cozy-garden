/**
 * GardenCanvas.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * CORE RENDERING ENGINE — Step 2
 *
 * Architecture:
 *   • Canvas internal resolution = MAP_CONFIG.width × MAP_CONFIG.height (1200×800)
 *   • CSS scales it to 100vw × 100% (pixel-art upscale via image-rendering:pixelated)
 *   • requestAnimationFrame game loop runs at native refresh rate
 *   • All avatar state lives in refs — no per-frame React re-renders
 *   • GameContext is synced sparingly (dialogue text, field arrival events)
 *
 * Input:
 *   WASD / Arrow Keys  → direct avatar movement
 *   Space              → interact with nearest field node
 *   Escape             → handled by MainStage (close overlay)
 *
 * Menu nav (FieldSelectMenu):
 *   Clicking a field sets targetFieldId in GameContext → avatar auto-navigates
 *
 * Render pipeline per frame:
 *   1. drawGrassTiles   — tiled earthy green grid
 *   2. drawDecorations  — trees, mushrooms, cat (behind path)
 *   3. drawPath         — winding dirt bezier road
 *   4. drawFieldNodes   — fenced flower patches + signs
 *   5. drawProximityBubble — [SPACE] hint above nearby node
 *   6. drawAvatar       — straw-hat gardener sprite (drawn last = on top)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useEffect, useCallback } from 'react';
import { useGame }          from '../context/GameContext';
import { PORTFOLIO_FIELDS, MAP_CONFIG } from '../data/portfolioData';

import { drawGrassTiles }          from '../engine/drawGrass';
import { drawPath }                from '../engine/drawPath';
import { drawFieldNodes, drawProximityBubble } from '../engine/drawNodes';
import { drawAvatar }              from '../engine/drawAvatar';
import { drawDecorations }         from '../engine/drawDecorations';

// ── Constants ─────────────────────────────────────────────────────────────────
const W         = MAP_CONFIG.width;          // 1200 — canvas pixel width
const H         = MAP_CONFIG.height;         // 800  — canvas pixel height
const SPEED     = 130;                       // avatar px/sec (world space)
const ARRIVAL   = MAP_CONFIG.arrivalThreshold; // 24px
const PROX_DIST = 72;                        // proximity trigger radius (px)
const AUTO_MULT = 4.0;                       // auto-nav speed multiplier

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function GardenCanvas() {
  const canvasRef = useRef(null);

  // ── Avatar local state (refs — live at 60fps, no re-renders) ─────────────
  const pos       = useRef({ ...PORTFOLIO_FIELDS[0].coordinates }); // start at profile
  const keys      = useRef(new Set());
  const frame     = useRef(0);
  const dir       = useRef('down');
  const moving    = useRef(false);
  const nearbyId  = useRef(null);           // id of closest node within PROX_DIST

  // ── GameContext action refs (always latest, safe inside RAF loop) ─────────
  const { targetFieldId, arriveAtField, setDialogue, isHarvested, activeFieldId } = useGame();

  // Mirror context values into refs for the RAF loop (avoids stale closures)
  const targetRef    = useRef(targetFieldId);
  const harvestedRef = useRef(isHarvested);
  const activeRef    = useRef(activeFieldId);
  useEffect(() => { targetRef.current    = targetFieldId; }, [targetFieldId]);
  useEffect(() => { harvestedRef.current = isHarvested;   }, [isHarvested]);
  useEffect(() => { activeRef.current    = activeFieldId; }, [activeFieldId]);

  // Stable refs to context callbacks (stable identity from GameProvider)
  const arriveRef    = useRef(arriveAtField);
  const dialogueRef  = useRef(setDialogue);
  useEffect(() => { arriveRef.current   = arriveAtField; }, [arriveAtField]);
  useEffect(() => { dialogueRef.current = setDialogue;   }, [setDialogue]);

  // ── Keyboard handlers ─────────────────────────────────────────────────────
  useEffect(() => {
    const onDown = (e) => {
      const k = e.key.toLowerCase();
      keys.current.add(k);

      // Space: interact with nearby node (if overlay not open)
      if (k === ' ' && nearbyId.current && !harvestedRef.current && !activeRef.current) {
        arriveRef.current(nearbyId.current);
        e.preventDefault();
      }
      // Prevent scroll on arrow keys
      if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)) {
        e.preventDefault();
      }
    };
    const onUp = (e) => keys.current.delete(e.key.toLowerCase());

    window.addEventListener('keydown', onDown, { passive: false });
    window.addEventListener('keyup',   onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup',   onUp);
    };
  }, []); // empty — uses only refs inside handler

  // ── Main game tick ────────────────────────────────────────────────────────
  // useCallback with [] dep + tickRef pattern for stable RAF without stale closures
  const tick = useCallback((dt) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    frame.current++;
    const f = frame.current;

    // ── 1. MOVEMENT ──────────────────────────────────────────────────────────
    let { x, y } = pos.current;
    let isMoving  = false;

    const tId = targetRef.current;

    if (tId && !harvestedRef.current) {
      // AUTO-NAVIGATE toward clicked field in the side menu
      const tf = PORTFOLIO_FIELDS.find(fi => fi.id === tId);
      if (tf) {
        const dx   = tf.coordinates.x - x;
        const dy   = tf.coordinates.y - y;
        const dist = Math.hypot(dx, dy);

        if (dist < ARRIVAL) {
          arriveRef.current(tId);
        } else {
          const step = Math.min(SPEED * AUTO_MULT * dt, dist);
          x += (dx / dist) * step;
          y += (dy / dist) * step;
          isMoving = true;
          dir.current = (Math.abs(dx) > Math.abs(dy))
            ? (dx > 0 ? 'right' : 'left')
            : (dy > 0 ? 'down'  : 'up');
        }
      }
    } else if (!harvestedRef.current) {
      // KEYBOARD MOVEMENT
      let dx = 0, dy = 0;
      if (keys.current.has('w') || keys.current.has('arrowup'))    dy -= 1;
      if (keys.current.has('s') || keys.current.has('arrowdown'))  dy += 1;
      if (keys.current.has('a') || keys.current.has('arrowleft'))  dx -= 1;
      if (keys.current.has('d') || keys.current.has('arrowright')) dx += 1;

      if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; } // diagonal normalise

      if (dx !== 0 || dy !== 0) {
        x += dx * SPEED * dt;
        y += dy * SPEED * dt;
        isMoving = true;
        dir.current = (Math.abs(dx) > Math.abs(dy))
          ? (dx > 0 ? 'right' : 'left')
          : (dy > 0 ? 'down'  : 'up');
      }
    }

    // ── 2. BOUNDS CLAMP ──────────────────────────────────────────────────────
    const PAD = 14;
    x = Math.max(PAD, Math.min(W - PAD, x));
    y = Math.max(PAD, Math.min(H - PAD, y));
    pos.current  = { x, y };
    moving.current = isMoving;

    // ── 3. PROXIMITY CHECK (throttled — every 4 frames) ──────────────────────
    if (f % 4 === 0) {
      let closest = null;
      let bestDist = Infinity;
      for (const fi of PORTFOLIO_FIELDS) {
        const dist = Math.hypot(fi.coordinates.x - x, fi.coordinates.y - y);
        if (dist < PROX_DIST && dist < bestDist) {
          closest  = fi.id;
          bestDist = dist;
        }
      }

      if (closest !== nearbyId.current) {
        nearbyId.current = closest;
        if (closest) {
          const fi = PORTFOLIO_FIELDS.find(f => f.id === closest);
          dialogueRef.current(`${fi.icon} ${fi.name} · Press [Space] to explore`);
        } else if (!activeRef.current) {
          dialogueRef.current(null);
        }
      }
    }

    // ── 4. RENDER ─────────────────────────────────────────────────────────────
    ctx.clearRect(0, 0, W, H);

    // Layer 1: Grass tiles
    drawGrassTiles(ctx, W, H);

    // Layer 2: Background decorations (trees, mushrooms, cat)
    drawDecorations(ctx, f);

    // Layer 3: Dirt path
    drawPath(ctx);

    // Layer 4: Field nodes (flower patches + signs)
    drawFieldNodes(ctx, nearbyId.current, f);

    // Layer 5: Proximity bubble (above active nearby node)
    if (nearbyId.current && !harvestedRef.current && !activeRef.current) {
      drawProximityBubble(ctx, nearbyId.current, f);
    }

    // Layer 6: Avatar (always on top)
    drawAvatar(ctx, x, y, dir.current, isMoving, f);

  }, []); // stable — all mutable state lives in refs

  // ── RAF Loop ─────────────────────────────────────────────────────────────
  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    let rafId;
    let lastTime = performance.now();

    function loop(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap delta at 50ms
      lastTime = now;
      tickRef.current(dt);
      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []); // single RAF loop for the lifetime of the component

  // ── Canvas element ────────────────────────────────────────────────────────
  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{
        display: 'block',
        width:   '100%',
        height:  '100%',
        imageRendering: 'pixelated',
        cursor: 'default',
      }}
      aria-label="Interactive portfolio garden map"
    />
  );
}
