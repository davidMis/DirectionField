class LineSegment {
    constructor() {
        this.point = [0, 0];
        this.theta = 0;
        this.length = 0;
        this.pointDefines = "start"; 
    }

    // converts the slope given to an appropriate theta
    withSlope(m) {
        this.theta = Math.atan(m);
    }

    // returns endpoints [[x1,y1], [x2,y2]] in the graph's space
    // TODO: Is it cleaner to make this polymorphic?
    endpoints() {
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
}
