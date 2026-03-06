const chatHistory = document.getElementById('chat-history');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');

let isRecording = false;
let mediaRecorder;
let audioChunks = [];

function scrollToBottom() {
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function appendMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    if (!isUser) {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'bot-icon';
        iconDiv.textContent = '✨';
        msgDiv.appendChild(iconDiv);
    }

    const content = document.createElement('div');
    content.className = 'message-content';
    // basic text formatting
    content.innerHTML = text.replace(/\n/g, '<br>');
    msgDiv.appendChild(content);

    chatHistory.appendChild(msgDiv);
    scrollToBottom();
}

function showTyping() {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot-message';
    msgDiv.id = 'typing-indicator';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'bot-icon';
    iconDiv.textContent = '✨';
    msgDiv.appendChild(iconDiv);

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        typingDiv.appendChild(span);
    }

    msgDiv.appendChild(typingDiv);
    chatHistory.appendChild(msgDiv);
    scrollToBottom();
}

function removeTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, true);
    userInput.value = '';
    sendBtn.disabled = true;
    showTyping();

    try {
        const response = await fetch(`/chat?prompt=${encodeURIComponent(text)}`, {
            method: 'POST',
        });
        const data = await response.json();
        removeTyping();
        appendMessage(data.response, false);
    } catch (err) {
        removeTyping();
        appendMessage("Error: Could not reach backend.", false);
    } finally {
        sendBtn.disabled = false;
        userInput.focus();
    }
});

micBtn.addEventListener('click', async () => {
    if (isRecording) {
        mediaRecorder.stop();
        micBtn.classList.remove('recording');
        isRecording = false;
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('file', audioBlob, 'voice.wav');

            showTyping();

            try {
                const response = await fetch('/voice', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                removeTyping();

                if (data.user_text) {
                    appendMessage(`${data.user_text}`, true);
                }
                if (data.bot_text) {
                    appendMessage(data.bot_text, false);
                }

                if (data.audio_base64) {
                    const audio = new Audio("data:audio/mp3;base64," + data.audio_base64);
                    audio.play();
                }
            } catch (err) {
                removeTyping();
                appendMessage("Error: Could not process voice.", false);
            }

            sendBtn.disabled = false;
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        micBtn.classList.add('recording');
        isRecording = true;
        sendBtn.disabled = true;
    } catch (err) {
        alert("Microphone access is required.");
    }
});

// Theme toggling logic
const themeBtn = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');

// Check system preference on load
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-theme');
    themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
}

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
    } else {
        themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
    }
});
