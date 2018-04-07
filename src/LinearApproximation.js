const Shape = require("./Shape.js");

class LinearApproximation extends Shape {
    constructor() {
        super();

        this.point = [0, 0];
        this.xDelta = 0.01;
        this.fPrime = (pt) => 0;
    }

    withPoint(point) {
        this.point = point;
        return this;
    }

    withXDelta(xDelta) {
        this.xDelta = xDelta;
        return this;
    }

    withFPrime(fPrime) {
        this.fPrime = fPrime;
        return this;
    }

    draw(viz) {
        viz.setColor(this.color);

        var x0, y0;
        var x1, y1;

        // Draw right side
        x0 = this.point[0];
        y0 = this.point[1];
        while (x0 < viz.maxX) {
            x1 = x0 + this.xDelta;
            y1 = y0 + this.xDelta * this.fPrime([x0, y0]);
            
            viz.drawLine(
                viz.scaleToCanvas([x0, y0]), 
                viz.scaleToCanvas([x1, y1]) 
            );

            x0 = x1;
            y0 = y1;
        }

        // Draw left side
        x0 = this.point[0];
        y0 = this.point[1];
        while (x0 > viz.minX) {
            x1 = x0 - this.xDelta;
            y1 = y0 - this.xDelta * this.fPrime([x0, y0]);

            viz.drawLine(
                viz.scaleToCanvas([x0, y0]), 
                viz.scaleToCanvas([x1, y1])
            );

            x0 = x1;
            y0 = y1;
        }
    }
}

module.exports = LinearApproximation;