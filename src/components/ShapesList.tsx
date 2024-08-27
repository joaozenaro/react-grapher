import { ObjectManager } from '../models/ObjectManager';

type ShapesListProps = {
    objectManager: ObjectManager;
    handleMoveShape: (id: number, direction: 'up' | 'down') => void;
    handleDeleteShape: (id: number) => void;
};

export default function ShapesList({
    objectManager,
    handleMoveShape,
    handleDeleteShape,
}: ShapesListProps) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Color</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {objectManager.shapes.map((shape, index) => (
                    <tr key={shape.id}>
                        <td>{shape.constructor.name}</td>
                        <td>
                            <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: shape.color }}
                            />
                        </td>
                        <td>
                            <div className="space-x-2">
                                <button
                                    onClick={() =>
                                        handleMoveShape(shape.id, 'up')
                                    }
                                    disabled={index === 0}
                                >
                                    Up
                                </button>
                                <button
                                    onClick={() =>
                                        handleMoveShape(shape.id, 'down')
                                    }
                                    disabled={
                                        index ===
                                        objectManager.shapes.length - 1
                                    }
                                >
                                    Down
                                </button>
                                <button
                                    onClick={() => handleDeleteShape(shape.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
