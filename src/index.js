const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const LangFilter = require('bad-words');
const { generateMessage } = require('./utils/messages');
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3010;
const publicDirPath = path.join(__dirname, '../public');

app.use(express.static(publicDirPath));

io.on('connection', (socket) => {
    console.log('New Web Socket connection found!');

    socket.on('joinRoom', (options, cb) => {
        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) {
            return cb(error);
        }

        socket.join(user.room);

        socket.emit('receivedMessage', generateMessage('Welcome!'));
        socket.broadcast.to(user.room).emit('receivedMessage', generateMessage(`${user.username} has joined!`));

        cb();
    })
    socket.on('sendMessage', (msg, cb) => {
        const filter = new LangFilter();
        if (filter.isProfane(msg)) {
            return cb('Profanity not allowed!');
        }
        io.emit('receivedMessage', generateMessage(msg));
        cb();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) io.to(user.room).emit('receivedMessage', generateMessage(`${user.username} has left!`));
    })

    socket.on('sendLocation', (loc, cb) => {
        io.emit('receivedLocation', generateMessage(`https://google.com/maps?q=${loc.latitude},${loc.longitude}`));
        cb();

    })
});

server.listen(PORT, () => {
    console.log(`Server is up on ${PORT}!`);
});