class Shape {
    constructor() {
        this.color = "black";
    }

    withColor(color) {
        this.color = color;
        return this;
    }
}

module.exports = Shape;