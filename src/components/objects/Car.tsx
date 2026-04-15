import { forwardRef } from 'react';
import ObjectBase, { type ObjectBaseHandle } from './ObjectBase';

interface CarProps {
	position?: [number, number, number];
	rotation?: [number, number, number];
	showCollider?: boolean;
}

const Car = forwardRef<ObjectBaseHandle, CarProps>(function Car(
	{ position = [0, 0.45, 0], rotation = [0, 0, 0], showCollider = false },
	ref,
) {
	return (
		<ObjectBase
			ref={ref}
			position={position}
			rotation={rotation}
			boxArgs={[1.9, 0.8, 1.0]}
			showCollider={showCollider}
			pointSize={0.02}
			children={
				<group>
					<mesh position={[0, -0.02, 0]} castShadow receiveShadow>
						<boxGeometry args={[1.8, 0.45, 0.95]} />
						<meshStandardMaterial color="#a12d2f" roughness={0.75} metalness={0.1} />
					</mesh>
					<mesh position={[0.05, 0.3, 0]} castShadow receiveShadow>
						<boxGeometry args={[1.0, 0.35, 0.85]} />
						<meshStandardMaterial color="#cc4b37" roughness={0.7} metalness={0.1} />
					</mesh>
					{[
						[-0.62, -0.38, -0.42],
						[0.62, -0.38, -0.42],
						[-0.62, -0.38, 0.42],
						[0.62, -0.38, 0.42],
					].map(([x, y, z], index) => (
						<mesh key={index} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
							<cylinderGeometry args={[0.18, 0.18, 0.12, 12]} />
							<meshStandardMaterial color="#222222" roughness={1} />
						</mesh>
					))}
					<mesh position={[-0.72, 0.05, 0.48]} castShadow receiveShadow>
						<sphereGeometry args={[0.07, 10, 8]} />
						<meshStandardMaterial color="#dce7f2" roughness={0.2} />
					</mesh>
					<mesh position={[0.72, 0.05, 0.48]} castShadow receiveShadow>
						<sphereGeometry args={[0.07, 10, 8]} />
						<meshStandardMaterial color="#dce7f2" roughness={0.2} />
					</mesh>
				</group>
			}
		/>
	);
});

export default Car;