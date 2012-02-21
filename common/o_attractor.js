(function(exports) {
/**
 * This file contains code required by the client and server for attractors.
 * 
 */
var o_attractor = function(e, x, y, vx, vy, r, density) {
	blob.call(this, e, x, y, vx, vy, r, density);
	this.type = e.O_ATTRACTOR;
}
/**
 * Given a json format, construct a blob
 */
o_attractor.prototype.create_json = function(params) {
	return new attractor(params.e, params.x, params.y, params.vx, params.vy,
	                params.r, params.density);
}
/**
 * If these two blobs were to collide, which one would win.
 * One means this one, negative one means the other one.
 * Zero means inconclusive.
 * The other blob will be asked to compare against this one.
 */
o_attractor.prototype.compare = function(other) {
	if (other.type == this.e.ANTIMATTER) {
		return 0;
	}
	return this.r - other.r;
}
/**
 * Calculate the forces this creates on other blobs.
 */
o_attractor.prototype.calc = function(ms) {
	var m = this.density * this.r * this.r;
	for (var a in this.e.base) {
		var d = this.e.distance2(e.base[a], this);
		var force = e.GRAV_CONSTANT * m / d;
		var ex = (this.e.base[a].x - this.x) / sqrt(d);
		var ey = (this.e.base[a].y - this.y) / sqrt(d);
		this.ax += ex * force;
		this.ay += ey * force;
	}
}

exports.o_attractor = o_attractor;

})(typeof global === "undefined" ? window : exports);
