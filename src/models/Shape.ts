export type Vertice = { x: number; y: number };

export type Styles = {
    hasFill: boolean;
    fillColor?: string;
    hasBorder: boolean;
    borderWidth?: number;
    borderColor?: string;
};

export abstract class Shape {
    constructor(
        public id: number,
        public name: string,
        public vertices: Vertice[],
        public styles: Styles,
        public editing: boolean = false
    ) {
        this.id = id;
        this.vertices = vertices;
        this.styles = styles;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
}
