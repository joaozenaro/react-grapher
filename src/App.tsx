import { Edit2, Undo2 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

type Point = { x: number; y: number };
type Shape = {
    id: number;
    type: 'line' | 'rectangle' | 'circle' | 'polygon';
    points: Point[];
    strokeColor: string;
    fillColor: string;
    lineWidth: number;
};

type AppState = {
    shapes: Shape[];
    selectedShapeIndex: number | null;
    selectedTool: 'line' | 'rectangle' | 'circle' | 'polygon' | 'move';
    selectedStrokeColor: string;
    selectedFillColor: string;
    selectedLineWidth: number;
    isEditingVertices: boolean;
};

export default function Component() {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [currentShape, setCurrentShape] = useState<Shape | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [selectedTool, setSelectedTool] =
        useState<AppState['selectedTool']>('line');
    const [selectedStrokeColor, setSelectedStrokeColor] = useState('#000000');
    const [selectedFillColor, setSelectedFillColor] = useState('transparent');
    const [selectedLineWidth, setSelectedLineWidth] = useState(2);
    const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(
        null
    );
    const [isEditingVertices, setIsEditingVertices] = useState(false);
    const [selectedVertexIndex, setSelectedVertexIndex] = useState<
        number | null
    >(null);
    const [history, setHistory] = useState<AppState[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [movingShape, setMovingShape] = useState<{
        index: number;
        startPoint: Point;
    } | null>(null);

    useEffect(() => {
        drawShapes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        shapes,
        currentShape,
        selectedShapeIndex,
        movingShape,
        isEditingVertices,
        selectedVertexIndex,
    ]);

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const point = getMousePos(e);
        if (isEditingVertices && selectedShapeIndex !== null) {
            const shape = shapes[selectedShapeIndex];
            const vertexIndex = shape.points.findIndex(
                (p) =>
                    Math.abs(p.x - point.x) < 5 && Math.abs(p.y - point.y) < 5
            );
            if (vertexIndex !== -1) {
                setSelectedVertexIndex(vertexIndex);
            }
        } else if (selectedTool === 'move') {
            const clickedShapeIndex = shapes.findIndex((shape) =>
                isPointInShape(point, shape)
            );
            if (clickedShapeIndex !== -1) {
                setMovingShape({ index: clickedShapeIndex, startPoint: point });
                setSelectedShapeIndex(clickedShapeIndex);
            } else {
                setSelectedShapeIndex(null);
            }
        } else {
            const newShape: Shape = {
                id: Date.now(),
                type: selectedTool,
                points: [point],
                strokeColor: selectedStrokeColor,
                fillColor: selectedFillColor,
                lineWidth: selectedLineWidth,
            };
            setCurrentShape(newShape);
            setIsDrawing(true);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const currentPoint = getMousePos(e);
        if (
            isEditingVertices &&
            selectedShapeIndex !== null &&
            selectedVertexIndex !== null
        ) {
            setShapes((prev) =>
                prev.map((shape, index) =>
                    index === selectedShapeIndex
                        ? {
                              ...shape,
                              points: shape.points.map((p, i) =>
                                  i === selectedVertexIndex ? currentPoint : p
                              ),
                          }
                        : shape
                )
            );
        } else if (selectedTool === 'move' && movingShape) {
            const dx = currentPoint.x - movingShape.startPoint.x;
            const dy = currentPoint.y - movingShape.startPoint.y;
            setShapes((prev) =>
                prev.map((shape, index) =>
                    index === movingShape.index
                        ? {
                              ...shape,
                              points: shape.points.map((p) => ({
                                  x: p.x + dx,
                                  y: p.y + dy,
                              })),
                          }
                        : shape
                )
            );
            setMovingShape({ ...movingShape, startPoint: currentPoint });
        } else if (isDrawing && currentShape) {
            setCurrentShape((prev) => {
                if (!prev) return null;
                if (
                    prev.type === 'line' ||
                    prev.type === 'rectangle' ||
                    prev.type === 'circle'
                ) {
                    return { ...prev, points: [prev.points[0], currentPoint] };
                } else {
                    return { ...prev, points: [...prev.points, currentPoint] };
                }
            });
        }
    };

    const endDrawing = () => {
        if (isEditingVertices) {
            setSelectedVertexIndex(null);
            addToHistory();
        } else if (selectedTool === 'move') {
            if (movingShape) {
                addToHistory();
                setMovingShape(null);
            }
        } else if (currentShape) {
            if (
                currentShape.points.length > 1 ||
                currentShape.type === 'polygon'
            ) {
                setShapes((prev) => [...prev, currentShape]);
                addToHistory();
            }
            setCurrentShape(null);
        }
        setIsDrawing(false);
    };

    const drawShapes = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const allShapes = [...shapes, currentShape].filter(Boolean) as Shape[];

        allShapes.forEach((shape, index) => {
            ctx.beginPath();
            ctx.strokeStyle = shape.strokeColor;
            ctx.fillStyle = shape.fillColor;
            ctx.lineWidth = shape.lineWidth;

            switch (shape.type) {
                case 'line':
                    if (shape.points.length === 2) {
                        ctx.moveTo(shape.points[0].x, shape.points[0].y);
                        ctx.lineTo(shape.points[1].x, shape.points[1].y);
                    }
                    break;
                case 'rectangle':
                    if (shape.points.length === 2) {
                        const [start, end] = shape.points;
                        ctx.rect(
                            start.x,
                            start.y,
                            end.x - start.x,
                            end.y - start.y
                        );
                    }
                    break;
                case 'circle':
                    if (shape.points.length === 2) {
                        const [center, end] = shape.points;
                        const radius = Math.sqrt(
                            Math.pow(end.x - center.x, 2) +
                                Math.pow(end.y - center.y, 2)
                        );
                        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                    }
                    break;
                case 'polygon':
                    if (shape.points.length > 1) {
                        ctx.moveTo(shape.points[0].x, shape.points[0].y);
                        shape.points.slice(1).forEach((point) => {
                            ctx.lineTo(point.x, point.y);
                        });
                        ctx.closePath();
                    }
                    break;
            }

            ctx.stroke();
            if (shape.fillColor !== 'transparent') {
                ctx.fill();
            }

            if (index === selectedShapeIndex) {
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(
                    Math.min(...shape.points.map((p) => p.x)),
                    Math.min(...shape.points.map((p) => p.y)),
                    Math.max(...shape.points.map((p) => p.x)) -
                        Math.min(...shape.points.map((p) => p.x)),
                    Math.max(...shape.points.map((p) => p.y)) -
                        Math.min(...shape.points.map((p) => p.y))
                );
                ctx.setLineDash([]);

                if (isEditingVertices) {
                    shape.points.forEach((point, i) => {
                        ctx.fillStyle =
                            i === selectedVertexIndex ? 'red' : 'blue';
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                        ctx.fill();
                    });
                }
            }
        });
    };

    const isPointInShape = (point: Point, shape: Shape): boolean => {
        const { x, y } = point;
        const minX = Math.min(...shape.points.map((p) => p.x));
        const maxX = Math.max(...shape.points.map((p) => p.x));
        const minY = Math.min(...shape.points.map((p) => p.y));
        const maxY = Math.max(...shape.points.map((p) => p.y));
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
    };

    const deleteShape = (index: number) => {
        setShapes((prev) => prev.filter((_, i) => i !== index));
        if (selectedShapeIndex === index) {
            setSelectedShapeIndex(null);
        }
        addToHistory();
    };

    const moveShapeUp = (index: number) => {
        if (index === shapes.length - 1) return;
        setShapes((prev) => {
            const newShapes = [...prev];
            const temp = newShapes[index];
            newShapes[index] = newShapes[index + 1];
            newShapes[index + 1] = temp;
            return newShapes;
        });
        setSelectedShapeIndex(index + 1);
        addToHistory();
    };

    const moveShapeDown = (index: number) => {
        if (index === 0) return;
        setShapes((prev) => {
            const newShapes = [...prev];
            const temp = newShapes[index];
            newShapes[index] = newShapes[index - 1];
            newShapes[index - 1] = temp;
            return newShapes;
        });
        setSelectedShapeIndex(index - 1);
        addToHistory();
    };

    const updateSelectedShape = (updates: Partial<Shape>) => {
        if (selectedShapeIndex === null) return;
        setShapes((prev) =>
            prev.map((shape, index) =>
                index === selectedShapeIndex ? { ...shape, ...updates } : shape
            )
        );
        addToHistory();
    };

    const addToHistory = () => {
        const newState: AppState = {
            shapes,
            selectedShapeIndex,
            selectedTool,
            selectedStrokeColor,
            selectedFillColor,
            selectedLineWidth,
            isEditingVertices,
        };
        setHistory((prev) => [...prev.slice(0, historyIndex + 1), newState]);
        setHistoryIndex((prev) => prev + 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const prevState = history[historyIndex - 1];
            setShapes(prevState.shapes);
            setSelectedShapeIndex(prevState.selectedShapeIndex);
            setSelectedTool(prevState.selectedTool);
            setSelectedStrokeColor(prevState.selectedStrokeColor);
            setSelectedFillColor(prevState.selectedFillColor);
            setSelectedLineWidth(prevState.selectedLineWidth);
            setIsEditingVertices(prevState.isEditingVertices);
            setHistoryIndex((prev) => prev - 1);
        }
    };

    const updateToolSettings = (
        tool: AppState['selectedTool'] | undefined = undefined,
        strokeColor: string | undefined = undefined,
        fillColor: string | undefined = undefined,
        lineWidth: number | undefined = undefined
    ) => {
        if (tool !== undefined) setSelectedTool(tool);
        if (strokeColor !== undefined) setSelectedStrokeColor(strokeColor);
        if (fillColor !== undefined) setSelectedFillColor(fillColor);
        if (lineWidth !== undefined) setSelectedLineWidth(lineWidth);
        addToHistory();
    };

    const toggleVertexEditing = () => {
        setIsEditingVertices((prev) => !prev);
        setSelectedVertexIndex(null);
        addToHistory();
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4">
            <div className="flex-1">
                <div className="card shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">Canvas</h2>
                        <div>
                            <canvas
                                ref={canvasRef}
                                width={500}
                                height={500}
                                className="border border-gray-300"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={endDrawing}
                                onMouseLeave={endDrawing}
                                aria-label="Drawing canvas"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-64">
                <div className="card shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">Tools</h2>
                        <div className="form-control gap-4">
                            <select
                                className="select select-bordered w-full"
                                onChange={(e) =>
                                    updateToolSettings(e.target.value)
                                }
                            >
                                <option disabled selected>
                                    Select tool
                                </option>
                                <option value="line">Line</option>
                                <option value="rectangle">Rectangle</option>
                                <option value="circle">Circle</option>
                                <option value="polygon">Polygon</option>
                                <option value="move">Move</option>
                            </select>
                            <div>
                                <label className="label" htmlFor="strokeColor">
                                    Stroke Color
                                </label>
                                <input
                                    id="strokeColor"
                                    type="color"
                                    value={selectedStrokeColor}
                                    onChange={(e) =>
                                        updateToolSettings(
                                            undefined,
                                            e.target.value
                                        )
                                    }
                                    className="input input-bordered w-full h-10 cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="label" htmlFor="fillColor">
                                    Fill Color
                                </label>
                                <input
                                    id="fillColor"
                                    type="color"
                                    value={selectedFillColor}
                                    onChange={(e) =>
                                        updateToolSettings(
                                            undefined,
                                            undefined,
                                            e.target.value
                                        )
                                    }
                                    className="input input-bordered w-full h-10 cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="label" htmlFor="lineWidth">
                                    Line Width
                                </label>
                                <input
                                    id="lineWidth"
                                    type="range"
                                    min={1}
                                    max={10}
                                    step={1}
                                    value={selectedLineWidth}
                                    onChange={(e) =>
                                        updateToolSettings(
                                            undefined,
                                            undefined,
                                            undefined,
                                            parseInt(e.target.value, 10)
                                        )
                                    }
                                    className="range"
                                />
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={undo}
                                disabled={historyIndex <= 0}
                            >
                                <Undo2 className="mr-2 h-4 w-4" />
                                Undo
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card shadow-lg mt-4">
                    <div className="card-body">
                        <h2 className="card-title">Shapes</h2>
                        <div className="overflow-y-auto h-52">
                            {shapes.map((shape, index) => (
                                <div
                                    key={shape.id}
                                    className="flex justify-between items-center mb-2"
                                >
                                    <button
                                        className={`btn btn-sm ${
                                            selectedShapeIndex === index
                                                ? 'btn-secondary'
                                                : 'btn-ghost'
                                        }`}
                                        onClick={() =>
                                            setSelectedShapeIndex(index)
                                        }
                                    >
                                        {`${shape.type} ${index + 1}`}
                                    </button>
                                    <div className="flex gap-1">
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => moveShapeUp(index)}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => moveShapeDown(index)}
                                        >
                                            ↓
                                        </button>
                                        <button
                                            className="btn btn-error btn-sm"
                                            onClick={() => deleteShape(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {selectedShapeIndex !== null && (
                    <div className="card shadow-lg mt-4">
                        <div className="card-body">
                            <h2 className="card-title">Edit Shape</h2>
                            <div className="form-control gap-4">
                                <div>
                                    <label
                                        className="label"
                                        htmlFor="editStrokeColor"
                                    >
                                        Stroke Color
                                    </label>
                                    <input
                                        id="editStrokeColor"
                                        type="color"
                                        value={
                                            shapes[selectedShapeIndex]
                                                .strokeColor
                                        }
                                        onChange={(e) =>
                                            updateSelectedShape({
                                                strokeColor: e.target.value,
                                            })
                                        }
                                        className="input input-bordered w-full h-10 cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="label"
                                        htmlFor="editFillColor"
                                    >
                                        Fill Color
                                    </label>
                                    <input
                                        id="editFillColor"
                                        type="color"
                                        value={
                                            shapes[selectedShapeIndex].fillColor
                                        }
                                        onChange={(e) =>
                                            updateSelectedShape({
                                                fillColor: e.target.value,
                                            })
                                        }
                                        className="input input-bordered w-full h-10 cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="label"
                                        htmlFor="editLineWidth"
                                    >
                                        Line Width
                                    </label>
                                    <input
                                        id="editLineWidth"
                                        type="range"
                                        min={1}
                                        max={10}
                                        step={1}
                                        value={
                                            shapes[selectedShapeIndex].lineWidth
                                        }
                                        onChange={(e) =>
                                            updateSelectedShape({
                                                lineWidth: parseInt(
                                                    e.target.value,
                                                    10
                                                ),
                                            })
                                        }
                                        className="range"
                                    />
                                </div>
                                <button
                                    className={`btn ${
                                        isEditingVertices
                                            ? 'btn-secondary'
                                            : 'btn-outline'
                                    }`}
                                    onClick={toggleVertexEditing}
                                >
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    {isEditingVertices
                                        ? 'Exit Vertex Edit'
                                        : 'Edit Vertices'}
                                </button>
                                {isEditingVertices && (
                                    <div>
                                        <label className="label">
                                            Vertex Coordinates
                                        </label>
                                        {shapes[selectedShapeIndex].points.map(
                                            (point, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-2 mt-2"
                                                >
                                                    <input
                                                        type="number"
                                                        value={point.x}
                                                        onChange={(e) => {
                                                            const newPoints = [
                                                                ...shapes[
                                                                    selectedShapeIndex
                                                                ].points,
                                                            ];
                                                            newPoints[index] = {
                                                                ...point,
                                                                x: Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                            };
                                                            updateSelectedShape(
                                                                {
                                                                    points: newPoints,
                                                                }
                                                            );
                                                        }}
                                                        className="input input-bordered w-20"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={point.y}
                                                        onChange={(e) => {
                                                            const newPoints = [
                                                                ...shapes[
                                                                    selectedShapeIndex
                                                                ].points,
                                                            ];
                                                            newPoints[index] = {
                                                                ...point,
                                                                y: Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                            };
                                                            updateSelectedShape(
                                                                {
                                                                    points: newPoints,
                                                                }
                                                            );
                                                        }}
                                                        className="input input-bordered w-20"
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
