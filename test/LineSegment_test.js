describe("LineSegment", function() {
    it("should pass this canary test", function() {
        expect(true).to.be.true;
    });

    describe("endpoints()", function() {
        it("should return [-5, 5] when the center is [0, 0], theta is 0 and length is 10", function() {
            var ls = new LineSegment();
            ls.point = [0, 0];
            ls.length = 10;
            ls.pointDefines = "center";

            expect(ls.endpoints()).to.eql([[-5, 0], [5, 0]]);
        });

        it("should return [[-2, 3], [2,3]] when the center is [0, 0], theta is 0 and length is 4", function() {
            var ls = new LineSegment();
            ls.point = [0, 3];
            ls.length = 4;
            ls.pointDefines = "center";

            expect(ls.endpoints()).to.eql([[-2,3], [2,3]]);
        });

        it("should return [[4, 6], [4,10]] when the center is [4, 8], theta is PI/2 and length is 4", function() {
            var ls = new LineSegment();
            ls.theta = Math.PI/2;
            ls.point = [4, 8];
            ls.length = 4;
            ls.pointDefines = "center";

            expect(ls.endpoints()).to.eql([[4,6], [4,10]]);
        });
    });

    describe("withSlope()", function() {
        it("should set theta to 0 when slope is 0", function() {
            var ls = new LineSegment();
            ls.theta = 1;

            ls.withSlope(0);

            expect(ls.theta).to.eql(0);
        });

        it("should set theta to PI/4 when slope is 1", function() {
            var ls = new LineSegment();
            ls.theta = 1;

            ls.withSlope(1);

            expect(ls.theta).to.eql(Math.PI / 4);
        });
    });
});