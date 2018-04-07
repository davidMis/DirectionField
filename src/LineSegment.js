const Shape = require("./Shape.js");

// LineSegment is a shape that can be added to a viz.  It is defined in terms
// of a point, a length, and a theta. The point can define the center, start,
// or end of the segment. We use an angle theta instead of a slope so we can
// draw vertical lines, but a "withSlope()" function that will automatically
// convert to a theta is provided for convenience. 
class LineSegment extends Shape {
    constructor() {
        super();

        this.point = [0, 0];
        this.theta = 0;
        this.length = 0;
        this.pointDefines = "start"; 
    }

    withCenter(point) {
        this.pointDefines = "center";
        this.point = point;
        return this;
    }

    withSlope(m) {
        this.theta = LineSegment.thetaFromSlope(m);
        return this;
    }

    withTheta(theta) {
        this.theta = theta;
        return this;
    }

    withLength(length) {
        this.length = length;
        return this;
    }

    // returns endpoints [[x1,y1], [x2,y2]] in the graph's space
    endpoints() {
        if (isNaN(this.theta)) {
            console.log("NaN for " + this.point);
        }

        if (this.pointDefines == "start") {
            throw new Error("UNIMPLEMENTED");
        } else if (this.pointDefines == "center") {
            var r = this.length / 2;
            return [
                [this.point[0] + Math.cos(this.theta) * -r, this.point[1] + Math.sin(this.theta) * -r],
                [this.point[0] + Math.cos(this.theta) * r, this.point[1] + Math.sin(this.theta) * r]
            ];
        } else if (this.pointDefines == "end") {
            throw new Error("UNIMPLEMENTED");
        } else {
            throw new Error("UNIMPLEMENTED");
        }
    }

    draw(viz) {
        viz.setColor(this.color);

        let endpoints = this.endpoints();
        viz.drawLine(
            viz.scaleToCanvas(endpoints[0]), 
            viz.scaleToCanvas(endpoints[1])
        );
    }
}

// converts the slope given to an appropriate theta
LineSegment.thetaFromSlope = function(m) {
    return Math.atan(m);
}

module.exports = LineSegment;