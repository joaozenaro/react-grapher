import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useShapes } from '../context/useShapes';
import { Shape, Vertex } from '../models/Shape';
import { MousePointer2, Shapes, Waypoints } from 'lucide-react';

enum Tools {
    Select,
    DrawLine,
    DrawShape,
}

const Canvas = ({
    background,
    setMousePos,
}: {
    background: string;
    setMousePos: React.Dispatch<React.SetStateAction<Vertex | null>>;
}) => {
    const {
        shapes,
        setShapes,
        startPoint,
        setStartPoint,
        currentPoint,
        setCurrentPoint,
        selectedShape,
        setSelectedShape,
        addVertex,
    } = useShapes();

    const [selectedTool, setSelectedTool] = useState<Tools>(Tools.Select);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>();

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Vertex | null>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);

    const drawShapes = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.save();
            ctx.translate(offset.x, offset.y);
            ctx.scale(scale, scale);

            shapes.forEach((shape) => shape.draw(ctx));

            if (startPoint && currentPoint) {
                ctx.beginPath();
                ctx.moveTo(startPoint.x, startPoint.y);
                ctx.lineTo(currentPoint.x, currentPoint.y);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            ctx.restore();
        },
        [shapes, startPoint, currentPoint, offset, scale]
    );

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        if (offset.x === 0 && offset.y === 0) {
            setOffset({ x: ctx.canvas.width / 2, y: ctx.canvas.height / 2 });
        }

        drawShapes(ctx);
        rafRef.current = requestAnimationFrame(animate);
    }, [drawShapes, offset.x, offset.y]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [animate]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.style.background = background;
    }, [background]);

    const getCanvasCoordinates = useCallback(
        (e: React.MouseEvent<HTMLElement>): { x: number; y: number } => {
            const canvas = canvasRef.current!;
            const rect = canvas.getBoundingClientRect();
            return {
                x: (e.clientX - rect.left - offset.x) / scale,
                y: (e.clientY - rect.top - offset.y) / scale,
            };
        },
        [offset, scale]
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setStartPoint(null);
                setCurrentPoint(null);
                setSelectedShape(null);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [setStartPoint, setCurrentPoint, setSelectedShape]);

    const handleCanvasMouseDown = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const coords = getCanvasCoordinates(e);

            if (e.nativeEvent.button === 2) {
                setStartPoint(null);
                setCurrentPoint(null);
                return;
            }

            if (selectedTool === Tools.Select) {
                setIsDragging(true);
                setDragStart({
                    x: e.clientX - offset.x,
                    y: e.clientY - offset.y,
                });
                return;
            }

            if (!startPoint) {
                setStartPoint(coords);

                const newShape = new Shape(
                    new Date().getTime(),
                    `Shape`,
                    [coords],
                    {
                        hasFill: false,
                        borderColor: '#000000',
                        borderWidth: 2,
                        hasBorder: true,
                    },
                    false,
                    !(selectedTool === Tools.DrawLine)
                );

                setShapes((prevShapes) => [...prevShapes, newShape]);
                setSelectedShape(newShape);
            } else {
                addVertex(selectedShape!.id, currentPoint!);

                setStartPoint(currentPoint);
                setCurrentPoint(null);
            }
        },
        [
            getCanvasCoordinates,
            selectedTool,
            startPoint,
            setStartPoint,
            setCurrentPoint,
            offset.x,
            offset.y,
            setShapes,
            setSelectedShape,
            addVertex,
            selectedShape,
            currentPoint,
        ]
    );

    const handleCanvasMouseMove = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            setMousePos(getCanvasCoordinates(e));
            if (startPoint) {
                setCurrentPoint(getCanvasCoordinates(e));
            }

            if (isDragging) {
                const newOffset = {
                    x: e.clientX - (dragStart?.x || 0),
                    y: e.clientY - (dragStart?.y || 0),
                };
                setOffset(newOffset);
            }
        },
        [
            setMousePos,
            getCanvasCoordinates,
            startPoint,
            isDragging,
            setCurrentPoint,
            dragStart?.x,
            dragStart?.y,
        ]
    );

    const handleCanvasMouseUp = useCallback(() => {
        setIsDragging(false);
        setDragStart(null);
    }, []);

    const handleWheel = useCallback(
        (e: React.WheelEvent) => {
            const scaleAmount = 0.1;
            const direction = e.deltaY > 0 ? -1 : 1;
            const newScale = scale + direction * scaleAmount * scale;

            if (newScale < 0.1 || newScale > 5) return;

            const rect = canvasRef.current!.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left - offset.x) / scale;
            const mouseY = (e.clientY - rect.top - offset.y) / scale;

            const newOffset = {
                x: offset.x - mouseX * (newScale - scale),
                y: offset.y - mouseY * (newScale - scale),
            };

            setOffset(newOffset);
            setScale(newScale);
        },
        [scale, offset]
    );

    return (
        <div className="w-100 col-span-4 flex items-center">
            <div className="join join-vertical absolute ms-4">
                <button
                    className={`btn join-item ${selectedTool === Tools.Select && 'btn-primary'}`}
                    onClick={() => setSelectedTool(Tools.Select)}
                >
                    <MousePointer2 />
                </button>
                <button
                    className={`btn join-item ${selectedTool === Tools.DrawLine && 'btn-primary'}`}
                    onClick={() => setSelectedTool(Tools.DrawLine)}
                >
                    <Waypoints />
                </button>
                <button
                    className={`btn join-item ${selectedTool === Tools.DrawShape && 'btn-primary'}`}
                    onClick={() => setSelectedTool(Tools.DrawShape)}
                >
                    <Shapes />
                </button>
            </div>
            <canvas
                ref={canvasRef}
                className="border border-primary-content w-full h-full"
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onWheel={handleWheel}
            />
        </div>
    );
};

export default Canvas;
