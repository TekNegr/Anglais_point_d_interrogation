import { forwardRef } from 'react';
import ObjectBase, { type ObjectBaseHandle } from './ObjectBase';

interface ChairProps {
	position?: [number, number, number];
	rotation?: [number, number, number];
	showCollider?: boolean;
}

const Chair = forwardRef<ObjectBaseHandle, ChairProps>(function Chair(
	{ position = [0, 0.45, 0], rotation = [0, 0, 0], showCollider = false },
	ref,
) {
	return (
		<ObjectBase
			ref={ref}
			position={position}
			rotation={rotation}
			boxArgs={[0.55, 0.9, 0.55]}
			showCollider={showCollider}
			pointSize={0.022}
			children={
				<group>
					<mesh position={[0, 0.02, 0]} castShadow receiveShadow>
						<boxGeometry args={[0.52, 0.08, 0.5]} />
						<meshStandardMaterial color="#b08968" roughness={0.95} />
					</mesh>
					<mesh position={[0, 0.42, -0.2]} castShadow receiveShadow>
						<boxGeometry args={[0.52, 0.72, 0.08]} />
						<meshStandardMaterial color="#8b5e34" roughness={0.9} />
					</mesh>
					{[
						[-0.21, -0.38, -0.18],
						[0.21, -0.38, -0.18],
						[-0.21, -0.38, 0.18],
						[0.21, -0.38, 0.18],
					].map(([x, y, z], index) => (
						<mesh key={index} position={[x, y, z]} castShadow receiveShadow>
							<boxGeometry args={[0.06, 0.76, 0.06]} />
							<meshStandardMaterial color="#5c3b22" roughness={0.85} />
						</mesh>
					))}
				</group>
			}
		/>
	);
});

export default Chair;
