const socket = io();

const $messageForm = document.querySelector('#messageForm');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormBtn = $messageForm.querySelector('button');
const $locationBtn = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;

socket.on('receivedMessage', (message) => {
    console.log('message===>', message);
    const html = Mustache.render(messageTemplate, {
        message
    });
    console.log('html: ', html);
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $messageFormBtn.setAttribute('disabled', 'disabled');
    const input = e.target.elements.message;
    const msg = input.value;

    socket.emit('sendMessage', msg, (err) => {
        $messageFormBtn.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (err) {
            return console.log(err);
        }
        console.log('Message delivered successfully!');
    });
})

$locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        window.alert('Gelocation not supported by your browser!');
    }
    $locationBtn.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (err) => {
            $locationBtn.removeAttribute('disabled');
            if (err) {

            }
            console.log('Location sent!');
        })
    })
})