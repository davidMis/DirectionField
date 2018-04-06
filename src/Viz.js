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
        this.lineSegments = [];
    }

    getWidth() {
        return this.node.width;
    }

    getHeight() {
        return this.node.height;
    }

    addLineSegment(ls) {
        this.lineSegments.push(ls);
    }

    reset() {
        this.lineSegments = [];
    }

    refresh() {
        this.clear();

        if (this.shouldDrawAxes) {
            this.drawAxes();
        }
    }

    clear() {
        var ctx = this.node.getContext("2d");
        ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
    }

    drawAxes() {
        var ctx = this.node.getContext("2d");
        
        // Draw X axis
        this.drawLine(this.scaledPos(this.minX, 0), this.scaledPos(this.maxX, 0));

        // Draw Y axis
        this.drawLine(this.scaledPos(0, this.minY), this.scaledPos(0, this.maxY));

        // Draw line segments
        for (let ls of this.lineSegments) {
            let endpoints = ls.endpoints();
            this.drawLine(
                this.scaledPos.apply(this, endpoints[0]), 
                this.scaledPos.apply(this, endpoints[1]), 
            );
        }
    }

    // draws a line from [x1, y1] to [x2, y2]. Coordinates are in the canvas space
    drawLine(pt1, pt2) {
        var ctx = this.node.getContext("2d");

        ctx.beginPath();
        ctx.moveTo.apply(ctx, pt1);
        ctx.lineTo.apply(ctx, pt2);
        ctx.stroke();
    }

    // takes an x, y in the graph space and returns [x, y] in the canvas's space
    scaledPos(x, y) {
        return [
            (x - this.minX) / (this.maxX - this.minX) * this.getWidth(),
            (this.maxY - y) / (this.maxY - this.minY) * this.getHeight()
        ];
    }
}