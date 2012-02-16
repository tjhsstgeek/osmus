/**
 * This file contains code required by the client and server for blobs.
 */
function blob(x, y, vx, vy, r) {
	this.type = Game.BLOB;
	this.id = Game.id()
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.r = r;
}
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
	if (other.type != Game.BLOB) {
		return 0;
	}
	return this.r - other.r;
}
/**
 * If a specific type of blob needs to do something every step.
 * Attractors and repellers use this as well as any AI.
 */
blob.prototype.game_step = null;
/**
 * Returns a JSON representation of a blob.
 */
blob.prototype.toJSON = function() {
	var obj = {};
	obj["type"] = this.blob;
	obj["x"] = this.x;
	obj["x"] = this.y;
	obj["vx"] = this.vx;
	obj["vy"] = this.vy;
	obj["r"] = this.r;
	return obj;
}
/**
 * Determines where the blob will be after a delta timestep.
 */
Blob.prototype.compute_state = function(delta) {
	var b = this.clone();
	b.x += this.vx * delta / 10;
	b.y += this.vy * delta / 10;
	return b;
};
