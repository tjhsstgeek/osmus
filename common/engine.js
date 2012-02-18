(function(exports) {

var engine = function() {
	//What are the blobs that have some sort of gravity.
	this.grav = new Array();
	//What are the blobs that are affected by gravity.
	this.base = new Array();
	//How many steps should we take in one second.
	//If everything is slow and there are no gravitrons, then this may be 
	//small, otherwise this should be larger to account for timestep errors. 
	this.MS_PER_STEP = 10;
	this.GRAV_CONSTANT = 0.0000000000667300;
}

/**
 * Take only one step.
 * This must be called if gravitational blobs exist.
 */
engine.prototype.step = function() {
	for (var a in this.grav) {
		//Figure out the acceleration
		this.grav[a].calc(this, this.MS_PER_STEP);
	}
	for (var a in this.base) {
		//Now step everything
		this.base[a].step(this, this.MS_PER_STEP);
	}
	for (var a in this.base) {
		//Now check for collisions
		for (var b in this.base) {
			if (this.collide(this.base[a], this.base[b]) {
				this.transfer(this.base[a], this.base[b]);
			}
		}
		//Put in bounds
		this.reposition(this.base[a]);
	}
}

engine.prototype.step_multi = function(steps) {
	for (var a = 0;a < steps;a++) {
		this.step();
	}
}
engine.prototype.step_time = function(ms) {
	this.step_multi(ms / this.MS_PER_STEP);
}
/**
 * Determine the distance squared between two objects.
 */
engine.prototype.distance2 = function(o1, o2) {
	return o1.x * o1.x + o1.y * o1.y;
}
/**
 * Determine the distance between two objects.
 */
engine.prototype.distance = function(o1, o2) {
	return Math.sqrt(this.distance2(o1, o2));
}

})(typeof global === "undefined" ? window : exports);
