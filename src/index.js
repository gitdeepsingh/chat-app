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

let count = 0;
io.on('connection', (socket) => {
    console.log('New Web Socket connection found!');
    count = 0;
    // socket.emit('countUpdated', count);

    socket.on('countIncrement', () => {
        count++;
        // socket.emit('countUpdated', count); // only to this specific connection
        io.emit('countUpdated', count); //emit to all available sockets connection
    })
});

server.listen(PORT, () => {
    console.log(`Server is up on ${PORT}!`);
});