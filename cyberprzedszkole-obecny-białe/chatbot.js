const sendButton = document.getElementById("ai-send");
const inputField = document.getElementById("ai-text");
const messagesDiv = document.getElementById("ai-messages");

sendButton.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", function(e){
    if(e.key === "Enter") sendMessage();
});

async function sendMessage() {
    const text = inputField.value.trim();
    if(!text) return;

    messagesDiv.innerHTML += `<div class='message-user'>${text}</div>`;
    inputField.value = "";
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
        const response = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({message: text})
        });
        const data = await response.json();
        messagesDiv.innerHTML += `<div class='message-ai'>${data.reply}</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch(e) {
        messagesDiv.innerHTML += "<div class='message-ai'>Błąd połączenia z serwerem AI</div>";
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}