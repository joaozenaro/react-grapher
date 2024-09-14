import { Check, ChevronDown, ChevronUp, Settings2, Trash } from 'lucide-react';
import { Shape } from '../models/Shape';
import { useShapes } from '../context/useShapes';
import React, { useCallback, useState } from 'react';

const ShapeItem = ({
    shape,
    onSelect,
    isSelected,
}: {
    shape: Shape;
    onSelect: () => void;
    isSelected: boolean;
}) => {
    const {
        updateShape,
        editShape,
        removeShape,
        toggleShapeStyle,
        addVertex,
        updateVertex,
        removeVertex,
        moveShapeUp,
        moveShapeDown,
    } = useShapes();

    const [isEditingName, setIsEditingName] = useState(false);

    const handleNameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            updateShape(shape.id, { name: e.target.value });
        },
        [shape.id, updateShape]
    );

    const handleNameDoubleClick = useCallback(() => {
        setIsEditingName(true);
    }, []);

    const handleEditToggle = useCallback(() => {
        editShape(shape.id);
        setIsEditingName(false);
    }, [shape.id, editShape]);

    const handleRemove = useCallback(() => {
        removeShape(shape.id);
    }, [shape.id, removeShape]);

    const handleMoveUp = useCallback(() => {
        moveShapeUp(shape.id);
    }, [shape.id, moveShapeUp]);

    const handleMoveDown = useCallback(() => {
        moveShapeDown(shape.id);
    }, [shape.id, moveShapeDown]);

    const handleToggleFill = useCallback(() => {
        toggleShapeStyle(shape.id, 'fill');
    }, [shape.id, toggleShapeStyle]);

    const handleToggleBorder = useCallback(() => {
        toggleShapeStyle(shape.id, 'border');
    }, [shape.id, toggleShapeStyle]);

    const handleAddVertex = useCallback(() => {
        addVertex(shape.id);
    }, [shape.id, addVertex]);

    const handleUpdateVertex = useCallback(
        (index: number, key: 'x' | 'y', value: string) => {
            updateVertex(shape.id, index, key, value);
        },
        [shape.id, updateVertex]
    );

    const handleRemoveVertex = useCallback(
        (index: number) => {
            removeVertex(shape.id, index);
        },
        [shape.id, removeVertex]
    );

    const handleNameBlur = useCallback(() => {
        setIsEditingName(false);
    }, []);

    const handleToggleIsClosed = useCallback(() => {
        updateShape(shape.id, { isClosed: !shape.isClosed });
    }, [shape.id, shape.isClosed, updateShape]);

    return (
        <tr
            className={`grid grid-cols-6 hover ${
                isSelected ? 'bg-base-200 border-primary' : ''
            }`}
            onClick={onSelect}
        >
            <td className="col-span-6 join">
                {!isEditingName ? (
                    <span
                        className="text-left cursor-pointer w-full join-item flex items-center"
                        onDoubleClick={handleNameDoubleClick}
                    >
                        {shape.name}
                    </span>
                ) : (
                    <input
                        type="text"
                        className="input input-ghost join-item w-full"
                        value={shape.name}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        autoFocus
                    />
                )}
                <button
                    className="btn btn-square join-item"
                    onClick={handleMoveUp}
                >
                    <ChevronUp />
                </button>
                <button
                    className="btn btn-square join-item"
                    onClick={handleMoveDown}
                >
                    <ChevronDown />
                </button>

                {!shape.editing ? (
                    <button
                        className="btn btn-outline btn-square btn-info join-item"
                        onClick={handleEditToggle}
                    >
                        <span>
                            <Settings2 />
                        </span>
                    </button>
                ) : (
                    <button
                        onClick={handleEditToggle}
                        className="btn btn-outline btn-square btn-info join-item"
                    >
                        <span>
                            <Check />
                        </span>
                    </button>
                )}
                <button
                    className="btn btn-outline btn-square btn-error join-item"
                    onClick={handleRemove}
                >
                    <span>
                        <Trash />
                    </span>
                </button>
            </td>

            {shape.editing && (
                <td className="col-span-6">
                    <label className="label cursor-pointer">
                        <span className="label-text">Closed Shape</span>
                        <input
                            type="checkbox"
                            checked={shape.isClosed}
                            onChange={handleToggleIsClosed}
                            className="checkbox"
                        />
                    </label>

                    <label className="label cursor-pointer">
                        <span className="label-text">Fill</span>
                        <input
                            type="checkbox"
                            checked={shape.styles.hasFill}
                            onChange={handleToggleFill}
                            className="checkbox"
                        />
                    </label>
                    {shape.styles.hasFill && (
                        <div className="join grid grid-cols-2">
                            <input
                                type="color"
                                className="w-full input input-bordered join-item"
                                value={shape.styles.fillColor ?? '#000000'}
                                onChange={(e) =>
                                    updateShape(shape.id, {
                                        styles: {
                                            ...shape.styles,
                                            fillColor: e.target.value,
                                        },
                                    })
                                }
                            />
                        </div>
                    )}
                    <label className="label cursor-pointer">
                        <span className="label-text">Border</span>
                        <input
                            type="checkbox"
                            checked={shape.styles.hasBorder}
                            onChange={handleToggleBorder}
                            className="checkbox"
                        />
                    </label>
                    {shape.styles.hasBorder && (
                        <div className="join grid grid-cols-2">
                            <input
                                type="color"
                                className="w-full input input-bordered join-item"
                                value={shape.styles.borderColor ?? '#000000'}
                                onChange={(e) =>
                                    updateShape(shape.id, {
                                        styles: {
                                            ...shape.styles,
                                            borderColor: e.target.value,
                                        },
                                    })
                                }
                            />
                            <input
                                placeholder="Width"
                                type="text"
                                className="input input-bordered join-item"
                                value={shape.styles.borderWidth ?? ''}
                                onChange={(e) =>
                                    updateShape(shape.id, {
                                        styles: {
                                            ...shape.styles,
                                            borderWidth:
                                                parseInt(e.target.value) || 0,
                                        },
                                    })
                                }
                            />
                        </div>
                    )}

                    <div className="divider"></div>

                    <span className="ms-1 mt-2">Vertices</span>
                    <div className="flex flex-col gap-y-2 py-2">
                        {shape.vertices.map((vertex, index) => (
                            <div key={index} className="join grid grid-cols-3">
                                <input
                                    className="input input-bordered join-item"
                                    type="text"
                                    value={vertex.x}
                                    onChange={(e) =>
                                        handleUpdateVertex(
                                            index,
                                            'x',
                                            e.target.value
                                        )
                                    }
                                    placeholder="X"
                                />
                                <input
                                    className="input input-bordered join-item"
                                    type="text"
                                    value={vertex.y}
                                    onChange={(e) =>
                                        handleUpdateVertex(
                                            index,
                                            'y',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Y"
                                />
                                <button
                                    className="btn join-item btn-outline btn-error"
                                    onClick={() => handleRemoveVertex(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            className="btn btn-success"
                            onClick={handleAddVertex}
                        >
                            Add Vertex
                        </button>
                    </div>
                </td>
            )}
        </tr>
    );
};

export default React.memo(ShapeItem);
