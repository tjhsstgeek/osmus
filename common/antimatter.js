(function(exports) {
/**
 * This file contains code required by the client and server for blobs.
 */
var antimatter = function(e, x, y, vx, vy, r, m) {
	blob.call(this, e, x, y, vx, vy, r, m);
	this.type = e.ANTIMATTER;
}
/**
 * Given a json format, construct a blob
 */
antimatter.prototype.create_json = function(params) {
	return new antimatter(params.e, params.x, params.y, params.vx, params.vy,
	                params.r, params.m);
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

exports.antimatter = antimatter;

})(typeof global === "undefined" ? window : exports);
