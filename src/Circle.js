class Circle {
    constructor() {
        this.center = [0, 0];
        this.radius = 0;
    }

    withCenter(c) {
        this.center = c;
        return this;
    }

    withRadius(r) {
        this.radius = r;
        return this;
    }

    draw(viz) {
        viz.drawCircle(
            viz.scaleToCanvas.apply(viz, this.center), 
            this.radius, 
        );
    }
}