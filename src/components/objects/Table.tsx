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
		/>
	);
});

export default Table;
