import React, { useMemo } from 'react';
import { useShapes } from '../context/useShapes';
import { ListPlus } from 'lucide-react';
import ShapeItem from './ShapeItem';

const ShapeManager = () => {
    const { shapes, selectedShape, setSelectedShape, addShape } = useShapes();

    const memoizedShapes = useMemo(() => shapes, [shapes]);

    return (
        <div className="p-4 overflow-y-auto h-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Shapes
                </h1>
                <button className="btn btn-primary" onClick={() => addShape()}>
                    <ListPlus />
                    Add Shape
                </button>
            </div>
            <div>
                <table className="table">
                    <tbody>
                        {memoizedShapes.map((shape) => (
                            <ShapeItem
                                key={shape.id}
                                shape={shape}
                                onSelect={() => setSelectedShape(shape)}
                                isSelected={selectedShape?.id === shape.id}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default React.memo(ShapeManager);
