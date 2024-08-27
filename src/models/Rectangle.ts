import { Shape } from './Shape';

export class Rectangle extends Shape {
    constructor(
        x: number,
        y: number,
        public width: number,
        public height: number,
        color: string
    ) {
        super(x, y, color);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
