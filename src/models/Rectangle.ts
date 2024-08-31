import { Shape, Styles } from './Shape';

export class Rectangle extends Shape {
    constructor(
        id: number,
        name: string,
        x: number,
        y: number,
        width: number,
        height: number,
        styles: Styles
    ) {
        super(
            id,
            name,
            [
                { x, y },
                { x: x + width, y },
                { x: x + width, y: y + height },
                { x, y: y + height },
            ],
            styles
        );
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(this.vertices[0]?.x, this.vertices[0]?.y);
        this.vertices.forEach(({ x, y }) => ctx.lineTo(x, y));
        ctx.closePath();

        if (this.styles.hasFill) {
            ctx.fillStyle = this.styles.fillColor ?? "#000000";
            ctx.fill();
        }

        if (this.styles.hasBorder) {
            ctx.strokeStyle = this.styles.borderColor ?? "#000000";

            if (this.styles.borderWidth) {
                ctx.lineWidth = this.styles.borderWidth;
                ctx.stroke();
            }
        }
    }
}
