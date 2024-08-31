document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');

    const modal = document.getElementById('indicator-modal');
    const closeButton = document.querySelector('.close-button');
    const indicatorButtons = document.querySelectorAll('.indicator-button');

    // Open modal on initial load
    openModal();

    // Event listeners
    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage('user', message);
            userInput.value = '';
            sendToBackend(message);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    closeButton.addEventListener('click', closeModal);

    indicatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const feeling = button.getAttribute('data-feeling');
            addMessage('user', feeling);
            closeModal();
            sendToBackend(feeling);
        });
    });

    // Functions
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = text;

        messageDiv.appendChild(messageContent);
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function sendToBackend(feeling) {
        fetch('/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ feeling: feeling })
        })
        .then(response => response.json())
        .then(data => {
            addMessage('bot', data.response);
        })
        .catch(error => {
            console.error('Error:', error);
            addMessage('bot', 'Sorry, something went wrong. Please try again.');
        });
    }

    function openModal() {
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});
