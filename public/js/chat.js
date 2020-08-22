const socket = io();

socket.on('receivedMessage', (message) => {
    console.log('message===>', message);
})

document.querySelector('#messageForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.elements.message;
    const msg = input.value;

    socket.emit('sendMessage', msg);
})