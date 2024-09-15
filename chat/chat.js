let peerConnections = {};
let dataChannels = {};
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');

// Хранение уникальных идентификаторов пользователей
const userId = generateUniqueId();

// Очистка куки и локального хранилища
function clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.trim().replace(/^.+/, "") + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    });
}

// Генерация уникального идентификатора
function generateUniqueId() {
    return 'user-' + Math.random().toString(36).substr(2, 9);
}

// Создание и управление соединениями WebRTC
function createPeerConnection(id) {
    const peerConnection = new RTCPeerConnection(configuration);
    const dataChannel = peerConnection.createDataChannel('chat');

    dataChannel.onmessage = event => {
        const message = JSON.parse(event.data);
        displayMessage(message.id, message.text);
    };

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            sendSignal({ type: 'candidate', candidate: event.candidate, id });
        }
    };

    peerConnections[id] = peerConnection;
    dataChannels[id] = dataChannel;
}

// Отображение сообщения
function displayMessage(senderId, text) {
    const message = document.createElement('div');
    message.textContent = text;

    // Определяем класс сообщения в зависимости от отправителя
    if (senderId === userId) {
        message.classList.add('user-message'); // Сообщения от текущего пользователя
    } else {
        message.classList.add('other-message'); // Сообщения от других пользователей
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

// Обработка сообщений от другого клиента
function handleSignal(signal) {
    const { type, candidate, id, offer, answer } = signal;

    if (type === 'offer') {
        createPeerConnection(id);
        peerConnections[id].setRemoteDescription(new RTCSessionDescription(offer))
            .then(() => peerConnections[id].createAnswer())
            .then(answer => peerConnections[id].setLocalDescription(answer))
            .then(() => sendSignal({ type: 'answer', answer, id }))
            .catch(console.error);
    } else if (type === 'answer') {
        peerConnections[id].setRemoteDescription(new RTCSessionDescription(answer))
            .catch(console.error);
    } else if (type === 'candidate') {
        peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate))
            .catch(console.error);
    }
}

// Отправка сигналов через WebSocket (пример)
const socket = new WebSocket('wss://your-signaling-server.com');

socket.onmessage = (event) => {
    const signal = JSON.parse(event.data);
    handleSignal(signal);
};

function sendSignal(signal) {
    socket.send(JSON.stringify(signal));
}

// Отправка сообщения
sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        const messageData = { id: userId, text: message };
        Object.values(dataChannels).forEach(channel => {
            channel.send(JSON.stringify(messageData));
        });
        displayMessage(userId, message);
        messageInput.value = '';
    }
});

// Закрытие соединений и очистка данных при закрытии чата
function closeConnection() {
    Object.values(peerConnections).forEach(pc => pc.close());
    peerConnections = {};
    dataChannels = {};
    clearStorage();
}

// Очистка данных и закрытие соединений при загрузке страницы
window.addEventListener('beforeunload', closeConnection);
