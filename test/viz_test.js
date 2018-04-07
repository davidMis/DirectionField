const Viz = require("../src/Viz.js");

describe("Viz", function() {
    it("should pass this canary test", function() {
        expect(true).to.be.true;
    });

    describe("new Viz()", function() {
        it("should throw an error when the first argument is not a DOM Node", function() {
            var call = () => new Viz();

            expect(call).to.throw(Error);
        });

        it("should throw an error when the second and third arguments are not numbers", function() {
            var node = document.createElement("div");

            var call = () => new Viz(node, "1", 2);

            expect(call).to.throw(Error);
        });

        it("should return an initialized Viz object when all arguments are valid", function() {
            var node = document.createElement("div");

            expect(new Viz(node, 400, 400)).to.be.an("object");
        });

        it("should append a canvas as a child to the given parent node", function() {
            var node = document.createElement("div");

            var viz = new Viz(node, 800, 600);

            expect(node.firstChild.nodeName).to.eql("CANVAS");
        });
    });

    describe("scaleToCanvas", function() {
        it("should set the center correctly", function() {
            var node = document.createElement("div");

            var viz = new Viz(node, 200, 200);
            viz.minX = -10;
            viz.maxX = 10;
            viz.minY = -10;
            viz.maxY = 10;

            expect(viz.scaleToCanvas([0,0])).to.eql([100,100])
        });

        it("should set the center correctly", function() {
            var node = document.createElement("div");

            var viz = new Viz(node, 10, 10);
            viz.minX = -10;
            viz.maxX = 10;
            viz.minY = -10;
            viz.maxY = 10;

            expect(viz.scaleToCanvas([0,0])).to.eql([5,5])
        });
    });
});
