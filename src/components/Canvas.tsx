import { useRef, useEffect, useState, useCallback } from 'react';
import { useShapes } from '../context/useShapes';
import { Shape, Vertex } from '../models/Shape';
import { MousePointer2, Shapes, Waypoints } from 'lucide-react';

enum Tools {
    Select,
    DrawLine,
    DrawShape,
}

const Canvas = () => {
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

    const [mousePos, setMousePos] = useState<Vertex | null>({ x: 0, y: 0 });
    const [selectedTool, setSelectedTool] = useState<Tools>(Tools.Select);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>();

    const drawShapes = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            shapes.forEach((shape) => shape.draw(ctx));

            if (startPoint && currentPoint) {
                ctx.beginPath();
                ctx.moveTo(startPoint.x, startPoint.y);
                ctx.lineTo(currentPoint.x, currentPoint.y);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        },
        [shapes, startPoint, currentPoint]
    );

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        ctx.translate(canvas.width / 2, canvas.height / 2);

        drawShapes(ctx);
        rafRef.current = requestAnimationFrame(animate);
    }, [drawShapes]);

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

    const getCanvasCoordinates = useCallback(
        (e: React.MouseEvent<HTMLElement>): { x: number; y: number } => {
            const canvas = canvasRef.current!;
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left - canvas.width / 2,
                y: e.clientY - rect.top - canvas.height / 2,
            };
        },
        []
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

            if (selectedTool === Tools.Select) return;

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
            selectedTool,
            startPoint,
            currentPoint,
            selectedShape,
            setShapes,
            setSelectedShape,
            addVertex,
            getCanvasCoordinates,
            setStartPoint,
            setCurrentPoint,
        ]
    );

    const handleCanvasMouseMove = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            setMousePos(getCanvasCoordinates(e));
            if (startPoint) {
                setCurrentPoint(getCanvasCoordinates(e));
            }
        },
        [startPoint, getCanvasCoordinates, setCurrentPoint]
    );

    return (
        <div className="w-100 col-span-4 flex items-center">
            <div className="absolute bottom-0 m-4">{`${mousePos?.x}x${mousePos?.y}`}</div>
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
            />
        </div>
    );
};

export default Canvas;
