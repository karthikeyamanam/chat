// Connect to backend (auto-detect localhost or deployed URL)
const socket = io(
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://your-chat-app.onrender.com"
);

let room, username;

// === Join Room ===
document.getElementById("join").onclick = () => {
  username = document.getElementById("username").value.trim();
  room = document.getElementById("room").value.trim();

  if (!username || !room) {
    alert("Please enter both Username and Room Code!");
    return;
  }

  socket.emit("join-room", room, username);
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "flex";
  document.getElementById("room-name").innerText = `Room: ${room}`;
};

// === Send Message ===
document.getElementById("send").onclick = sendMessage;
document.getElementById("msg").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const msg = document.getElementById("msg").value.trim();
  if (!msg) return;

  addMessage(`You: ${msg}`, "you");
  socket.emit("send-message", room, { username, msg });
  document.getElementById("msg").value = "";
}

// === Receive Events ===
socket.on("receive-message", (data) => {
  addMessage(`${data.username}: ${data.msg}`, "peer");
});

socket.on("user-joined", (name) => {
  addMessage(`🔔 ${name} joined the chat`, "info");
});

socket.on("user-left", (name) => {
  addMessage(`🔔 ${name} left the chat`, "info");
});

// === Add Message to UI ===
function addMessage(msg, type = "peer") {
  const div = document.createElement("div");
  div.classList.add("msg", type);

  // Animation for message appearance
  div.style.opacity = 0;
  div.textContent = msg;
  document.getElementById("messages").appendChild(div);

  setTimeout(() => (div.style.opacity = 1), 50);

  // Auto scroll to bottom
  const messages = document.getElementById("messages");
  messages.scrollTop = messages.scrollHeight;
}
