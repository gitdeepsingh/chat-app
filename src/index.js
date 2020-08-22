const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3010;
const publicDirPath = path.join(__dirname, '../public');

app.use(express.static(publicDirPath));

io.on('connection', () => {
    console.log('New Web Socket connection found!');
});

server.listen(PORT, () => {
    console.log(`Server is up on ${PORT}!`);
});