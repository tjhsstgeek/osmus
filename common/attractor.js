(function(exports) {
/**
 * This file contains code required by the client and server for blobs.
 */
var attractor = function(x, y, vx, vy, r, m) {
	blob.call(this, x, y, vx, vy, r, m);
	this.type = engine.ATTRACTOR;
}
/**
 * Given a json format, construct a blob
 */
attractor.prototype.create_json = function(params) {
	return new blob(params.x, params.y, params.vx, params.vy, params.r,
	                params.m);
}
/**
 * If these two blobs were to collide, which one would win.
 * One means this one, negative one means the other one.
 * Zero means inconclusive.
 * The other blob will be asked to compare against this one.
 */
attractor.prototype.compare = function(other) {
	if (other.type != engine.BLOB) {
		return 0;
	}
	return this.r - other.r;
}
/**
 * Calculate the forces this creates on other blobs.
 */
attractor.prototype.calc = function(e, ms) {
	for (var a in e.base) {
		var d = e.distance2(e.base[a], this);
		var force = e.GRAV_CONSTANT * this.m * e.base[a].m / d;
		var ex = (e.base[a].x - this.x) / d;
		var ey = (e.base[a].y - this.y) / d;
		this.ax += ex * force / this.m;
		this.ay += ey * force / this.m;
		e.base[a].ax += ex * force / e.base[a].m;
		e.base[a].ay += ey * force / e.base[a].m;
	}
}

exports.blob = attractor;

})(typeof global === "undefined" ? window : exports);
