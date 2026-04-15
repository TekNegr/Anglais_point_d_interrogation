import { forwardRef } from 'react';
import ObjectBase, { type ObjectBaseHandle } from './ObjectBase';

interface TrashpileProps {
	position?: [number, number, number];
	rotation?: [number, number, number];
	showCollider?: boolean;
}

const Trashpile = forwardRef<ObjectBaseHandle, TrashpileProps>(function Trashpile(
	{ position = [0, 0.25, 0], rotation = [0, 0, 0], showCollider = false },
	ref,
) {
	return (
		<ObjectBase
			ref={ref}
			position={position}
			rotation={rotation}
			boxArgs={[0.95, 0.55, 0.95]}
			showCollider={showCollider}
			pointSize={0.018}
			children={
				<group>
					<mesh position={[0, 0.05, 0]} castShadow receiveShadow>
						<sphereGeometry args={[0.42, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
						<meshStandardMaterial color="#8f6f53" roughness={1} />
					</mesh>
					<mesh position={[-0.18, 0.12, 0.16]} rotation={[0.15, -0.1, 0.2]} castShadow receiveShadow>
						<sphereGeometry args={[0.12, 12, 10]} />
						<meshStandardMaterial color="#a58a68" roughness={1} />
					</mesh>
					<mesh position={[0.16, 0.16, -0.1]} rotation={[-0.2, 0.05, -0.15]} castShadow receiveShadow>
						<sphereGeometry args={[0.1, 12, 10]} />
						<meshStandardMaterial color="#7c624b" roughness={1} />
					</mesh>
				</group>
			}
		/>
	);
});

export default Trashpile;