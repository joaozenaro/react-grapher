import { Shape } from './Shape';

export class ObjectManager {
    shapes: Shape[] = [];

    addShape(shape: Shape): void {
        this.shapes.push(shape);
    }

    removeShape(id: number): void {
        this.shapes = this.shapes.filter((shape) => shape.id !== id);
    }

    moveShape(id: number, direction: 'up' | 'down'): void {
        const index = this.shapes.findIndex((shape) => shape.id === id);
        if (index === -1) return;
        const newIndex =
            direction === 'up'
                ? Math.max(0, index - 1)
                : Math.min(this.shapes.length - 1, index + 1);
        const [shape] = this.shapes.splice(index, 1);
        this.shapes.splice(newIndex, 0, shape);
    }

    drawAll(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.shapes.forEach((shape) => shape.draw(ctx));
    }
}
