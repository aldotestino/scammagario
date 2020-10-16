const express = require('express');
const socket_io = require('socket.io');

const players = new Map();

const app = express();

app.use(express.static('dist'));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));

const io = socket_io(server);

function updateGame() {
  io.sockets.emit('gameupdate', Array.from(players.values()));
}

setInterval(updateGame, 33);

io.sockets.on('connection', socket => {
  console.log(`Client connected with id: ${socket.id}`);

  socket.on('clientstart', data => {
    data.id = socket.id;
    players.set(socket.id, data);
    console.log(players);
  });

  socket.on('clientupdate', data => {
    const p = players.get(socket.id);
    if (!p) return;
    p.x = data.x;
    p.y = data.y;
    p.r = data.r;
  });

  /*socket.on('eaten', eatenId => {
    players.delete(eatenId);
  });*/

  socket.on('disconnect', () => {
    console.log(`Client disconnected with id: ${socket.id}`);
    players.delete(socket.id);
    console.log(players);
  });
});

