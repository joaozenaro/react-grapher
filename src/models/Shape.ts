export type Vertex = { x: number; y: number };

export type Styles = {
    hasFill: boolean;
    fillColor?: string;
    hasBorder: boolean;
    borderWidth?: number;
    borderColor?: string;
};

export class Shape {
    constructor(
        public id: number,
        public name: string,
        public vertices: Vertex[],
        public styles: Styles,
        public editing: boolean = false,
        public isClosed: boolean = true
    ) {
        this.id = id;
        this.vertices = vertices;
        this.styles = styles;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();

        ctx.moveTo(this.vertices[0]?.x, this.vertices[0]?.y);
        this.vertices.forEach(({ x, y }) => ctx.lineTo(x, y));

        if (this.isClosed) {
            ctx.closePath();
        }

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
