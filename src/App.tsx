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
    const [shapes, setShapes] = useState<Shape[]>(objectManager.shapes);
    const [currentShape, setCurrentShape] = useState<EditorShape>({
        type: '',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        radius: 50,
        endX: 100,
        endY: 100,
        color: '#000000',
    });
    const [selectedShapeId, setSelectedShapeId] = useState<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        objectManager.drawAll(ctx);
    }, [objectManager, shapes]);

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

    const handleAddOrUpdateShape = () => {
        if (selectedShapeId !== null) {
            // Update the selected shape
            const updatedShape = objectManager.shapes.find(
                (shape) => shape.id === selectedShapeId
            );
            if (updatedShape) {
                updatedShape.x = currentShape.x;
                updatedShape.y = currentShape.y;
                updatedShape.color = currentShape.color;
                if (updatedShape instanceof Rectangle) {
                    updatedShape.width = currentShape.width;
                    updatedShape.height = currentShape.height;
                } else if (updatedShape instanceof Circle) {
                    updatedShape.radius = currentShape.radius;
                } else if (updatedShape instanceof Line) {
                    updatedShape.endX = currentShape.endX;
                    updatedShape.endY = currentShape.endY;
                }
            }
        } else {
            // Add a new shape
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
        }

        setShapes([...objectManager.shapes]);
        setSelectedShapeId(null);
        setCurrentShape({
            type: '',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            radius: 50,
            endX: 100,
            endY: 100,
            color: '#000000',
        });
    };

    const handleMoveShape = (id: number, direction: 'up' | 'down') => {
        objectManager.moveShape(id, direction);
        setShapes([...objectManager.shapes]);
    };

    const handleDeleteShape = (id: number) => {
        objectManager.removeShape(id);
        setShapes([...objectManager.shapes]);
    };

    const handleSelectShape = (id: number) => {
        const shape = objectManager.shapes.find((shape) => shape.id === id);
        if (shape) {
            setSelectedShapeId(id);
            setCurrentShape({
                type: shape.constructor.name.toLowerCase(),
                x: shape.x,
                y: shape.y,
                width: shape instanceof Rectangle ? shape.width : 100,
                height: shape instanceof Rectangle ? shape.height : 100,
                radius: shape instanceof Circle ? shape.radius : 50,
                endX: shape instanceof Line ? shape.endX : 100,
                endY: shape instanceof Line ? shape.endY : 100,
                color: shape.color,
            });
        }
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
                    <h2 className="text-xl font-semibold mb-2">
                        Add / Edit Shape
                    </h2>
                    <AddShape
                        currentShape={currentShape}
                        handleInputChange={handleInputChange}
                        handleSelectChange={handleSelectChange}
                        handleAddShape={handleAddOrUpdateShape}
                    />
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Shapes</h2>
                <ShapesList
                    objectManager={objectManager}
                    handleMoveShape={handleMoveShape}
                    handleDeleteShape={handleDeleteShape}
                    handleSelectShape={handleSelectShape}
                />
            </div>
        </div>
    );
}
