import { useState } from 'react';
import { Shape } from '../models/Shape';
import { Rectangle } from '../models/Rectangle';

interface ShapeManagerProps {
    shapes: Shape[];
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
}

export default function ShapeManager({ shapes, setShapes }: ShapeManagerProps) {
    const [nextShapeId, setNextShapeId] = useState(1);
    const [hasFill, setHasFill] = useState(false);
    const [hasBorder, setHasBorder] = useState(false);

    const addShape = () => {
        setShapes([
            ...shapes,
            new Rectangle(nextShapeId, `Shape ${nextShapeId}`, 0, 0, 50, 50, {
                fillColor: '#000000',
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

    return (
        <div className="p-4 overflow-y-auto h-full">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Shapes</h1>
                <button onClick={addShape} className="btn btn-success">
                    <span>Add Shape</span>
                </button>
            </div>
            <div className="flex gap-4 flex-col">
                {shapes.map((shape) => (
                    <div key={shape.id}>
                        <div className="card bg-base-100 shadow-xl">
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
                                    <button
                                        className="btn btn-error"
                                        onClick={() => removeShape(shape.id)}
                                    >
                                        <span>Delete</span>
                                    </button>
                                </div>

                                <label className="label cursor-pointer">
                                    <span className="label-text">Fill</span>
                                    <input
                                        type="checkbox"
                                        checked={hasFill}
                                        onChange={() => setHasFill(!hasFill)}
                                        className="checkbox"
                                    />
                                </label>
                                {hasFill && (
                                    <div className="join grid grid-cols-2">
                                        <input
                                            type="color"
                                            className="w-full input input-bordered join-item"
                                            value={
                                                shape.styles.fillColor ??
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
                                    <span className="label-text">Border</span>
                                    <input
                                        type="checkbox"
                                        checked={hasBorder}
                                        onChange={() =>
                                            setHasBorder(!hasBorder)
                                        }
                                        className="checkbox"
                                    />
                                </label>
                                {hasBorder && (
                                    <div className="join grid grid-cols-2">
                                        <input
                                            type="color"
                                            className="w-full input input-bordered join-item"
                                            value={
                                                shape.styles.borderColor ??
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
                                                shape.styles.borderWidth ?? ''
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
                                {shape.vertices.map((vertex, index) => (
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
                                                    e.target.value
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
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Y"
                                        />
                                        <button
                                            className="btn btn-outline btn-error join-item"
                                            onClick={() =>
                                                removeVertex(shape.id, index)
                                            }
                                        >
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addVertex(shape.id)}
                                    className="btn btn-success"
                                >
                                    <span>Add Vertex</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
