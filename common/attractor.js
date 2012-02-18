(function(exports) {
/**
 * This file contains code required by the client and server for blobs.
 */
var attractor = function(e, x, y, vx, vy, r, m) {
	blob.call(this, e, x, y, vx, vy, r, m);
	this.type = e.ATTRACTOR;
}
/**
 * Given a json format, construct a blob
 */
attractor.prototype.create_json = function(params) {
	return new attractor(params.e, params.x, params.y, params.vx, params.vy,
	                params.r, params.m);
}
/**
 * If these two blobs were to collide, which one would win.
 * One means this one, negative one means the other one.
 * Zero means inconclusive.
 * The other blob will be asked to compare against this one.
 */
attractor.prototype.compare = function(other) {
	if (other.type == this.e.ANTIMATTER) {
		return 0;
	}
	return this.r - other.r;
}
/**
 * Calculate the forces this creates on other blobs.
 */
attractor.prototype.calc = function(ms) {
	for (var a in this.e.base) {
		var d = this.e.distance2(e.base[a], this);
		var force = e.GRAV_CONSTANT * this.m * this.e.base[a].m / d;
		var ex = (this.e.base[a].x - this.x) / d;
		var ey = (this.e.base[a].y - this.y) / d;
		this.ax += ex * force / this.m;
		this.ay += ey * force / this.m;
		this.e.base[a].ax += ex * force / this.e.base[a].m;
		this.e.base[a].ay += ey * force / this.e.base[a].m;
	}
}

exports.attractor = attractor;

})(typeof global === "undefined" ? window : exports);
