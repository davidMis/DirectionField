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