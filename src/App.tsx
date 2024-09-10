import { useState } from 'react';
import Canvas from './components/Canvas';
import ShapeManager from './components/ShapeManager';
import ThemeSelector from './components/ThemeSelector';
import { ShapesProvider } from './context/ShapesContext';

export default function CanvasDrawingApp() {
    const [background, setBackground] = useState('');

    return (
        <ShapesProvider>
            <main className="grid h-[100vh] grid-rows-[5%_95%]">
                <header className="flex justify-between items-center">
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
                    <Canvas background={background} />
                    <ShapeManager />
                </section>
            </main>
        </ShapesProvider>
    );
}
