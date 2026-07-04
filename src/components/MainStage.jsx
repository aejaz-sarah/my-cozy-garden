/**
 * MainStage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * FULL-SCREEN LAYOUT WRAPPER
 *
 * Responsibilities:
 *  1. Renders the pastel sunset atmospheric background (CSS gradient layers).
 *  2. Hosts the <GardenCanvas /> attachment point (canvas game world).
 *  3. Hosts the HUD overlay layer (dialogue box, field menu, harvest overlay).
 *  4. Manages the top-level keyboard shortcut listener (Escape to close overlay).
 *
 * LAYER STACK (back → front):
 *  ┌─────────────────────────────────────────────────────────┐  z-0
 *  │  Pastel Sunset CSS Gradient + animated star-dust layer  │
 *  ├─────────────────────────────────────────────────────────┤  z-10
 *  │  <GardenCanvas />   — HTML5 canvas, full-screen         │
 *  ├─────────────────────────────────────────────────────────┤  z-20
 *  │  <FieldSelectMenu /> — clickable field node side-panel  │
 *  ├─────────────────────────────────────────────────────────┤  z-30
 *  │  <DialogueBox />   — bottom HUD dialogue strip          │
 *  ├─────────────────────────────────────────────────────────┤  z-40
 *  │  <HarvestOverlay /> — full-screen data panel + petals   │
 *  └─────────────────────────────────────────────────────────┘  z-50
 *
 * PLACEHOLDER ATTACHMENT POINTS are marked with TODO comments so
 * feature components slot in cleanly without touching layout logic.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { PORTFOLIO_FIELDS } from '../data/portfolioData';
import GardenCanvas from './GardenCanvas'; // ✅ Step 2 — real canvas engine

// TODO: Replace with `import FieldSelectMenu from '../hud/FieldSelectMenu';`
const FieldSelectMenu = () => {
  const { moveAvatarTo } = useGame();
  return (
    <nav className="field-select-menu" aria-label="Field Navigation">
      <h3 className="menu-title">🗺️ Fields</h3>
      <ul className="field-list">
        {PORTFOLIO_FIELDS.map((field) => (
          <li key={field.id}>
            <button
              id={`field-btn-${field.id}`}
              className="field-btn"
              onClick={() => moveAvatarTo(field.id)}
              title={`Navigate to ${field.name}`}
            >
              <span className="field-icon">{field.icon}</span>
              <span className="field-label">{field.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// TODO: Replace with `import DialogueBox from '../hud/DialogueBox';`
const DialogueBox = () => {
  const { dialogueText } = useGame();
  if (!dialogueText) return null;
  return (
    <div className="dialogue-box" role="status" aria-live="polite">
      <span className="dialogue-arrow">▶</span>
      <p className="dialogue-text">{dialogueText}</p>
    </div>
  );
};

// TODO: Replace with `import HarvestOverlay from '../hud/HarvestOverlay';`
const HarvestOverlay = () => {
  const {
    isHarvested,
    isHarvesting,
    activeFieldId,
    startHarvest,
    completeHarvest,
    closeOverlay,
  } = useGame();

  // Orchestrate the two-phase harvest sequence
  useEffect(() => {
    if (!isHarvesting) return;
    const timer = setTimeout(completeHarvest, 800); // flash duration
    return () => clearTimeout(timer);
  }, [isHarvesting, completeHarvest]);

  if (!activeFieldId && !isHarvesting && !isHarvested) return null;

  return (
    <div className={`harvest-overlay-stub ${isHarvested ? 'open' : ''} ${isHarvesting ? 'flashing' : ''}`}>
      {isHarvesting && (
        <div className="harvest-flash">
          <span>✨ Harvesting…</span>
        </div>
      )}
      {!isHarvesting && activeFieldId && !isHarvested && (
        <div className="harvest-prompt">
          <p>You&apos;ve arrived!</p>
          <button id="harvest-btn" className="harvest-btn" onClick={startHarvest}>
            🌾 Harvest
          </button>
        </div>
      )}
      {isHarvested && (
        <div className="harvest-data-panel">
          <p>📜 Data panel renders here — <code>&lt;HarvestOverlay /&gt;</code></p>
          <button id="close-overlay-btn" className="close-btn" onClick={closeOverlay}>
            ✕ Close
          </button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN STAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function MainStage() {
  const { closeOverlay, isHarvested } = useGame();

  // Global ESC key handler — closes any open overlay
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && isHarvested) {
        closeOverlay();
      }
    },
    [closeOverlay, isHarvested]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="main-stage" id="main-stage">

      {/* ── LAYER 0: Atmospheric Sunset Background ─────────────────────── */}
      <div className="sky-backdrop" aria-hidden="true">
        {/* Animated drifting clouds / star-dust particles */}
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
        {/* Floating mote particles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="mote" style={{ '--i': i }} />
        ))}
      </div>

      {/* ── LAYER 1: Title / Brand strip ──────────────────────────────── */}
      <header className="stage-header" role="banner">
        <div className="brand-pill">
          <span className="brand-icon">🌸</span>
          <span className="brand-name">My Cozy Garden</span>
          <span className="brand-sub">· Interactive Portfolio ·</span>
        </div>
        <div className="controls-hint" aria-label="Controls hint">
          WASD/Arrows: move&nbsp;·&nbsp;Space: interact&nbsp;·&nbsp;ESC: close
        </div>
      </header>

      {/* ── LAYER 2: GardenCanvas ─────────────────────────────────────── */}
      {/*
        ATTACHMENT POINT — GardenCanvas
        Props it will receive:
          <GardenCanvas />
        The canvas fills this section and handles its own sizing via CSS.
      */}
      <section className="canvas-stage" aria-label="Interactive portfolio map">
        <GardenCanvas />
      </section>

      {/* ── LAYER 3: Field Select Side-Menu HUD ───────────────────────── */}
      {/*
        ATTACHMENT POINT — FieldSelectMenu
        Dynamically rendered from PORTFOLIO_FIELDS array.
        <FieldSelectMenu />
      */}
      <FieldSelectMenu />

      {/* ── LAYER 4: Dialogue Box HUD ─────────────────────────────────── */}
      {/*
        ATTACHMENT POINT — DialogueBox
        <DialogueBox />
      */}
      <DialogueBox />

      {/* ── LAYER 5: Harvest Overlay (Petal shower + Data panel) ──────── */}
      {/*
        ATTACHMENT POINT — HarvestOverlay
        <HarvestOverlay />
      */}
      <HarvestOverlay />

    </div>
  );
}
