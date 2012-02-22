(function(exports) {

if (exports.blob) {
	var blob = exports.blob;
	var extend = exports.extend;
} else {
	var __blob = new require('./blob.js');
	var blob = __blob.blob;
	var extend = __blob.extend;
}

var player = function(e, x, y, vx, vy, r, density, client) {
	blob.call(this, e, x, y, vx, vy, r, density);
	this.type = e.PLAYER;
	//Who controls this player
	this.client = client;
}
extend(blob, player);
//Now copy the functions
/**
 * Cleans up after the blob. 
 */
player.prototype.destroy = function() {
	this.e.free_id(this.id);
	console.log("player of blob", this.id, "died");
	this.client.emit("leave");
}
/**
 * Given a json format, construct a player
 */
player.prototype.load = function(params, e) {
	return new player(e, params.x, params.y, params.vx, params.vy,
	                params.r, params.density, null);
}
/**
 * If these two blobs were to collide, which one would win.
 * One means this one, negative one means the other one.
 * Zero means inconclusive.
 * The other blob will be asked to compare against this one.
 */
player.prototype.compare = function(other) {
	if (other.type != this.e.BLOB && other.type != this.e.PLAYER) {
		return 0;
	}
	return this.r - other.r;
}
/**
 * Fires a small blob.
 * v is the velocity of the bullet.
 * a is the proportion of area to fire.
 * m is the energy multiplier.
 */
player.prototype.shoot = function(dir, v, a, m) {
	var ex = Math.cos(dir);
	var ey = Math.sin(dir);
	// Create the new blob.
	var R = this.r * Math.sqrt(1 - a);
	var r = this.r * Math.sqrt(a);
	var b = new blob(this.e, this.x + (R + r) * ex, this.y + (R + r) * ey,
	                 this.vx + ex * v, this.vy + ey * v, r, 1);
	this.e.attach(b);
	// Affect the player's velocity, depending on angle, speed and size.
	var dx = -(a * ex * v) / ((1 - a) * m);
	var dy = -(a * ey * v) / ((1 - a) * m);
	//console.log(dx, "and", dy, "blob", this.vx + ex * v, "and", this.vy + ey * v);
	this.vx += dx;
	this.vy += dy;
	// Affect blob and player radius.
	this.r = R;
}

exports.player = player;

})(typeof global === "undefined" ? window : exports);
