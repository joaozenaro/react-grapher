import { useRef, useState, useEffect } from 'react';
import { Shape } from './models/Shape';
import ShapeManager from './components/ShapeManager';
import ThemeSelector from './components/ThemeSelector';

export default function CanvasDrawingApp() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [shapes, setShapes] = useState<Shape[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        ctx.translate(canvas.width / 2, canvas.height / 2);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        shapes.forEach((shape) => shape.draw(ctx));
    }, [shapes]);

    return (
        <>
            <main className="grid h-[100vh] grid-rows-12">
                <header className="row-span-1 flex justify-end">
                    <ThemeSelector />
                </header>
                <section className="row-span-11 grid grid-cols-4 gap-x-4">
                    <canvas
                        ref={canvasRef}
                        className="border border-primary-content col-span-3 w-full h-full"
                    />
                    <ShapeManager
                        shapes={shapes}
                        setShapes={setShapes}
                        selectedShapeId={null}
                    />
                </section>
            </main>
        </>
    );
}
