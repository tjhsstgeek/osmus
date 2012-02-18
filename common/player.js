(function(exports) {

var player = function(x, y, vx, vy, r, m, client) {
	blob.call(this, x, y, vx, vy, r, m);
	this.type = engine.PLAYER;
	//Who controls this player
	this.client = client;
}
player.prototype = blob;
player.prototype.constructor = player;
/**
 * Given a json format, construct a player
 */
blob.prototype.create_json = function(params) {
	return new blob(params.x, params.y, params.vx, params.vy, params.r,
	                params.m, params.client);
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
blob.prototype.compare = function(other) {
	if (other.type != engine.BLOB || other.type != engine.PLAYER) {
		return 0;
	}
	return this.r - other.r;
}

exports.player = player;

})(typeof global === "undefined" ? window : exports);
