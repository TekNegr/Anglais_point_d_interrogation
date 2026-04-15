import { forwardRef } from 'react';
import ObjectBase, { type ObjectBaseHandle } from './ObjectBase';

interface TableProps {
	position?: [number, number, number];
	rotation?: [number, number, number];
	showCollider?: boolean;
}

const Table = forwardRef<ObjectBaseHandle, TableProps>(function Table(
	{ position = [0, 0.4, 0], rotation = [0, 0, 0], showCollider = false },
	ref,
) {
	return (
		<ObjectBase
			ref={ref}
			position={position}
			rotation={rotation}
			boxArgs={[1.3, 0.8, 1.3]}
			showCollider={showCollider}
			pointSize={0.022}
			children={
				<group>
					<mesh position={[0, 0.27, 0]} castShadow receiveShadow>
						<boxGeometry args={[1.35, 0.08, 1.35]} />
						<meshStandardMaterial color="#9c7a52" roughness={0.9} />
					</mesh>
					{[
						[-0.54, -0.23, -0.54],
						[0.54, -0.23, -0.54],
						[-0.54, -0.23, 0.54],
						[0.54, -0.23, 0.54],
					].map(([x, y, z], index) => (
						<mesh key={index} position={[x, y, z]} castShadow receiveShadow>
							<boxGeometry args={[0.12, 0.54, 0.12]} />
							<meshStandardMaterial color="#5b4631" roughness={0.85} />
						</mesh>
					))}
				</group>
			}
		/>
	);
});

export default Table;
