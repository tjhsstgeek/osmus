(function(exports) {
/**
 * This file contains code required by the client and server for blobs.
 */
var blob = function(e, x, y, vx, vy, r, density) {
	this.type = e.BLOB;
	this.id = e.alloc_id();
	this.e = e;
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.r = r;
	this.m = density;
	//The acceleration of the object
	this.ax = 0;
	this.ay = 0;
}
/**
 * Cleans up after the blob. 
 */
blob.prototype.destroy = function() {
	this.e.free_id(this.id);
}
/**
 * Given a json format, construct a blob.
 */
blob.prototype.create_json = function(params) {
	return new blob(params.e, params.x, params.y, params.vx, params.vy,
	                params.r, params.density);
}
/**
 * Clones (copies) a blob.
 */
blob.prototype.clone = function() {
	return this.create_json(this);
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
//antimatter would use the negative of the area in this case
//antimatter also always wins
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
	if (other.type != this.e.BLOB) {
		return 0;
	}
	return this.r - other.r;
}
/**
 * Returns a JSON representation of a blob.
 */
blob.prototype.toJSON = function() {
	var obj = {};
	obj["type"] = this.type;
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
blob.prototype.step = function(ms) {
	this.x += this.vx * ms / 1000 + this.ax * ms * ms / 2000000;
	this.y += this.vy * ms / 1000 + this.ay * ms * ms / 2000000;
	this.ax = 0;
	this.ay = 0;
};
/**
 * Checks if a blob is still alive.
 */
blob.prototype.alive = function() {
	return this.r > 1;
}
/**
 * Has this blob absorb part of the other blob.
 * This blob was determined to be bigger.
 */
blob.prototype.absorb = function(o) {
	var overlap = this.e.overlap(this, o);
	//console.log("objects", o1, "and", o2, "overlapped", overlap, "pixels");
	//This will calculate the minimum change required for the two blobs
	//to not overlap.
	//This works even if one blob is smaller.
	var dR = (-overlap + o.r - this.r + Math.sqrt(-overlap * overlap + 
	          2 * overlap * o.r + o.r * o.r + 2 * overlap * this.r - 
	          2 * this.r * o.r + this.r * this.r)) / 2;
	var dr = overlap + dR;
	var adiff = 2 * this.r * dR + dR * dR;
	var a_b = this.area();
	this.vx = (a_b * this.vx + adiff * o.vx) / (a_b + adiff);
	this.vy = (a_b * this.vy + adiff * o.vy) / (a_b + adiff);
	this.transfer_radius(dR);
	o.transfer_radius(-dr);
}

exports.blob = blob;

})(typeof global === "undefined" ? window : exports);
