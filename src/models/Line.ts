import { Shape } from './Shape';

export class Line extends Shape {
    constructor(
        x: number,
        y: number,
        public endX: number,
        public endY: number,
        color: string
    ) {
        super(x, y, color);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
    }
}
