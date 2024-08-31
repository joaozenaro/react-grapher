import { useState } from 'react';
import { Shape } from '../models/Shape';
import { Rectangle } from '../models/Rectangle';

interface ShapeManagerProps {
    shapes: Shape[];
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
    selectedShapeId: number | null;
}

// TODO: Implement selected shape
export default function ShapeManager({
    shapes,
    setShapes,
    selectedShapeId,
}: ShapeManagerProps) {
    const [nextShapeId, setNextShapeId] = useState(1);

    const addShape = () => {
        setShapes([
            ...shapes,
            new Rectangle(nextShapeId, `Shape ${nextShapeId}`, 0, 0, 50, 50, {
                hasFill: true,
                fillColor: '#000000',
                hasBorder: false,
            }),
        ]);
        setNextShapeId(nextShapeId + 1);
    };

    const removeShape = (shapeId: number) => {
        setShapes(shapes.filter((shape) => shape.id !== shapeId));
    };

    const addVertex = (shapeId: number) => {
        setShapes(
            shapes.map((shape) => {
                if (shape.id === shapeId) {
                    shape.vertices.push({ x: 0, y: 0 });
                }
                return shape;
            })
        );
    };

    const removeVertex = (shapeId: number, vertexIndex: number) => {
        setShapes(
            shapes.map((shape) => {
                if (shape.id === shapeId) {
                    shape.vertices = shape.vertices.filter(
                        (_, index) => index !== vertexIndex
                    );
                }
                return shape;
            })
        );
    };

    const updateVertex = (
        shapeId: number,
        vertexIndex: number,
        key: 'x' | 'y',
        value: string
    ) => {
        if (!/^-?\d*$/.test(value)) return false;

        setShapes(
            shapes.map((shape) => {
                if (shape.id === shapeId) {
                    const newVertices = [...shape.vertices];
                    newVertices[vertexIndex] = {
                        ...newVertices[vertexIndex],
                        [key]: value,
                    };
                    shape.vertices = newVertices;
                    return shape;
                }
                return shape;
            })
        );
    };

    const updateShape = (
        shapeId: number,
        name?: string,
        borderWidth?: string,
        borderColor?: string,
        fillColor?: string
    ) => {
        setShapes(
            shapes.map((shape) => {
                if (shape.id === shapeId) {
                    if (name) shape.name = name;
                    if (borderWidth) {
                        shape.styles.borderWidth = !isNaN(Number(borderWidth))
                            ? Number(borderWidth)
                            : 0;
                    }
                    if (borderColor) shape.styles.borderColor = borderColor;
                    if (fillColor) shape.styles.fillColor = fillColor;
                    return shape;
                }
                return shape;
            })
        );
    };

    const toggleShapeStyle = (shapeId: number, type: 'fill' | 'border') => {
        setShapes(
            shapes.map((shape) => {
                if (shape.id === shapeId) {
                    if (type === 'fill') {
                        shape.styles.hasFill = !shape.styles.hasFill;
                    } else if (type === 'border') {
                        shape.styles.hasBorder = !shape.styles.hasBorder;
                    }
                    return shape;
                }
                return shape;
            })
        );
    };

    const editShape = (shapeId: number) => {
        setShapes(
            shapes.map((shape) => {
                if (shape.id === shapeId) {
                    shape.editing = !shape.editing;
                    return shape;
                }
                return shape;
            })
        );
    };

    return (
        <div className="p-4 overflow-y-auto h-full">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Shapes</h1>
                <button onClick={addShape} className="btn btn-success">
                    <span>Add Shape</span>
                </button>
            </div>
            <div className="flex gap-4 flex-col mt-4">
                {shapes.map((shape) => (
                    <div key={shape.id}>
                        <div
                            className={`card border-2 ${shape.id === selectedShapeId ? 'border-primary' : 'border-base-content'} bg-base-100 shadow-xl`}
                        >
                            <div className="card-body">
                                <div className="grid grid-cols-3">
                                    <input
                                        type="text"
                                        className="input input-ghost col-span-2"
                                        value={shape.name}
                                        onChange={(e) =>
                                            updateShape(
                                                shape.id,
                                                e.target.value
                                            )
                                        }
                                    />

                                    {/* <div> // TODO: Implement moving shapes like layers
                                        <button>
                                            <svg
                                                fill="none"
                                                strokeWidth={1.5}
                                                className="h-8 w-8"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                                />
                                            </svg>
                                        </button>
                                        <button>
                                            <svg
                                                fill="none"
                                                strokeWidth={1.5}
                                                className="h-8 w-8"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                                />
                                            </svg>
                                        </button>
                                    </div> */}

                                    {!shape.editing ? (
                                        <button
                                            className="btn btn-info"
                                            onClick={() => editShape(shape.id)}
                                        >
                                            <span>Edit</span>
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-error"
                                            onClick={() =>
                                                removeShape(shape.id)
                                            }
                                        >
                                            <span>Delete</span>
                                        </button>
                                    )}
                                </div>

                                {shape.editing && (
                                    <div>
                                        <label className="label cursor-pointer">
                                            <span className="label-text">
                                                Fill
                                            </span>
                                            <input
                                                type="checkbox"
                                                checked={shape.styles.hasFill}
                                                onChange={() =>
                                                    toggleShapeStyle(
                                                        shape.id,
                                                        'fill'
                                                    )
                                                }
                                                className="checkbox"
                                            />
                                        </label>
                                        {shape.styles.hasFill && (
                                            <div className="join grid grid-cols-2">
                                                <input
                                                    type="color"
                                                    className="w-full input input-bordered join-item"
                                                    value={
                                                        shape.styles
                                                            .fillColor ??
                                                        '#000000'
                                                    }
                                                    onChange={(e) =>
                                                        updateShape(
                                                            shape.id,
                                                            undefined,
                                                            undefined,
                                                            undefined,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}

                                        <label className="label cursor-pointer">
                                            <span className="label-text">
                                                Border
                                            </span>
                                            <input
                                                type="checkbox"
                                                checked={shape.styles.hasBorder}
                                                onChange={() =>
                                                    toggleShapeStyle(
                                                        shape.id,
                                                        'border'
                                                    )
                                                }
                                                className="checkbox"
                                            />
                                        </label>

                                        {shape.styles.hasBorder && (
                                            <div className="join grid grid-cols-2">
                                                <input
                                                    type="color"
                                                    className="w-full input input-bordered join-item"
                                                    value={
                                                        shape.styles
                                                            .borderColor ??
                                                        '#000000'
                                                    }
                                                    onChange={(e) =>
                                                        updateShape(
                                                            shape.id,
                                                            undefined,
                                                            undefined,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <input
                                                    placeholder="Width"
                                                    type="text"
                                                    className="input input-bordered join-item"
                                                    value={
                                                        shape.styles
                                                            .borderWidth ?? ''
                                                    }
                                                    onChange={(e) =>
                                                        updateShape(
                                                            shape.id,
                                                            undefined,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-y-2 py-2">
                                            {shape.vertices.map(
                                                (vertex, index) => (
                                                    <div
                                                        key={index}
                                                        className="join grid grid-cols-3"
                                                    >
                                                        <input
                                                            className="input input-bordered join-item"
                                                            type="text"
                                                            value={vertex.x}
                                                            onChange={(e) =>
                                                                updateVertex(
                                                                    shape.id,
                                                                    index,
                                                                    'x',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="X"
                                                        />
                                                        <input
                                                            className="input input-bordered join-item"
                                                            type="text"
                                                            value={vertex.y}
                                                            onChange={(e) =>
                                                                updateVertex(
                                                                    shape.id,
                                                                    index,
                                                                    'y',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Y"
                                                        />
                                                        <button
                                                            className="btn btn-outline btn-error join-item"
                                                            onClick={() =>
                                                                removeVertex(
                                                                    shape.id,
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <div className="flex justify-between">
                                            <button
                                                onClick={() =>
                                                    addVertex(shape.id)
                                                }
                                                className="btn btn-success"
                                            >
                                                <span>Add Vertex</span>
                                            </button>

                                            <button
                                                onClick={() =>
                                                    editShape(shape.id)
                                                }
                                                className="btn btn-info"
                                            >
                                                <span>Done</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
