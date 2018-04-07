const Shape = require("./Shape.js");

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
    // TODO: Is it cleaner to make this polymorphic?
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