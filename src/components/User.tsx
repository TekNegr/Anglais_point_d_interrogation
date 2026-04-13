import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box3, Mesh, Raycaster, Vector3 } from 'three';
import type { ObjectBaseHandle } from './objects/ObjectBase';

interface UserProps {
  getScanTargets: () => ObjectBaseHandle[];
}

const MOVE_SPEED = 4.8;
const FLY_SPEED = 8;
const FLY_VERTICAL_SPEED = 6;
const GRAVITY = 19;
const JUMP_SPEED = 6.2;
const PLAYER_HEIGHT = 1.75;
const PLAYER_RADIUS = 0.35;
const EYE_HEIGHT = 1.6;
const STEP_TOLERANCE = 0.22;
const LAND_SNAP_RANGE = 0.12;
const DOUBLE_JUMP_TOGGLE_MS = 260;

export default function User({ getScanTargets }: UserProps) {
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new Raycaster(), []);

  const positionRef = useRef(new Vector3(0, 0.05, 2.2));
  const velocityYRef = useRef(0);
  const groundedRef = useRef(false);
  const flyModeRef = useRef(false);
  const lastJumpTapRef = useRef(0);
  const yawRef = useRef(Math.PI);
  const pitchRef = useRef(0);

  const keysRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    descend: false,
  });

  const forwardRef = useRef(new Vector3());
  const rightRef = useRef(new Vector3());

  const tempBox = useMemo(() => new Box3(), []);
  const tempClosest = useMemo(() => new Vector3(), []);
  const tempDirection = useMemo(() => new Vector3(), []);
  const tempOrigin = useMemo(() => new Vector3(), []);
  const moveRef = useRef(new Vector3());
  const groundProbeRef = useRef(new Vector3());
  const downRef = useRef(new Vector3(0, -1, 0));

  const emitPulse = () => {
    const targets = getScanTargets();
    if (targets.length === 0) {
      return;
    }

    const colliderEntries = targets
      .map((target) => {
        const mesh = target.getColliderMesh();
        return mesh ? { mesh, target } : null;
      })
      .filter((entry): entry is { mesh: Mesh; target: ObjectBaseHandle } => Boolean(entry));

    if (colliderEntries.length === 0) {
      return;
    }

    const meshList = colliderEntries.map(({ mesh }) => mesh);
    const meshToTarget = new Map(colliderEntries.map(({ mesh, target }) => [mesh.uuid, target]));

    const rayCount = 1400;
    const range = 26;
    let hits = 0;

    tempOrigin.copy(positionRef.current).setY(positionRef.current.y + EYE_HEIGHT * 0.75);
    raycaster.far = range;

    for (let i = 0; i < rayCount; i += 1) {
      const u = Math.random() * 2 - 1;
      const theta = Math.random() * Math.PI * 2;
      const radial = Math.sqrt(1 - u * u);

      tempDirection.set(radial * Math.cos(theta), u, radial * Math.sin(theta));
      raycaster.set(tempOrigin, tempDirection);

      const intersections = raycaster.intersectObjects(meshList, false);
      if (intersections.length === 0) {
        continue;
      }

      const firstHit = intersections[0];
      const target = meshToTarget.get(firstHit.object.uuid);
      if (!target) {
        continue;
      }

      target.addHitPointWorld(firstHit.point);
      hits += 1;
    }

    if (hits === 0) {
      return;
    }
  };

  useEffect(() => {
    const canvas = gl.domElement;

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'w' || key === 'z') keysRef.current.forward = true;
      if (key === 's') keysRef.current.backward = true;
      if (key === 'a' || key === 'q') keysRef.current.left = true;
      if (key === 'd') keysRef.current.right = true;
      if (key === ' ') {
        if (!event.repeat) {
          const now = performance.now();
          if (now - lastJumpTapRef.current <= DOUBLE_JUMP_TOGGLE_MS) {
            flyModeRef.current = !flyModeRef.current;
            velocityYRef.current = 0;
            groundedRef.current = false;
          }
          lastJumpTapRef.current = now;
        }
        keysRef.current.jump = true;
      }
      if (key === 'shift') keysRef.current.descend = true;
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'w' || key === 'z') keysRef.current.forward = false;
      if (key === 's') keysRef.current.backward = false;
      if (key === 'a' || key === 'q') keysRef.current.left = false;
      if (key === 'd') keysRef.current.right = false;
      if (key === ' ') keysRef.current.jump = false;
      if (key === 'shift') keysRef.current.descend = false;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== canvas) {
        return;
      }

      const sensitivity = 0.0022;
      yawRef.current -= event.movementX * sensitivity;
      pitchRef.current -= event.movementY * sensitivity;
      pitchRef.current = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, pitchRef.current));
    };

    const onMouseDown = (event: MouseEvent) => {
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
        return;
      }

      if (event.button === 0) {
        emitPulse();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
    };
  }, [gl, getScanTargets]);

  useFrame((_, delta) => {
    const dt = Math.min(0.033, delta);
    const position = positionRef.current;

    const scanTargets = getScanTargets();
    const colliderMeshes = scanTargets
      .map((target) => target.getColliderMesh())
      .filter((mesh): mesh is Mesh => Boolean(mesh));

    forwardRef.current.set(-Math.sin(yawRef.current), 0, -Math.cos(yawRef.current));
    rightRef.current.set(Math.cos(yawRef.current), 0, -Math.sin(yawRef.current));

    const move = moveRef.current;
    move.set(0, 0, 0);
    if (keysRef.current.forward) move.add(forwardRef.current);
    if (keysRef.current.backward) move.sub(forwardRef.current);
    if (keysRef.current.right) move.add(rightRef.current);
    if (keysRef.current.left) move.sub(rightRef.current);

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar((flyModeRef.current ? FLY_SPEED : MOVE_SPEED) * dt);
    }

    let candidateX = position.x + move.x;
    let candidateZ = position.z + move.z;
    let candidateY = position.y;

    if (flyModeRef.current) {
      if (keysRef.current.jump) {
        candidateY += FLY_VERTICAL_SPEED * dt;
      }
      if (keysRef.current.descend) {
        candidateY -= FLY_VERTICAL_SPEED * dt;
      }

      velocityYRef.current = 0;
      groundedRef.current = false;
      position.set(candidateX, candidateY, candidateZ);

      camera.position.set(position.x, position.y + EYE_HEIGHT, position.z);
      camera.rotation.set(pitchRef.current, yawRef.current, 0, 'YXZ');
      return;
    }

    velocityYRef.current -= GRAVITY * dt;
    if (groundedRef.current && keysRef.current.jump) {
      velocityYRef.current = JUMP_SPEED;
      groundedRef.current = false;
    }
    candidateY += velocityYRef.current * dt;

    const playerMinY = candidateY;
    const playerMaxY = candidateY + PLAYER_HEIGHT;

    // Flat-bottom cylinder behavior: prioritize landing on top surfaces.
    let snappedTopY = Number.NEGATIVE_INFINITY;
    let snappedOnTop = false;

    for (const collider of colliderMeshes) {
      tempBox.setFromObject(collider);

      const nearTop =
        velocityYRef.current <= 0 &&
        candidateY >= tempBox.max.y - STEP_TOLERANCE &&
        candidateY <= tempBox.max.y + LAND_SNAP_RANGE;

      const insideTopFootprint =
        candidateX >= tempBox.min.x - PLAYER_RADIUS &&
        candidateX <= tempBox.max.x + PLAYER_RADIUS &&
        candidateZ >= tempBox.min.z - PLAYER_RADIUS &&
        candidateZ <= tempBox.max.z + PLAYER_RADIUS;

      if (nearTop && insideTopFootprint) {
        snappedOnTop = true;
        snappedTopY = Math.max(snappedTopY, tempBox.max.y);
        continue;
      }

      const overlapY = !(playerMaxY < tempBox.min.y || playerMinY > tempBox.max.y);
      if (!overlapY) {
        continue;
      }

      tempClosest.set(
        Math.max(tempBox.min.x, Math.min(candidateX, tempBox.max.x)),
        0,
        Math.max(tempBox.min.z, Math.min(candidateZ, tempBox.max.z)),
      );

      const dx = candidateX - tempClosest.x;
      const dz = candidateZ - tempClosest.z;
      const distSq = dx * dx + dz * dz;

      if (distSq >= PLAYER_RADIUS * PLAYER_RADIUS) {
        continue;
      }

      const dist = Math.sqrt(distSq);
      if (dist > 0.0001) {
        const push = (PLAYER_RADIUS - dist) + 0.001;
        candidateX += (dx / dist) * push;
        candidateZ += (dz / dist) * push;
      } else {
        candidateX += PLAYER_RADIUS;
      }
    }

    let grounded = false;
    if (snappedOnTop) {
      candidateY = snappedTopY;
      velocityYRef.current = 0;
      grounded = true;
    } else {
      groundProbeRef.current.set(candidateX, candidateY + PLAYER_HEIGHT, candidateZ);
      raycaster.set(groundProbeRef.current, downRef.current);
      raycaster.far = PLAYER_HEIGHT + 1.5;

      const groundHits = raycaster.intersectObjects(colliderMeshes, false);
      if (groundHits.length > 0) {
        const nearest = groundHits[0];
        const groundY = groundProbeRef.current.y - nearest.distance;
        if (candidateY <= groundY + 0.03 && velocityYRef.current <= 0) {
          candidateY = groundY;
          velocityYRef.current = 0;
          grounded = true;
        }
      }
    }

    groundedRef.current = grounded;
    position.set(candidateX, candidateY, candidateZ);

    camera.position.set(position.x, position.y + EYE_HEIGHT, position.z);
    camera.rotation.set(pitchRef.current, yawRef.current, 0, 'YXZ');
  });

  return null;
}