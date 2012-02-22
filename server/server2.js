var io = require('socket.io').listen(5050);
var __engine = new require('../common/engine.js');
var engine = __engine.engine;

var __blob = new require('../common/blob.js');
var blob = __blob.blob;

var __player = new require('../common/player.js');
var player = __player.player;

var __o_attractor = new require('../common/o_attractor.js');
var o_attractor = __o_attractor.o_attractor;

var level = new require('./level.js');

var w = 640;
var h = 480;

var game = new engine(w, h);

/*for (var a = 0;a < 10;a++) {
	var b = new blob(game, Math.random() * 640, Math.random() * 480,
	                 Math.random() * 10 - 5, Math.random() * 10 - 5,
	                 Math.random() * 10, 1);
	
	game.attach(b);
}*/
var count = 50;
for (var a = 0;a < count * 2;a++) {
	var b = new blob(game, 200 * Math.cos(Math.PI * a / count) + 320, 200 * Math.sin(Math.PI * a / count) + 240,
	                 -23 * Math.sin(Math.PI * a / count), 23 * Math.cos(Math.PI * a / count),
	                 Math.random() * 10 + 1, 1);
	game.attach(b);
}
for (var a = 0;a < count * 2;a++) {
	var b = new blob(game, 100 * Math.cos(Math.PI * a / count) + 320, 100 * Math.sin(Math.PI * a / count) + 240,
	                 -33 * Math.sin(Math.PI * a / count), 33 * Math.cos(Math.PI * a / count),
	                 Math.random() * 10 + 1, 1);
	game.attach(b);
}

var attr = new o_attractor(game, 320, 240, 0, 0, 40, 1000000000000);
game.attach(attr);

game.timer(10);

io.sockets.on('connection', function(socket) {
	var id = null;
	socket.emit('start', {
		state: game.save()
	});
	// Client joins the game as a player
	socket.on('join', function(data) {
		console.log('recv join', data);
		var p = new player(game, Math.random() * 640,
		                   Math.random() * 480,
	                           Math.random() * 10 - 5,
		                   Math.random() * 10 - 5,
	                           20, 1, socket);
		game.attach(p);
		//Save the id
		id = p.id;
		data.id = p.id;
		// Broadcast that client has joined
		socket.broadcast.emit('join', data);
		data.isme = true;
		socket.emit('join', data);
		// Push game state just in case
		var s = game.save();
		socket.broadcast.emit('state', {
			state: s
		});
		socket.emit('state', {
			state: s
		});
	});
	// Client shoots
	socket.on('shoot', function(data) {
		console.log('recv shoot', data);
		// Check that the player is still alive
		var play = game.blobs[id];
		if (!play || play.client != socket) {
			return;
		}
		play.shoot(data.direction, 50, 0.01, 0.2);
		var s = game.save();
		socket.broadcast.emit('state', {
			state: s
		});
		socket.emit('state', {
			state: s
		});
	});
});
