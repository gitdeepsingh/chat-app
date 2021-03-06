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
        socket.broadcast.to(user.room).emit('receivedMessage', generateMessage('Admin', `${user.username} has joined!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        cb();
    })

    socket.on('sendMessage', (msg, cb) => {
        const user = getUser(socket.id);
        const filter = new LangFilter();
        if (filter.isProfane(msg)) {
            return cb('Profanity not allowed!');
        }


        io.to(user.room).emit('receivedMessage', generateMessage(user.username, msg));
        cb();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('receivedMessage', generateMessage('Admin', `${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    socket.on('sendLocation', (loc, cb) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('receivedLocation', generateMessage(user.username, `https://google.com/maps?q=${loc.latitude},${loc.longitude}`));
        cb();

    })
});

server.listen(PORT, () => {
    console.log(`Server is up on ${PORT}!`);
});