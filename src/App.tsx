import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from './components/Experience';
import './App.css';

function App() {
  const [showCollider, setShowCollider] = useState(false);

  return (
    <>
      <div className="hud">
        <button
          type="button"
          onClick={() => setShowCollider((current) => !current)}
          className="hud-button"
        >
          {showCollider ? 'Hide wireframe' : 'Show wireframe'}
        </button>
      </div>

      <Canvas>
        <Experience showCollider={showCollider} />
      </Canvas>
    </>
  );
}

export default App;