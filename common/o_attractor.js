(function(exports) {

if (exports.blob) {
	var blob = exports.blob;
	var extend = exports.extend;
} else {
	var __blob = new require('./blob.js');
	var blob = __blob.blob;
	var extend = __blob.extend;
}

/**
 * This file contains code required by the client and server for attractors.
 * 
 */
var o_attractor = function(e, x, y, vx, vy, r, density) {
	blob.call(this, e, x, y, vx, vy, r, density);
	this.type = e.O_ATTRACTOR;
}
extend(blob, o_attractor);
/**
 * Given a json format, construct a o_attractor.
 */
o_attractor.prototype.load = function(params, e) {
	return new o_attractor(e, params.x, params.y, params.vx, params.vy,
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
		if (this.e.base[a] == this)
			continue;
		var d = this.e.distance2(this.e.base[a], this);
		var force = this.e.GRAV_CONSTANT * m / d;
		var ex = (this.e.base[a].x - this.x) / Math.sqrt(d);
		var ey = (this.e.base[a].y - this.y) / Math.sqrt(d);
		this.e.base[a].ax -= ex * force;
		this.e.base[a].ay -= ey * force;
		//console.log(this.e.base[a].ax, this.e.base[a].ay);
	}
}

exports.o_attractor = o_attractor;

})(typeof global === "undefined" ? window : exports);
