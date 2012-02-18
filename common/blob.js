(function(exports) {
/**
 * This file contains code required by the client and server for blobs.
 */
var blob = function(x, y, vx, vy, r, m) {
	this.type = engine.BLOB;
	this.id = engine.alloc_id();
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.r = r;
	this.m = m;
	//The acceleration of the object, used by 
	this.ax = 0;
	this.ay = 0;
}
/**
 * Cleans up after the blob. 
 */
blob.prototype.destroy = function() {
	engine.free_id(this.id);
}
/**
 * Given a json format, construct a blob
 */
blob.prototype.create_json = function(params) {
	return new blob(params.x, params.y, params.vx, params.vy, params.r,
	                params.m);
}
blob.prototype.clone = function() {
	return blob.create_json(this);
}
/**
 * Calculate the area of this blob.
 */
blob.prototype.area = function() {
	return Math.PI * this.r * this.r;
}
/**
 * A positive radius means radius is added, otherwise removed.
 */
blob.prototype.transfer_radius = function(r) {
	this.r += r;
}
/**
 * A positive area means area is added, otherwise removed.
 */
blob.prototype.transfer_area = function(a) {
	this.r = Math.sqrt(this.r * this.r + a / Math.PI);
}
/**
 * If these two blobs were to collide, which one would win.
 * One means this one, negative one means the other one.
 * Zero means inconclusive.
 * The other blob will be asked to compare against this one.
 */
blob.prototype.compare = function(other) {
	if (other.type != engine.BLOB) {
		return 0;
	}
	return this.r - other.r;
}
/**
 * Returns a JSON representation of a blob.
 */
blob.prototype.toJSON = function() {
	var obj = {};
	obj["type"] = this.blob;
	obj["x"] = this.x;
	obj["y"] = this.y;
	obj["vx"] = this.vx;
	obj["vy"] = this.vy;
	obj["r"] = this.r;
	obj["m"] = this.m;
	return obj;
}
blob.prototype.calc = null;
/**
 * Determines where the blob will be after a step.
 */
blob.prototype.step = function(e, ms) {
	this.x += this.vx * ms / 1000 + this.ax * ms / 2000000;
	this.y += this.vy * ms / 1000 + this.ay * ms / 2000000;
	this.ax = 0;
	this.ay = 0;
};

exports.blob = blob;

})(typeof global === "undefined" ? window : exports);
