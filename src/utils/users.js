const users = [];

addUser = ({ id, username, room }) => {
    // clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required.'
        }
    }

    // check for existing user
    const existingUser = users.find((u) => {
        return u.room === room && u.username === username;
    })

    // validate username
    if (existingUser) {
        return {
            error: "Username is already taken!"
        }
    }

    // store user
    const user = { id, username, room };
    users.push(user);
    return { user }
};

removeUser = id => {
    const index = users.findIndex((u) => u.id === id);

    if (index > -1) {
        return users.splice(index, 1)[0];
    }
}

getUser = id => {
    return users.filter((u) => u.id === id);
}

getUsersInRoom = room => {
    room = room.trim().toLowerCase();
    return users.filter((u) => u.room === room);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
