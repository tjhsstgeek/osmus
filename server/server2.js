var io = require('socket.io').listen(5050);
var __engine = new require('../common/engine.js');
var engine = __engine.engine;

var __blob = new require('../common/blob.js');
var blob = __blob.blob;

var level = new require('./level.js');

var w = 640;
var h = 480;

var game = new engine(w, h);

for (var a = 0;a < 100;a++) {
	var b = new blob(game, Math.random() * 640, Math.random() * 480,
	                 Math.random() * 10 - 5, Math.random() * 10 - 5,
	                 Math.random() * 10, 1);
	
	game.attach(b);
}

game.timer(10);

io.sockets.on('connection', function(socket) {
	
});
