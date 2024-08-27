import { EditorShape } from '../models/EditorShape';

type AddShapeProps = {
    currentShape: EditorShape;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange: (value: string) => void;
    handleAddShape: () => void;
};

export default function AddShape({
    currentShape,
    handleInputChange,
    handleSelectChange,
    handleAddShape,
}: AddShapeProps) {
    return (
        <div className="space-y-4">
            <div>
                <select
                    onChange={(e) => handleSelectChange(e.target.value)}
                    value={currentShape.type}
                    className="select select-bordered"
                >
                    <option id="shapeType" disabled value="">
                        Shape Type
                    </option>
                    <option value="rectangle">Rectangle</option>
                    <option value="circle">Circle</option>
                    <option value="line">Line</option>
                </select>
            </div>
            <div>
                <label className="input input-bordered flex items-center gap-2">
                    X
                    <input
                        id="x"
                        name="x"
                        type="number"
                        value={currentShape.x}
                        onChange={handleInputChange}
                        className="grow"
                    />
                </label>
            </div>
            <div>
                <label className="input input-bordered flex items-center gap-2">
                    Y
                    <input
                        id="y"
                        name="y"
                        type="number"
                        value={currentShape.y}
                        onChange={handleInputChange}
                        className="grow"
                    />
                </label>
            </div>
            {currentShape.type === 'rectangle' && (
                <>
                    <div>
                        <label className="input input-bordered flex items-center gap-2">
                            Width
                            <input
                                id="width"
                                name="width"
                                type="number"
                                value={currentShape.width}
                                onChange={handleInputChange}
                                className="grow"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="input input-bordered flex items-center gap-2">
                            Height
                            <input
                                id="height"
                                name="height"
                                type="number"
                                value={currentShape.height}
                                onChange={handleInputChange}
                                className="grow"
                            />
                        </label>
                    </div>
                </>
            )}
            {currentShape.type === 'circle' && (
                <div>
                    <label className="input input-bordered flex items-center gap-2">
                        Radius
                        <input
                            id="radius"
                            name="radius"
                            type="number"
                            value={currentShape.radius}
                            onChange={handleInputChange}
                            className="grow"
                        />
                    </label>
                </div>
            )}
            {currentShape.type === 'line' && (
                <>
                    <div>
                        <label className="input input-bordered flex items-center gap-2">
                            X
                            <input
                                id="endX"
                                name="endX"
                                type="number"
                                value={currentShape.endX}
                                onChange={handleInputChange}
                                className="grow"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="input input-bordered flex items-center gap-2">
                            Y
                            <input
                                id="endY"
                                name="endY"
                                type="number"
                                value={currentShape.endY}
                                onChange={handleInputChange}
                                className="grow"
                            />
                        </label>
                    </div>
                </>
            )}
            <div>
                <label className="input input-bordered flex items-center gap-2">
                    Color
                    <input
                        id="color"
                        name="color"
                        type="color"
                        value={currentShape.color}
                        onChange={handleInputChange}
                        className="grow"
                    />
                </label>
            </div>
            <button className="btn btn-primary" onClick={handleAddShape}>
                Add Shape
            </button>
        </div>
    );
}
