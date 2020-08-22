const socket = io();

socket.on('countUpdated', (count) => {
    document.querySelector('#countBox').innerHTML = count;
})

document.querySelector('#increment').addEventListener('click', () => {
    console.log('CLICKED');
    socket.emit('countIncrement');
})
