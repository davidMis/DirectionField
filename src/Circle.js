const Shape = require("./Shape.js");

class Circle extends Shape {
    constructor() {
        super();

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
        viz.setColor(this.color);

        viz.drawCircle(
            viz.scaleToCanvas(this.center), 
            this.radius
        );
    }
}

module.exports = Circle;