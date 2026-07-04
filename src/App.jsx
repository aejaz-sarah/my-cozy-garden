/**
 * App.jsx — My Cozy Garden
 * Root application shell. Wraps everything in <GameProvider> and
 * renders <MainStage /> as the sole full-screen experience.
 */
import './index.css';
import { GameProvider } from './context/GameContext';
import MainStage from './components/MainStage';

export default function App() {
  return (
    <GameProvider>
      <MainStage />
    </GameProvider>
  );
}
