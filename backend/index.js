require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const socketio = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());

// socket
io.on('connect', (socket) => {
  socket.on('invitation-accepted', (data, callback) => {
    socket.broadcast.emit('invitation-accepted', data);
  });

  socket.on('doc-shared-with', (data, callback) => {
    socket.broadcast.emit('doc-shared-with', data);
  });

  socket.on('doc-updating', (data, callback) => {
    socket.broadcast.emit('doc-updating', data);
  });
});

require('./startup/db')();

// load routes
require('./startup/routes')(app);

const PORT = process.env.APP_PORT || 3000;
server.listen(PORT, () => console.log(`API Server Started on port ${PORT}`));
