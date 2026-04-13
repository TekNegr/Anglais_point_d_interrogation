import { forwardRef, useImperativeHandle, useMemo, useRef, type ReactNode } from 'react';
import {
	BufferGeometry,
	Camera,
	Float32BufferAttribute,
	Mesh,
	Points,
	Raycaster,
	Vector2,
	Vector3,
} from 'three';

export interface ScanOptions {
	rayCount?: number;
	spread?: number;
}

export interface ObjectBaseHandle {
	scanFromCamera: (camera: Camera, pointerNdc: Vector2, options?: ScanOptions) => number;
	addHitPointWorld: (worldPoint: Vector3) => void;
	getColliderMesh: () => Mesh | null;
	clearScanPoints: () => void;
}

interface ObjectBaseProps {
	position?: [number, number, number];
	rotation?: [number, number, number];
	scale?: [number, number, number];
	color?: string;
	boxArgs?: [number, number, number];
	maxPoints?: number;
	pointColor?: string;
	pointSize?: number;
	showCollider?: boolean;
	geometryNode?: ReactNode;
}

/**
 * Scannable base object. Its render mesh acts as an invisible collider by default,
 * and accumulates raycast hit points to reveal geometry.
 */
const ObjectBase = forwardRef<ObjectBaseHandle, ObjectBaseProps>(function ObjectBase(
	{
		position = [0, 0, 0],
		rotation = [0, 0, 0],
		scale = [1, 1, 1],
		color = '#ff6600',
		boxArgs = [1, 1, 1],
		maxPoints = 30000,
		pointColor = '#7dd3fc',
		pointSize = 0.03,
		showCollider = false,
		geometryNode,
	},
	ref,
) {
	const meshRef = useRef<Mesh>(null);
	const pointsRef = useRef<Points>(null);
	const positionsRef = useRef<number[]>([]);

	const raycaster = useMemo(() => new Raycaster(), []);
	const tempPointer = useMemo(() => new Vector2(), []);

	const updateGeometry = () => {
		if (!pointsRef.current) {
			return;
		}

		const geometry = pointsRef.current.geometry as BufferGeometry;
		geometry.setAttribute('position', new Float32BufferAttribute(positionsRef.current, 3));
		geometry.computeBoundingSphere();
	};

	const trimBuffersIfNeeded = () => {
		const overflow = positionsRef.current.length - maxPoints * 3;
		if (overflow <= 0) {
			return;
		}

		positionsRef.current.splice(0, overflow);
	};

	const addHitPointWorld = (worldPoint: Vector3) => {
		if (!meshRef.current) {
			return;
		}

		const localPoint = meshRef.current.worldToLocal(worldPoint.clone());

		positionsRef.current.push(localPoint.x, localPoint.y, localPoint.z);
		trimBuffersIfNeeded();
		updateGeometry();
	};

	const clearScanPoints = () => {
		positionsRef.current.length = 0;
		updateGeometry();
	};

	const scanFromCamera = (camera: Camera, pointerNdc: Vector2, options?: ScanOptions) => {
		if (!meshRef.current) {
			return 0;
		}

		const rayCount = options?.rayCount ?? 80;
		const spread = options?.spread ?? 0.03;
		let hitCount = 0;

		for (let i = 0; i < rayCount; i += 1) {
			tempPointer.set(
				pointerNdc.x + (Math.random() - 0.5) * spread,
				pointerNdc.y + (Math.random() - 0.5) * spread,
			);

			raycaster.setFromCamera(tempPointer, camera);
			const intersects = raycaster.intersectObject(meshRef.current, false);

			if (intersects.length === 0) {
				continue;
			}

			addHitPointWorld(intersects[0].point);
			hitCount += 1;
		}

		return hitCount;
	};

	useImperativeHandle(
		ref,
		() => ({
			scanFromCamera,
			addHitPointWorld,
			getColliderMesh: () => meshRef.current,
			clearScanPoints,
		}),
		[scanFromCamera],
	);

	return (
		<mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
			{geometryNode ?? <boxGeometry args={boxArgs} />}
			<meshStandardMaterial
				color={color}
				wireframe={showCollider}
				transparent
				opacity={showCollider ? 0.25 : 0}
				colorWrite={showCollider}
				depthWrite={showCollider}
			/>

			<points ref={pointsRef}>
				<bufferGeometry />
				<pointsMaterial color={pointColor} size={pointSize} sizeAttenuation depthWrite={false} />
			</points>
		</mesh>
	);
});

export default ObjectBase;