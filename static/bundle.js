(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./Shape.js":4}],2:[function(require,module,exports){
const Shape = require("./Shape.js");

// A DeadReackoningApproximation is an arc defined by a point and a function that
// gives the instantaneous rate-of-change at every point. The arc is built by starting
// at the given point [x0, y0], then moving to [x0 + xDelta, y0 + F'(x0, y0)] where xDelta
// is a small number.
//
// The approximation will NOT identify singular points,
//
// This implementation is sensitive to the choice of xDelta. When xDelta is too large, this
// approximation will be wildly inaccurate very quickly because it will "skip" a swath of
// changes in the first derivative. Consider xDelta = 2 and F'(x,y) = sin(x) for example.
// 
// 
// The current implementation is similar to a first-order Taylor series approximation. We
// might be able to improve the approximation by using higher-order Taylor series approximations,
// but that will require building a symbolix-computation library that is capable of manipulating
// derivatives. Sounds like a fun project on its own!
//
// TODO: Generalize for all arcs, not just functions.
// TODO: Figure out how to quantify how accurate the approximation is based on the provided function.
//       I believe that some "chaotic" functions might diverge extremely quickly, even for small xDelta. 
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
},{"./Shape.js":4}],3:[function(require,module,exports){
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
},{"./Shape.js":4}],4:[function(require,module,exports){
// Shape is the parent class of all shapes that can be added to a Viz.
// Subclasses should implement a "draw(viz)" method to draw themselves 
// in the provided viz.
class Shape {
    constructor() {
        this.color = "black";
    }

    withColor(color) {
        this.color = color;
        return this;
    }

    // Subclasses should override this method.
    draw(viz) {
        throw new Error("draw() method unimplemented for Shape subclass");
    } 
}

module.exports = Shape;
},{}],5:[function(require,module,exports){
// Viz is a top-level visualization. 
// It can contain Shapes to draw, has methods to interact with the canvas, and can 
// translate between the graph and canvas's coordinate systems. 
class Viz {
    constructor(parent, width, height) {
        if (parent == null || parent.nodeType == null) {
            throw new Error("Expected first element to be a DOM Node");
        }
        if (width == null || height == null || typeof width !== "number" || typeof height !== "number") {
            throw new Error("Expected second and third elements to be numbers");
        }

        this.parent = parent;

        this.node = document.createElement("canvas");
        this.node.width = width;
        this.node.height = height;
        this.parent.appendChild(this.node);

        this.shouldDrawAxes = false;
        this.minY = -10;
        this.maxY = 10;
        this.minX = -10;
        this.maxX = 10;
        this.shapes = [];
    }

    getWidth() {
        return this.node.width;
    }

    getHeight() {
        return this.node.height;
    }

    addShape(s) {
        this.shapes.push(s);
    }

    removeShape(s) {
        this.shapes = this.shapes.filter(e => e != s);
    }

    // Remove all shapes
    reset() {
        this.shapes = [];
    }

    // Redraw the Viz
    refresh() {
        this.clear();

        if (this.shouldDrawAxes) {
            this.drawAxes();
        }

        for (let s of this.shapes) {
            s.draw(this);
        }
    }

    clear() {
        var ctx = this.node.getContext("2d");
        ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
    }

    drawAxes() {
        this.setColor("black");

        var ctx = this.node.getContext("2d");
        
        // Draw X axis
        this.drawLine(
            this.scaleToCanvas([this.minX, 0]), 
            this.scaleToCanvas([this.maxX, 0])
        );

        // Draw Y axis
        this.drawLine(
            this.scaleToCanvas([0, this.minY]), 
            this.scaleToCanvas([0, this.maxY])
        );
    }

    // Draws a line from [x1, y1] to [x2, y2]. Coordinates are in the canvas space.
    drawLine(pt1, pt2) {
        var ctx = this.node.getContext("2d");

        ctx.beginPath();
        ctx.moveTo.apply(ctx, pt1);
        ctx.lineTo.apply(ctx, pt2);
        ctx.stroke();
    }

    // Draws a circle centered at [x, y] w/ radius r. Coordinates are in the canvas space.
    drawCircle(pt, r) {
        var ctx = this.node.getContext("2d");

        ctx.beginPath();
        ctx.arc(pt[0], pt[1], r, 0, 2 * Math.PI);
        ctx.stroke();
    }

    setColor(color) {
        var ctx = this.node.getContext("2d");
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
    }

    // Takes an [x, y] in the graph space and returns [x, y] in the canvas's space
    scaleToCanvas(pt) {
        const x = pt[0]
        const y = pt[1];

        return [
            (x - this.minX) / (this.maxX - this.minX) * this.getWidth(),
            (this.maxY - y) / (this.maxY - this.minY) * this.getHeight()
        ];
    }

    // Takes an [x, y] in the canvas space and returns [x, y] in the graph space
    scaleToGraph(pt) {
        const x = pt[0]
        const y = pt[1];

        return [
            x * (this.maxX - this.minX) / this.getWidth() + this.minX, 
            -y * (this.maxY - this.minY) / this.getHeight() + this.maxY, 
        ];
    }

    // f is a function that is invoked with x, y in the graph space
    setOnMousemove(f) {
        this.node.onmousemove = (e) => f(this.scaleToGraph([e.offsetX, e.offsetY]));
    }

    // f is a function that is invoked without any arguments.
    setOnMouseleave(f) {
        this.node.onmouseleave = (e) => f();
    }
}

module.exports = Viz;
},{}],6:[function(require,module,exports){
Circle = require("./Circle.js");
DeadReckoningApproximation = require("./DeadReckoningApproximation.js");
LineSegment = require("./LineSegment.js");
Shape = require("./Shape.js");
Viz = require("./Viz.js");
},{"./Circle.js":1,"./DeadReckoningApproximation.js":2,"./LineSegment.js":3,"./Shape.js":4,"./Viz.js":5}]},{},[6]);
