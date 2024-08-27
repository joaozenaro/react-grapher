import React, { useRef, useState, useEffect } from 'react';
import { ObjectManager } from './models/ObjectManager';
import { Shape } from './models/Shape';
import { Rectangle } from './models/Rectangle';
import { Circle } from './models/Circle';
import { Line } from './models/Line';
import AddShape from './components/AddShape';
import { EditorShape } from './models/EditorShape';
import ShapesList from './components/ShapesList';

export default function CanvasDrawingApp() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [objectManager] = useState(new ObjectManager());
    const [, setRefreshTrigger] = useState({});
    const [currentShape, setCurrentShape] = useState({
        type: '',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        radius: 50,
        endX: 100,
        endY: 100,
        color: '#000000',
    } as EditorShape);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        objectManager.drawAll(ctx);
    }, [objectManager, objectManager.shapes]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentShape((prev) => ({
            ...prev,
            [name]: name === 'color' ? value : parseFloat(value) || 0,
        }));
    };

    const handleSelectChange = (value: string) => {
        setCurrentShape((prev) => ({ ...prev, type: value }));
    };

    const handleAddShape = () => {
        let newShape: Shape;
        const { type, x, y, width, height, radius, endX, endY, color } =
            currentShape;

        switch (type) {
            case 'rectangle':
                newShape = new Rectangle(x, y, width, height, color);
                break;
            case 'circle':
                newShape = new Circle(x, y, radius, color);
                break;
            case 'line':
                newShape = new Line(x, y, endX, endY, color);
                break;
            default:
                return;
        }

        objectManager.addShape(newShape);
        setRefreshTrigger({});
    };

    const handleMoveShape = (id: number, direction: 'up' | 'down') => {
        objectManager.moveShape(id, direction);
        setRefreshTrigger({});
    };

    const handleDeleteShape = (id: number) => {
        objectManager.removeShape(id);
        setRefreshTrigger({});
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Canvas Drawing App</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={400}
                        className="border border-gray-300"
                    />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Add Shape</h2>
                    <AddShape
                        currentShape={currentShape}
                        handleInputChange={handleInputChange}
                        handleSelectChange={handleSelectChange}
                        handleAddShape={handleAddShape}
                    />
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Shapes</h2>
                <ShapesList
                    objectManager={objectManager}
                    handleMoveShape={handleMoveShape}
                    handleDeleteShape={handleDeleteShape}
                />
            </div>
        </div>
    );
}
