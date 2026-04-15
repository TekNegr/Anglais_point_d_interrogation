import { forwardRef } from 'react';
import ObjectBase, { type ObjectBaseHandle } from './ObjectBase';

interface DeskProps {
	position?: [number, number, number];
	rotation?: [number, number, number];
	showCollider?: boolean;
}

const Desk = forwardRef<ObjectBaseHandle, DeskProps>(function Desk(
	{ position = [0, 0.55, 0], rotation = [0, 0, 0], showCollider = false },
	ref,
) {
	return (
		<ObjectBase
			ref={ref}
			position={position}
			rotation={rotation}
			boxArgs={[1.8, 1.1, 0.75]}
			showCollider={showCollider}
			pointSize={0.022}
			children={
				<group>
					<mesh position={[0, 0.34, 0]} castShadow receiveShadow>
						<boxGeometry args={[1.8, 0.08, 0.75]} />
						<meshStandardMaterial color="#8b6b4a" roughness={0.92} />
					</mesh>
					<mesh position={[-0.72, -0.18, 0]} castShadow receiveShadow>
						<boxGeometry args={[0.12, 0.7, 0.12]} />
						<meshStandardMaterial color="#5a4630" roughness={0.88} />
					</mesh>
					<mesh position={[0.72, -0.18, 0]} castShadow receiveShadow>
						<boxGeometry args={[0.12, 0.7, 0.12]} />
						<meshStandardMaterial color="#5a4630" roughness={0.88} />
					</mesh>
					<mesh position={[-0.72, -0.18, -0.26]} castShadow receiveShadow>
						<boxGeometry args={[0.12, 0.7, 0.12]} />
						<meshStandardMaterial color="#5a4630" roughness={0.88} />
					</mesh>
					<mesh position={[0.72, -0.18, -0.26]} castShadow receiveShadow>
						<boxGeometry args={[0.12, 0.7, 0.12]} />
						<meshStandardMaterial color="#5a4630" roughness={0.88} />
					</mesh>
					<mesh position={[0.5, -0.02, 0.18]} castShadow receiveShadow>
						<boxGeometry args={[0.55, 0.28, 0.28]} />
						<meshStandardMaterial color="#6e5538" roughness={0.9} />
					</mesh>
				</group>
			}
		/>
	);
});

export default Desk;
