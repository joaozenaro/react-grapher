import { useState } from 'react';
import Canvas from './components/Canvas';
import ShapeManager from './components/ShapeManager';
import ThemeSelector from './components/ThemeSelector';
import { ShapesProvider } from './context/ShapesContext';
import { Vertex } from './models/Shape';

export default function CanvasDrawingApp() {
    const [background, setBackground] = useState('');
    const [mousePos, setMousePos] = useState<Vertex | null>({ x: 0, y: 0 });

    return (
        <ShapesProvider>
            <main className="grid h-[100vh] grid-rows-[5%_95%]">
                <header className="flex justify-between items-center">
                    <div className="absolute bottom-0 m-4">{`${(mousePos?.x ?? 0) << 0}x${(mousePos?.y ?? 0) << 0}`}</div>
                    <div className="flex items-center gap-2 ms-4">
                        <label htmlFor="background">Custom background</label>
                        <input
                            type="checkbox"
                            className="checkbox"
                            onChange={() =>
                                setBackground(!background ? '#000000' : '')
                            }
                        />
                        {!!background && (
                            <input
                                type="color"
                                className="w-20 input input-bordered input-sm"
                                value={background}
                                onChange={(e) => setBackground(e.target.value)}
                            />
                        )}
                    </div>
                    <ThemeSelector />
                </header>
                <section className="grid grid-cols-5">
                    <Canvas background={background} setMousePos={setMousePos} />
                    <ShapeManager />
                </section>
            </main>
        </ShapesProvider>
    );
}
