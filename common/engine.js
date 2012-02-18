(function(exports) {

var engine = function(w, h) {
	//What are the blobs that have some sort of gravity.
	this.grav = new Array();
	//What are the blobs that are affected by gravity.
	this.base = new Array();
	//How many steps should we take in one second.
	//If everything is slow and there are no gravitrons, then this may be 
	//small, otherwise this should be larger to account for timestep errors. 
	this.MS_PER_STEP = 10;
	//The several milliseconds that didn't go into a step
	this.leftover = 0;
	//What is an available id.
	this.avail_id = 1;
	//The width and height
	this.w = w;
	this.h = h;
}

engine.prototype.GRAV_CONSTANT = 0.0000000000667300;
engine.prototype.BLOB = 1;
engine.prototype.PLAYER = 2;
engine.prototype.ATTRACTOR = 3;
engine.prototype.ANTIMATTER = 5;


/**
 * Places an object in bounds.
 */
engine.prototype.reposition = function(o) {
	var maxWidth = this.w - o.r;
	var maxHeight = this.h - o.r;
	if (o.x < o.r) {
		o.x = o.r;
		o.vx = -o.vx;
		//console.log(o, "bounced off left wall");
	} else if (o.y < o.r) {
		o.y = o.r;
		o.vy = -o.vy;
		//console.log(o, "bounced off top wall");
	} else if (o.x > maxWidth) {
		o.x = maxWidth;
		o.vx = -o.vx;
		//console.log(o, "bounced off right wall");
	} else if (o.y > maxHeight) {
		o.y = maxHeight;
		o.vy = -o.vy;
		//console.log(o, "bounced off bottom wall");
	}
}
/**
 * Take only one step.
 * This acts as a helper function to step_multi.
 * This should not be called directly. 
 */
engine.prototype.step = function() {
	for (var a in this.grav) {
		//Figure out the acceleration
		this.grav[a].calc(this.MS_PER_STEP);
	}
	for (var a in this.base) {
		//Now step everything
		this.base[a].step(this.MS_PER_STEP);
	}
	for (var a = 0;a < this.base.length;a++) {
		//Now check for collisions
		var o1 = this.base[a];
		for (var b = a + 1;b < this.base.length;b++) {
			var o2 = this.base[b];
			if (this.intersect(o1, o2)) {
				this.transfer(o1, o2);
				if (!o2.alive()) {
					b--;
				}
				if (!o1.alive()) {
					a--;
					break;
				}
			}
		}
		//Put in bounds
		this.reposition(o1);
	}
}
/**
 * Steps several times.
 * Serves as a helper function to step_time.
 * This should not be called directly. 
 */
engine.prototype.step_multi = function(steps) {
	for (var a = 0;a < steps;a++) {
		this.step();
	}
}
/**
 * Steps several milliseconds into the future.
 */
engine.prototype.step_time = function(ms) {
	this.step_multi((this.leftover + ms) / this.MS_PER_STEP);
	this.leftover = (this.leftover + ms) % this.MS_PER_STEP;
	//this.check_victory();
}
/**
 * Determine the distance squared between two objects.
 */
engine.prototype.distance2 = function(o1, o2) {
	var dx = o1.x - o2.x;
	var dy = o1.y - o2.y;
	return dx * dx + dy * dy;
}
/**
 * Determine the distance between two objects.
 */
engine.prototype.distance = function(o1, o2) {
	return Math.sqrt(this.distance2(o1, o2));
}
/**
 * Returns a new id.
 */
engine.prototype.alloc_id = function() {
	return this.avail_id++;
}
/**
 * Frees an id to be used with the system again.
 */
engine.prototype.free_id = function(id) {
	console.log("id", id, "has been freed");
	//We don't reclaim ids just yet
}
/**
 * Checks if two blobs intersect.
 */
engine.prototype.intersect = function(o1, o2) {
	return this.distance2(o1, o2) < (o1.r + o2.r) * (o1.r + o2.r);
}
/**
 * Checks if two blobs intersect.
 */
engine.prototype.overlap = function(o1, o2) {
	var d = (o1.r + o2.r) - this.distance(o1, o2);
	return (d > 0)?d:0;
}
/**
 * Removes a blob from the engine.
 */
engine.prototype.remove = function(o) {
	var i = this.grav.indexOf(o);
	if (i != -1) {
		this.grav.splice(i, 1);
	}
	var j = this.base.indexOf(o);
	if (j != -1) {
		this.base.splice(j, 1);
	}
}
/**
 * Removes a blob from the engine.
 */
engine.prototype.attach = function(o) {
	if (o.calc) {
		this.grav.push(o);
	}
	if (o.step) {
		this.base.push(o);
	}
}
/**
 * Transfers area between two colliding objects.
 */
engine.prototype.transfer = function(o1, o2) {
	//If three objects collide, there could be strange occurances.
	var diff = o1.compare(o2);
	if (diff == 0) {
		diff = -o2.compare(o1);
		if (diff == 0) {
			console.log("objects", o1, "and", o2, "could not be",
			            "compared");
			console.log("assuming object", o1, "is bigger");
		}
		
	}
	var s = null;
	var d = null;
	if (diff > 0) {
		s = o2;
		d = o1;
	} else {
		s = o1;
		d = o2;
	}
	var overlap = this.overlap(o1, o2);
	//console.log("objects", o1, "and", o2, "overlapped", overlap, "pixels");
	var smaller = s.clone();
	smaller.transfer_radius(-overlap);
	var adiff = s.area() - smaller.area();
	smaller.destroy();
	var a_b = d.area();
	d.vx = (a_b * d.vx + adiff * s.vx) / (a_b + adiff);
	d.vy = (a_b * d.vy + adiff * s.vy) / (a_b + adiff);
	d.transfer_area(adiff);
	s.transfer_area(-adiff);
	//alert the server and client that someone got hurt
	if (!d.alive()) {
		console.log("object", d, "died");
		this.remove(d);
		d.destroy();
	}
	if (!s.alive()) {
		console.log("object", s, "died");
		this.remove(s);
		s.destroy();
	}
}

/**
 * Set up an accurate timer in JS
 */
engine.prototype.timer = function(interval) {
	var lastUpdate = (new Date()).valueOf();
	var ctx = this;
	this.timer = setInterval(function() {
		var date = (new Date()).valueOf();
		ctx.step_time(date - lastUpdate);
		lastUpdate = date;
	}, interval);
};

exports.engine = engine;

})(typeof global === "undefined" ? window : exports);
