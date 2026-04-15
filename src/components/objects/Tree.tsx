import { forwardRef } from 'react';
import ObjectBase, { type ObjectBaseHandle } from './ObjectBase';

interface TreeProps {
	position?: [number, number, number];
	rotation?: [number, number, number];
	showCollider?: boolean;
}

const Tree = forwardRef<ObjectBaseHandle, TreeProps>(function Tree(
	{ position = [0, 1.2, 0], rotation = [0, 0, 0], showCollider = false },
	ref,
) {
	return (
		<ObjectBase
			ref={ref}
			position={position}
			rotation={rotation}
			boxArgs={[1.0, 2.4, 1.0]}
			showCollider={showCollider}
			pointSize={0.02}
			children={
				<group>
					<mesh position={[0, -0.55, 0]} castShadow receiveShadow>
						<cylinderGeometry args={[0.14, 0.18, 1.2, 8]} />
						<meshStandardMaterial color="#6b4f2a" roughness={0.95} />
					</mesh>
					<mesh position={[0, 0.45, 0]} castShadow receiveShadow>
						<sphereGeometry args={[0.72, 18, 14]} />
						<meshStandardMaterial color="#3f7d3a" roughness={1} />
					</mesh>
					<mesh position={[-0.22, 0.8, 0.1]} castShadow receiveShadow>
						<sphereGeometry args={[0.26, 12, 10]} />
						<meshStandardMaterial color="#4f8d45" roughness={1} />
					</mesh>
					<mesh position={[0.24, 0.62, -0.16]} castShadow receiveShadow>
						<sphereGeometry args={[0.22, 12, 10]} />
						<meshStandardMaterial color="#4b8a42" roughness={1} />
					</mesh>
				</group>
			}
		/>
	);
});

export default Tree;