import { Shape } from './Shape';

export class Circle extends Shape {
    constructor(
        x: number,
        y: number,
        public radius: number,
        color: string
    ) {
        super(x, y, color);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}
