import Canvas from './components/Canvas';
import ShapeManager from './components/ShapeManager';
import ThemeSelector from './components/ThemeSelector';
import { ShapesProvider } from './context/ShapesContext';

export default function CanvasDrawingApp() {
    return (
        <ShapesProvider>
            <main className="grid h-[100vh] grid-rows-[5%_95%]">
                <header className="flex justify-end">
                    <ThemeSelector />
                </header>
                <section className="grid grid-cols-5">
                    <Canvas />
                    <ShapeManager />
                </section>
            </main>
        </ShapesProvider>
    );
}
