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
		/>
	);
});

export default Chair;
