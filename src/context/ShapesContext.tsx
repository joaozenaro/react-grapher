import React, { createContext, useState, useCallback } from 'react';
import { Shape, Vertex } from '../models/Shape';

export const ShapesContext = createContext<
    ReturnType<typeof useShapesState> | undefined
>(undefined);

const useShapesState = () => {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [nextShapeId, setNextShapeId] = useState(1);
    const [startPoint, setStartPoint] = useState<Vertex | null>(null);
    const [currentPoint, setCurrentPoint] = useState<Vertex | null>(null);
    const [selectedShape, setSelectedShape] = useState<Shape | null>(null);

    const addShape = useCallback(
        (shape?: Shape) => {
            const newShape =
                shape ??
                new Shape(
                    nextShapeId,
                    `Shape ${nextShapeId}`,
                    [
                        { x: -50, y: 50 },
                        { x: 50, y: 50 },
                        { x: 50, y: -50 },
                        { x: -50, y: -50 },
                    ],
                    {
                        hasFill: true,
                        fillColor: '#000000',
                        hasBorder: false,
                        borderWidth: 0,
                        borderColor: '',
                    }
                );
            setShapes((prev) => [...prev, newShape]);
            setNextShapeId((prev) => prev + 1);
            setSelectedShape(newShape);
        },
        [nextShapeId]
    );

    const updateShapes = useCallback(
        (updater: (shapes: Shape[]) => Shape[]) => {
            setShapes((prev) => updater(prev));
        },
        []
    );

    const removeShape = useCallback(
        (shapeId: number) => {
            updateShapes((shapes) =>
                shapes.filter((shape) => shape.id !== shapeId)
            );
            setSelectedShape((prev) => (prev?.id === shapeId ? null : prev));
        },
        [updateShapes]
    );

    const addVertex = useCallback(
        (shapeId: number, vertex: Vertex = { x: 0, y: 0 }) => {
            updateShapes((shapes) =>
                shapes.map((shape) =>
                    shape.id === shapeId
                        ? new Shape(
                              shape.id,
                              shape.name,
                              [...shape.vertices, vertex],
                              shape.styles,
                              shape.editing,
                              shape.isClosed
                          )
                        : shape
                )
            );
        },
        [updateShapes]
    );

    const removeVertex = useCallback(
        (shapeId: number, vertexIndex: number) => {
            updateShapes((shapes) =>
                shapes.map((shape) =>
                    shape.id === shapeId
                        ? new Shape(
                              shape.id,
                              shape.name,
                              shape.vertices.filter(
                                  (_, i) => i !== vertexIndex
                              ),
                              shape.styles,
                              shape.editing
                          )
                        : shape
                )
            );
        },
        [updateShapes]
    );

    const updateVertex = useCallback(
        (
            shapeId: number,
            vertexIndex: number,
            key: 'x' | 'y',
            value: string
        ) => {
            if (!/^-?\d*$/.test(value)) return;
            updateShapes((shapes) =>
                shapes.map((shape) =>
                    shape.id === shapeId
                        ? new Shape(
                              shape.id,
                              shape.name,
                              shape.vertices.map((v, i) =>
                                  i === vertexIndex
                                      ? { ...v, [key]: parseInt(value) || 0 }
                                      : v
                              ),
                              shape.styles,
                              shape.editing
                          )
                        : shape
                )
            );
        },
        [updateShapes]
    );

    const updateShape = useCallback(
        (shapeId: number, updates: Partial<Shape>) => {
            updateShapes((shapes) =>
                shapes.map((shape) =>
                    shape.id === shapeId
                        ? new Shape(
                              shape.id,
                              updates.name ?? shape.name,
                              updates.vertices ?? shape.vertices,
                              { ...shape.styles, ...updates.styles },
                              updates.editing ?? shape.editing,
                              updates.isClosed ?? shape.isClosed
                          )
                        : shape
                )
            );
        },
        [updateShapes]
    );

    const toggleShapeStyle = useCallback(
        (shapeId: number, type: 'fill' | 'border') => {
            updateShapes((shapes) =>
                shapes.map((shape) =>
                    shape.id === shapeId
                        ? new Shape(
                              shape.id,
                              shape.name,
                              shape.vertices,
                              {
                                  ...shape.styles,
                                  [type === 'fill' ? 'hasFill' : 'hasBorder']:
                                      !shape.styles[
                                          type === 'fill'
                                              ? 'hasFill'
                                              : 'hasBorder'
                                      ],
                              },
                              shape.editing
                          )
                        : shape
                )
            );
        },
        [updateShapes]
    );

    const editShape = useCallback(
        (shapeId: number) => {
            updateShapes((shapes) =>
                shapes.map((shape) =>
                    shape.id === shapeId
                        ? new Shape(
                              shape.id,
                              shape.name,
                              shape.vertices,
                              shape.styles,
                              !shape.editing
                          )
                        : shape
                )
            );
        },
        [updateShapes]
    );

    const moveShape = useCallback(
        (shapeId: number, direction: 'up' | 'down') => {
            updateShapes((shapes) => {
                const index = shapes.findIndex((shape) => shape.id === shapeId);
                if (
                    (direction === 'up' && index > 0) ||
                    (direction === 'down' && index < shapes.length - 1)
                ) {
                    const newIndex = direction === 'up' ? index - 1 : index + 1;
                    const newShapes = [...shapes];
                    [newShapes[index], newShapes[newIndex]] = [
                        newShapes[newIndex],
                        newShapes[index],
                    ];
                    return newShapes;
                }
                return shapes;
            });
        },
        [updateShapes]
    );

    return {
        shapes,
        setShapes,
        startPoint,
        setStartPoint,
        currentPoint,
        setCurrentPoint,
        selectedShape,
        setSelectedShape,
        addShape,
        removeShape,
        addVertex,
        removeVertex,
        updateVertex,
        updateShape,
        toggleShapeStyle,
        editShape,
        moveShapeUp: (shapeId: number) => moveShape(shapeId, 'up'),
        moveShapeDown: (shapeId: number) => moveShape(shapeId, 'down'),
    };
};

export const ShapesProvider = ({ children }: { children: React.ReactNode }) => {
    const shapesState = useShapesState();
    return (
        <ShapesContext.Provider value={shapesState}>
            {children}
        </ShapesContext.Provider>
    );
};
