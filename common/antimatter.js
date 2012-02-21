(function(exports) {
/**
 * This file contains code required by the client and server for blobs.
 */
var antimatter = function(e, x, y, vx, vy, r, density) {
	blob.call(this, e, x, y, vx, vy, r, density);
	this.type = e.ANTIMATTER;
}
/**
 * A positive area means area is added, otherwise removed.
 */
antimatter.prototype.transfer_area = function(a) {
	this.r = Math.sqrt(this.r * this.r - a / Math.PI);
}
/**
 * Antimatter always wins.
 */
antimatter.prototype.compare = function(other) {
	if (other.type == this.e.ANTIMATTER) {
		return this.r - other.r;
	}
	return 1;
}
/**
 *
 */
antimatter.prototype.absorb = function(o) {
	if (o.type == this.e.ANTIMATTER) {
		blob.prototype.antimatter.call(this, o);
		return;
	}
	var overlap = this.e.overlap(this, o);
	//
	var dR = overlap * (overlap - 2 * o.r) / (2 * (overlap - this.r - o.r));
	var dr = overlap - dR;
	this.transfer_radius(-dR);
	o.transfer_radius(-dr);
}
exports.antimatter = antimatter;

})(typeof global === "undefined" ? window : exports);
