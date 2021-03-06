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