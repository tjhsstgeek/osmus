(function(exports) {
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/**
 * Canvas-based renderer
 */
var CanvasRenderer = function(game) {
	this.game = game;
	this.swap = game;
	this.zoom_x = 0;
	this.zoom_y = 0;
	this.zoom_m = 1;
	this.canvas = document.getElementById('canvas');
	this.context = this.canvas.getContext('2d');
};

CanvasRenderer.prototype.render = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	var objects = this.game.base;
	// Render the game state
	for (var i in objects) {
		var o = objects[i];
		if (o.dead) {
			// TODO: render animation.
			if (o.type == this.game.PLAYER) {
				console.log('player', o.id, 'died');
			}
		}
		if (o.r > 0) {
			this.renderObject_(o);
		}
	}
	this.game = this.swap;
	var ctx = this;
	requestAnimFrame(function() {
		ctx.render.call(ctx);
	});
};

CanvasRenderer.prototype.renderObject_ = function(obj) {
	var ctx = this.context;
	ctx.fillStyle = (obj.type == this.game.PLAYER ? 'green' : 'red');
	if (this.game.blobs[playerId]) {
		var diff = this.game.blobs[playerId].compare(obj);
		if (diff == 0) {
			diff = -obj.compare(this.game.blobs[playerId]);
		}
		if (diff > 0) {
			ctx.fillStyle = 'blue';
		}
	}
	ctx.beginPath();
	ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI, true);
	ctx.closePath();
	ctx.fill();
	if (obj.type == this.game.PLAYER) {
		ctx.font = "8pt monospace";
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.fillText(obj.id, obj.x, obj.y);
	}

};

exports.Renderer = CanvasRenderer;

})(window);
