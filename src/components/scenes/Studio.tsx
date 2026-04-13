import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Mesh } from 'three';
import Chair from '../objects/Chair';
import Desk from '../objects/Desk';
import ObjectBase, { type ObjectBaseHandle } from '../objects/ObjectBase';
import Table from '../objects/Table';

export interface StudioHandle {
    getObjectHandles: () => ObjectBaseHandle[];
    getColliderMeshes: () => Mesh[];
    clearScanPoints: () => void;
}

interface StudioProps {
    showCollider?: boolean;
}

const Studio = forwardRef<StudioHandle, StudioProps>(function Studio({ showCollider = false }, ref) {
    const floorRef = useRef<ObjectBaseHandle>(null);
    const backWallRef = useRef<ObjectBaseHandle>(null);
    const leftWallRef = useRef<ObjectBaseHandle>(null);
    const rightWallRef = useRef<ObjectBaseHandle>(null);
    const deskRef = useRef<ObjectBaseHandle>(null);
    const chairRef = useRef<ObjectBaseHandle>(null);
    const tableRef = useRef<ObjectBaseHandle>(null);
    const shelfRef = useRef<ObjectBaseHandle>(null);

    const allRefs = [
        floorRef,
        backWallRef,
        leftWallRef,
        rightWallRef,
        deskRef,
        chairRef,
        tableRef,
        shelfRef,
    ];

    const getColliderEntries = () => {
        const colliders = allRefs
            .map((targetRef) => targetRef.current)
            .filter((handle): handle is ObjectBaseHandle => Boolean(handle));

        return colliders
            .map((handle) => {
                const mesh = handle.getColliderMesh();
                return mesh ? { mesh, handle } : null;
            })
            .filter(
                (
                    entry,
                ): entry is {
                    mesh: NonNullable<ReturnType<ObjectBaseHandle['getColliderMesh']>>;
                    handle: ObjectBaseHandle;
                } => Boolean(entry),
            );
    };
    const getObjectHandles = () =>
        allRefs
            .map((targetRef) => targetRef.current)
            .filter((handle): handle is ObjectBaseHandle => Boolean(handle));

    const getColliderMeshes = () => getColliderEntries().map(({ mesh }) => mesh);

    const clearScanPoints = () => {
        for (const targetRef of allRefs) {
            targetRef.current?.clearScanPoints();
        }
    };

    useImperativeHandle(
        ref,
        () => ({
            getObjectHandles,
            getColliderMeshes,
            clearScanPoints,
        }),
        [],
    );

    return (
        <group>
            <ObjectBase
                ref={floorRef}
                position={[0, -0.15, 0]}
                boxArgs={[8, 0.3, 8]}
                showCollider={showCollider}
                pointSize={0.02}
            />
            <ObjectBase
                ref={backWallRef}
                position={[0, 1.5, -4]}
                boxArgs={[8, 3, 0.3]}
                showCollider={showCollider}
                pointSize={0.02}
            />
            <ObjectBase
                ref={leftWallRef}
                position={[-4, 1.5, 0]}
                boxArgs={[0.3, 3, 8]}
                showCollider={showCollider}
                pointSize={0.02}
            />
            <ObjectBase
                ref={rightWallRef}
                position={[4, 1.5, 0]}
                boxArgs={[0.3, 3, 8]}
                showCollider={showCollider}
                pointSize={0.02}
            />

            <Desk ref={deskRef} position={[-1.7, 0.55, -2.2]} showCollider={showCollider} />
            <Chair ref={chairRef} position={[-1.7, 0.45, -1.35]} showCollider={showCollider} />
            <Table ref={tableRef} position={[1.7, 0.4, -1.4]} showCollider={showCollider} />

            {/* Shelf */}
            <ObjectBase
                ref={shelfRef}
                position={[2.9, 1.2, -3.2]}
                boxArgs={[1.1, 2.4, 0.5]}
                showCollider={showCollider}
                pointSize={0.02}
            />
        </group>
    );
});

export default Studio;