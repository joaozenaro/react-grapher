export abstract class Shape {
    id: number;
    color: string;

    constructor(
        public x: number,
        public y: number,
        color: string
    ) {
        this.id = Date.now();
        this.color = color;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
}
