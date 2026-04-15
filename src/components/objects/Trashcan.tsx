import { forwardRef } from 'react';
import ObjectBase, { type ObjectBaseHandle } from './ObjectBase';

interface TrashcanProps {
	position?: [number, number, number];
	rotation?: [number, number, number];
	showCollider?: boolean;
}

const Trashcan = forwardRef<ObjectBaseHandle, TrashcanProps>(function Trashcan(
	{ position = [0, 0.45, 0], rotation = [0, 0, 0], showCollider = false },
	ref,
) {
	return (
		<ObjectBase
			ref={ref}
			position={position}
			rotation={rotation}
			boxArgs={[0.62, 1.1, 0.62]}
			showCollider={showCollider}
			pointSize={0.02}
			children={
				<group>
					<mesh position={[0, 0, 0]} castShadow receiveShadow>
						<cylinderGeometry args={[0.28, 0.34, 0.9, 16]} />
						<meshStandardMaterial color="#4b5563" roughness={0.88} metalness={0.08} />
					</mesh>
					<mesh position={[0, 0.52, 0]} castShadow receiveShadow>
						<cylinderGeometry args={[0.31, 0.28, 0.08, 16]} />
						<meshStandardMaterial color="#374151" roughness={0.85} metalness={0.08} />
					</mesh>
				</group>
			}
		/>
	);
});

export default Trashcan;