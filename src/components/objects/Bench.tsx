import { forwardRef } from 'react';
import ObjectBase, { type ObjectBaseHandle } from './ObjectBase';

interface BenchProps {
	position?: [number, number, number];
	rotation?: [number, number, number];
	showCollider?: boolean;
}

const Bench = forwardRef<ObjectBaseHandle, BenchProps>(function Bench(
	{ position = [0, 0.3, 0], rotation = [0, 0, 0], showCollider = false },
	ref,
) {
	return (
		<ObjectBase
			ref={ref}
			position={position}
			rotation={rotation}
			boxArgs={[1.8, 0.7, 0.55]}
			showCollider={showCollider}
			pointSize={0.02}
			children={
				<group>
					<mesh position={[0, 0.18, 0]} castShadow receiveShadow>
						<boxGeometry args={[1.7, 0.08, 0.44]} />
						<meshStandardMaterial color="#8a6a45" roughness={0.9} />
					</mesh>
					<mesh position={[0, 0.36, -0.16]} castShadow receiveShadow>
						<boxGeometry args={[1.7, 0.22, 0.08]} />
						<meshStandardMaterial color="#7a5d3d" roughness={0.92} />
					</mesh>
					{[
						[-0.72, -0.16, -0.18],
						[0.72, -0.16, -0.18],
						[-0.72, -0.16, 0.18],
						[0.72, -0.16, 0.18],
					].map(([x, y, z], index) => (
						<mesh key={index} position={[x, y, z]} castShadow receiveShadow>
							<boxGeometry args={[0.1, 0.42, 0.1]} />
							<meshStandardMaterial color="#5a4630" roughness={0.85} />
						</mesh>
					))}
				</group>
			}
		/>
	);
});

export default Bench;