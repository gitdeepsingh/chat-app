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

io.on('connection', (socket) => {
    console.log('New Web Socket connection found!');
    socket.emit('receivedMessage', 'Welcome!')
    socket.broadcast.emit('receivedMessage', 'A new user has joined')
    socket.on('sendMessage', (msg) => {
        io.emit('receivedMessage', msg);
    })

    socket.on('disconnect', () => {
        io.emit('receivedMessage', 'A user has seft!');
    })
});

server.listen(PORT, () => {
    console.log(`Server is up on ${PORT}!`);
});