/**
 * GameContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * UNIFIED GAME STATE ENGINE
 *
 * This context is the central nervous system of the portfolio RPG.
 * Every interactive component reads from — or writes to — this single store.
 *
 * STATE TOPOLOGY:
 * ┌──────────────────────┬──────────────────────────────────────────────────┐
 * │ avatarPosition       │ { x, y } — live pixel position of the sprite     │
 * │ targetFieldId        │ string | null — field the user clicked to go to  │
 * │ activeFieldId        │ string | null — field avatar has arrived at       │
 * │ isMoving             │ boolean — true while avatar is walking            │
 * │ isHarvesting         │ boolean — true during the retro loading effect    │
 * │ isHarvested          │ boolean — true when overlay + petals are shown    │
 * │ particleBurst        │ boolean — pulse flag to fire petal emitter        │
 * │ dialogueText         │ string | null — HUD dialogue line                 │
 * │ mapOffset            │ { x, y } — camera pan offset for large maps       │
 * │ visitedFields        │ Set<string> — fields previously harvested         │
 * └──────────────────────┴──────────────────────────────────────────────────┘
 *
 * ACTIONS (dispatched via useGame()):
 *  moveAvatarTo(fieldId)    — plots a course to a field node
 *  arriveAtField(fieldId)   — called by the canvas loop on arrival
 *  startHarvest()           — begins harvest animation sequence
 *  completeHarvest()        — fires petals & opens overlay
 *  closeOverlay()           — resets harvest state, keeps position
 *  setDialogue(text)        — pushes a line into the HUD dialogue box
 *  panCamera(dx, dy)        — adjusts map scroll offset
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { FIELDS_BY_ID, MAP_CONFIG } from '../data/portfolioData';

// ─────────────────────────────────────────────────────────────────────────────
// 1. INITIAL STATE
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_STATE = {
  // Avatar
  avatarPosition: { x: 120, y: 680 },   // starts at the "about" field
  isMoving: false,

  // Field routing
  targetFieldId: null,
  activeFieldId: null,

  // Harvest lifecycle
  isHarvesting: false,   // loading flash phase
  isHarvested: false,    // overlay open phase
  particleBurst: false,  // one-shot emitter trigger

  // HUD dialogue
  dialogueText: null,

  // Camera
  mapOffset: { x: 0, y: 0 },

  // Persistence
  visitedFields: new Set(),
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. ACTION TYPES
// ─────────────────────────────────────────────────────────────────────────────
export const GAME_ACTIONS = Object.freeze({
  MOVE_TO_FIELD:       'MOVE_TO_FIELD',
  UPDATE_AVATAR_POS:   'UPDATE_AVATAR_POS',
  ARRIVE_AT_FIELD:     'ARRIVE_AT_FIELD',
  START_HARVEST:       'START_HARVEST',
  COMPLETE_HARVEST:    'COMPLETE_HARVEST',
  CLOSE_OVERLAY:       'CLOSE_OVERLAY',
  SET_DIALOGUE:        'SET_DIALOGUE',
  PAN_CAMERA:          'PAN_CAMERA',
  RESET_PARTICLE:      'RESET_PARTICLE',
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. PURE REDUCER
// ─────────────────────────────────────────────────────────────────────────────
function gameReducer(state, action) {
  switch (action.type) {

    case GAME_ACTIONS.MOVE_TO_FIELD: {
      const field = FIELDS_BY_ID[action.payload];
      if (!field) return state;
      return {
        ...state,
        targetFieldId: action.payload,
        activeFieldId: null,
        isMoving: true,
        isHarvested: false,
        isHarvesting: false,
        dialogueText: `Heading to ${field.name}…`,
      };
    }

    case GAME_ACTIONS.UPDATE_AVATAR_POS: {
      return {
        ...state,
        avatarPosition: action.payload, // { x, y }
      };
    }

    case GAME_ACTIONS.ARRIVE_AT_FIELD: {
      const field = FIELDS_BY_ID[action.payload];
      return {
        ...state,
        isMoving: false,
        targetFieldId: null,
        activeFieldId: action.payload,
        dialogueText: field
          ? `You arrived at ${field.name}! ${field.icon} Press Harvest to reveal.`
          : null,
      };
    }

    case GAME_ACTIONS.START_HARVEST: {
      return {
        ...state,
        isHarvesting: true,
        dialogueText: '✨ Harvesting…',
      };
    }

    case GAME_ACTIONS.COMPLETE_HARVEST: {
      const nextVisited = new Set(state.visitedFields);
      if (state.activeFieldId) nextVisited.add(state.activeFieldId);
      return {
        ...state,
        isHarvesting: false,
        isHarvested: true,
        particleBurst: true,
        visitedFields: nextVisited,
        dialogueText: null,
      };
    }

    case GAME_ACTIONS.RESET_PARTICLE: {
      return { ...state, particleBurst: false };
    }

    case GAME_ACTIONS.CLOSE_OVERLAY: {
      return {
        ...state,
        isHarvested: false,
        isHarvesting: false,
        dialogueText: null,
        // keep activeFieldId so avatar stays put
      };
    }

    case GAME_ACTIONS.SET_DIALOGUE: {
      return { ...state, dialogueText: action.payload };
    }

    case GAME_ACTIONS.PAN_CAMERA: {
      const { dx, dy } = action.payload;
      return {
        ...state,
        mapOffset: {
          x: Math.max(
            -(MAP_CONFIG.width - window.innerWidth),
            Math.min(0, state.mapOffset.x + dx)
          ),
          y: Math.max(
            -(MAP_CONFIG.height - window.innerHeight),
            Math.min(0, state.mapOffset.y + dy)
          ),
        },
      };
    }

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CONTEXT CREATION
// ─────────────────────────────────────────────────────────────────────────────
export const GameContext = createContext(null);

// ─────────────────────────────────────────────────────────────────────────────
// 5. PROVIDER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  /**
   * Ref that the canvas game-loop uses to read avatar position without
   * triggering re-renders on every animation frame.
   */
  const avatarPosRef = useRef(INITIAL_STATE.avatarPosition);

  // ── Stable action creators ────────────────────────────────────────────────

  /** Navigate avatar toward a field node by its id */
  const moveAvatarTo = useCallback((fieldId) => {
    dispatch({ type: GAME_ACTIONS.MOVE_TO_FIELD, payload: fieldId });
  }, []);

  /**
   * Called by the canvas game-loop each frame to push new position data.
   * Uses a ref update + a batched dispatch to avoid 60fps re-render storms.
   */
  const updateAvatarPos = useCallback((pos) => {
    avatarPosRef.current = pos;
    dispatch({ type: GAME_ACTIONS.UPDATE_AVATAR_POS, payload: pos });
  }, []);

  /** Called by the canvas loop when avatar is within `arrivalThreshold` of target */
  const arriveAtField = useCallback((fieldId) => {
    dispatch({ type: GAME_ACTIONS.ARRIVE_AT_FIELD, payload: fieldId });
  }, []);

  /** Phase 1 of harvest — fires the retro loading flash */
  const startHarvest = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.START_HARVEST });
  }, []);

  /** Phase 2 — opens overlay + triggers petal particle burst */
  const completeHarvest = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.COMPLETE_HARVEST });
  }, []);

  /** Consumer calls this to acknowledge the particle burst was consumed */
  const resetParticle = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.RESET_PARTICLE });
  }, []);

  /** Close the harvest overlay without moving the avatar */
  const closeOverlay = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.CLOSE_OVERLAY });
  }, []);

  /** Push a new line into the HUD dialogue box */
  const setDialogue = useCallback((text) => {
    dispatch({ type: GAME_ACTIONS.SET_DIALOGUE, payload: text });
  }, []);

  /** Scroll the camera by a delta */
  const panCamera = useCallback((dx, dy) => {
    dispatch({ type: GAME_ACTIONS.PAN_CAMERA, payload: { dx, dy } });
  }, []);

  // ── Memoised context value ────────────────────────────────────────────────
  const value = useMemo(() => ({
    // State slices
    ...state,
    // Mutable ref (safe for canvas loop — no stale closure)
    avatarPosRef,
    // Action creators
    moveAvatarTo,
    updateAvatarPos,
    arriveAtField,
    startHarvest,
    completeHarvest,
    resetParticle,
    closeOverlay,
    setDialogue,
    panCamera,
  }), [
    state,
    moveAvatarTo,
    updateAvatarPos,
    arriveAtField,
    startHarvest,
    completeHarvest,
    resetParticle,
    closeOverlay,
    setDialogue,
    panCamera,
  ]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CUSTOM HOOK
// ─────────────────────────────────────────────────────────────────────────────
/**
 * useGame — consume the full game state and all action creators.
 *
 * @example
 * const { avatarPosition, moveAvatarTo, isHarvested } = useGame();
 */
export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used inside <GameProvider>');
  }
  return ctx;
}
