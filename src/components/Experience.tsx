import { useCallback, useRef } from 'react';
import type { ObjectBaseHandle } from './objects/ObjectBase';
import User from './User';
import { type StudioHandle } from './scenes/Studio';
import Studio from './scenes/Studio';

/**
 * 
 * Root of the 3D experience, responsible for setting up the scene, camera/User, and rendering loop.
 * 
 * @returns 
 */

interface ExperienceProps {
  showCollider?: boolean;
}

export default function Experience({ showCollider = false }: ExperienceProps) {
  const studioRef = useRef<StudioHandle>(null);

  const getScanTargets = useCallback((): ObjectBaseHandle[] => {
    return studioRef.current?.getObjectHandles() ?? [];
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <Studio ref={studioRef} showCollider={showCollider} />
      <User getScanTargets={getScanTargets} />
    </>
  );
}