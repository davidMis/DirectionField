const Shape = require("./Shape.js");

// A DeadReackoningApproximation is an arc defined by a point and a function that
// gives the instantaneous rate-of-change at every point. The arc is built by starting
// at the given point [x0, y0], then moving to [x0 + xDelta, y0 + F'(x0, y0)] where xDelta
// is a small number.
//
// This implementation is sensitive to the choice of xDelta. When xDelta is too large, this
// approximation will be wildly inaccurate very quickly because it will "skip" a swath of
// changes in the first derivative. Consider xDelta = 2 and F'(x,y) = sin(x) for example.
// 
// The current implementation is similar to a first-order Taylor series approximation. We
// might be able to improve the approximation by using higher-order Taylor series approximations,
// but that will require building a symbolix-computation library that is capable of manipulating
// derivatives. Sounds like a fun project on its own!
//
// TODO: Generalize for all arcs, not just functions.
class DeadReckoningApproximation extends Shape {
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

module.exports = DeadReckoningApproximation;