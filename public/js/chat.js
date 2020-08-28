const socket = io();

//Elements
const $messageForm = document.querySelector('#messageForm');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormBtn = $messageForm.querySelector('button');
const $locationBtn = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoScroll = () => {
    // New message
    const $newMessage = $messages.lastElementChild;

    // get height the New message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight - newMessageMargin;

    // visible height
    const visibleHeight = $messages.offsetHeight;

    // height of messages container
    const contentHeight = $messages.scrollHeight;

    //distance scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (contentHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }

}

socket.on('receivedMessage', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        time: moment(message.createdAt).format('hh:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
})

socket.on('receivedLocation', (message) => {
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        locationURL: message.text,
        time: moment(message.createdAt).format('hh:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebar.innerHTML = html;
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.elements.message;
    const msg = input.value;
    if (msg.trim()) {
        $messageFormBtn.setAttribute('disabled', 'disabled');
        socket.emit('sendMessage', msg, (err) => {
            $messageFormBtn.removeAttribute('disabled');
            $messageFormInput.value = '';
            $messageFormInput.focus();
            if (err) {
                return console.log(err);
            }
        });
    }
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
        })
    })
})

socket.emit('joinRoom', { username, room }, (err) => {
    if (err) {
        window.alert(err);
        location.href = '/'
    }
})