import { ObjectManager } from '../models/ObjectManager';

type ShapesListProps = {
    objectManager: ObjectManager;
    handleMoveShape: (id: number, direction: 'up' | 'down') => void;
    handleDeleteShape: (id: number) => void;
    handleSelectShape: (id: number) => void;
};

export default function ShapesList({
    objectManager,
    handleMoveShape,
    handleDeleteShape,
    handleSelectShape,
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
                {objectManager.shapes.map((shape) => (
                    <tr
                        key={shape.id}
                        onClick={() => handleSelectShape(shape.id)}
                    >
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoveShape(shape.id, 'up');
                                    }}
                                >
                                    Up
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoveShape(shape.id, 'down');
                                    }}
                                >
                                    Down
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteShape(shape.id);
                                    }}
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
