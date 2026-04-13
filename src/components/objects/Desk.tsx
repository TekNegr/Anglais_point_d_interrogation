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
		/>
	);
});

export default Desk;
