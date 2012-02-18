(function(exports) {

var __blob = new require('../common/blob.js');
var blob = __blob.blob;

var player = function(e, x, y, vx, vy, r, m, client) {
	blob.call(this, e, x, y, vx, vy, r, m);
	this.type = e.PLAYER;
	//Who controls this player
	this.client = client;
}
player.prototype = blob;
player.prototype.constructor = player;
/**
 * Given a json format, construct a player
 */
player.prototype.create_json = function(params) {
	return new player(params.e, params.x, params.y, params.vx, params.vy,
	                params.r, params.m, params.client);
}
/**
 * Convert a player object into JSON.
 */
player.prototype.toJSON = function() {
	var obj = blob.prototype.toJSON.call(this);
	obj.client = this.client;
	return obj;
}
/**
 * If these two blobs were to collide, which one would win.
 * One means this one, negative one means the other one.
 * Zero means inconclusive.
 * The other blob will be asked to compare against this one.
 */
player.prototype.compare = function(other) {
	if (other.type != this.e.BLOB || other.type != this.e.PLAYER) {
		return 0;
	}
	return this.r - other.r;
}

exports.player = player;

})(typeof global === "undefined" ? window : exports);
