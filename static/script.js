const chatBox = document.querySelector(".chat-box");
const input = document.querySelector(".chat-input input");
const sendButton = document.querySelector(".send-button");


// Add a message to the chat
function addMessage(message, type) {

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");

    const sender = document.createElement("span");
    sender.classList.add("sender");

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    if (type === "user") {

        messageDiv.classList.add("user-message");

        sender.textContent = "You";
        bubble.textContent = message;

    } else {

        const avatar = document.createElement("div");
        avatar.classList.add("avatar", "ai-small");
        avatar.textContent = "✦";

        sender.textContent = "Nova AI";
        bubble.textContent = message;

        messageDiv.appendChild(avatar);
    }

    messageContent.appendChild(sender);
    messageContent.appendChild(bubble);

    messageDiv.appendChild(messageContent);

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}


// Send message to Flask
async function sendMessage() {

    const message = input.value.trim();

    if (message === "") {
        return;
    }

    // Show user's message
    addMessage(message, "user");

    // Clear input
    input.value = "";


    // Create typing indicator
    const typingMessage = document.createElement("div");

    typingMessage.classList.add("message", "bot-message");
    typingMessage.id = "typing-message";


    // AI avatar
    const typingAvatar = document.createElement("div");

    typingAvatar.classList.add("avatar", "ai-small");
    typingAvatar.textContent = "✦";


    // Message content
    const typingContent = document.createElement("div");

    typingContent.classList.add("message-content");


    // Sender
    const typingSender = document.createElement("span");

    typingSender.classList.add("sender");
    typingSender.textContent = "Nova AI";


    // Animated dots
    const typingBubble = document.createElement("div");

    typingBubble.classList.add("bubble");

    typingBubble.innerHTML = `
        <div class="typing">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;


    // Build typing message
    typingContent.appendChild(typingSender);
    typingContent.appendChild(typingBubble);

    typingMessage.appendChild(typingAvatar);
    typingMessage.appendChild(typingContent);

    chatBox.appendChild(typingMessage);

    chatBox.scrollTop = chatBox.scrollHeight;


    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        const data = await response.json();


        // Remove typing animation
        typingMessage.remove();


        // Show AI response
        if (data.response) {

            addMessage(data.response, "bot");

        } else {

            addMessage(
                "Sorry, I couldn't generate a response.",
                "bot"
            );

        }

    } catch (error) {

        console.error(error);


        // Remove typing animation
        typingMessage.remove();


        // Show error
        addMessage(
            "I couldn't connect to the server. Please try again.",
            "bot"
        );

    }
}


// Send button
sendButton.addEventListener("click", sendMessage);


// Press Enter to send
input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});


// Suggested prompt buttons
function useSuggestion(text) {

    input.value = text;

    input.focus();

    sendMessage();

}