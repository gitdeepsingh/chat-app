const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const LangFilter = require('bad-words');

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
    socket.on('sendMessage', (msg, cb) => {
        const filter = new LangFilter();
        if (filter.isProfane(msg)) {
            return cb('Profanity not allowed!');
        }
        io.emit('receivedMessage', msg);
        cb();
    })

    socket.on('disconnect', () => {
        io.emit('receivedMessage', 'A user has seft!');
    })

    socket.on('sendLocation', (loc, cb) => {
        io.emit('receivedMessage', `https://google.com/maps?q=${loc.latitude},${loc.longitude}`);
        cb();

    })
});

server.listen(PORT, () => {
    console.log(`Server is up on ${PORT}!`);
});