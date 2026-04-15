import { forwardRef } from 'react';
import ObjectBase, { type ObjectBaseHandle } from './ObjectBase';

interface FenceProps {
	position?: [number, number, number];
	rotation?: [number, number, number];
	showCollider?: boolean;
}

const Fence = forwardRef<ObjectBaseHandle, FenceProps>(function Fence(
	{ position = [0, 0.45, 0], rotation = [0, 0, 0], showCollider = false },
	ref,
) {
	return (
		<ObjectBase
			ref={ref}
			position={position}
			rotation={rotation}
			boxArgs={[2.0, 0.9, 0.16]}
			showCollider={showCollider}
			pointSize={0.018}
			children={
				<group>
					{[
						-0.9,
						-0.3,
						0.3,
						0.9,
					].map((x, index) => (
						<mesh key={index} position={[x, 0, 0]} castShadow receiveShadow>
							<boxGeometry args={[0.1, 0.9, 0.1]} />
							<meshStandardMaterial color="#8b7355" roughness={0.9} />
						</mesh>
					))}
					<mesh position={[0, 0.22, 0]} castShadow receiveShadow>
						<boxGeometry args={[1.9, 0.08, 0.08]} />
						<meshStandardMaterial color="#9c8666" roughness={0.9} />
					</mesh>
					<mesh position={[0, -0.08, 0]} castShadow receiveShadow>
						<boxGeometry args={[1.9, 0.08, 0.08]} />
						<meshStandardMaterial color="#9c8666" roughness={0.9} />
					</mesh>
				</group>
			}
		/>
	);
});

export default Fence;