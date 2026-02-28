(function () {
  const config = window.LinguaBotConfig;
  if (!config || !config.publicKey) {
    console.error("LinguaBot: publicKey missing");
    return;
  }

  /* =============================
     STYLE
  ==============================*/
  const style = document.createElement("style");
  style.innerHTML = `
    .lb-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #25D366;
      color: white;
      border: none;
      font-size: 24px;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .lb-chatbox {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 320px;
      height: 420px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: Arial, sans-serif;
      z-index: 9999;
    }

    .lb-header {
      background: #25D366;
      color: white;
      padding: 12px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .lb-messages {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      background: #f5f5f5;
    }

    .lb-input {
      display: flex;
      border-top: 1px solid #ddd;
    }

    .lb-input input {
      flex: 1;
      padding: 10px;
      border: none;
      outline: none;
    }

    .lb-input button {
      padding: 10px 15px;
      border: none;
      background: #25D366;
      color: white;
      cursor: pointer;
    }

    .lb-message {
      margin-bottom: 8px;
      padding: 8px 12px;
      border-radius: 16px;
      max-width: 80%;
      font-size: 14px;
    }

    .lb-user {
      background: #dcf8c6;
      align-self: flex-end;
    }

    .lb-bot {
      background: white;
      align-self: flex-start;
    }
  `;
  document.head.appendChild(style);

  /* =============================
     CREATE ELEMENTS
  ==============================*/
  const button = document.createElement("button");
  button.className = "lb-button";
  button.innerHTML = "💬";

  const chatbox = document.createElement("div");
  chatbox.className = "lb-chatbox";

  chatbox.innerHTML = `
    <div class="lb-header">
      LinguaBot
      <span style="cursor:pointer;" id="lb-close">✕</span>
    </div>
    <div class="lb-messages" id="lb-messages"></div>
    <div class="lb-input">
      <input type="text" id="lb-input" placeholder="Type a message..." />
      <button id="lb-send">Send</button>
    </div>
  `;

  document.body.appendChild(button);
  document.body.appendChild(chatbox);

  const messagesDiv = chatbox.querySelector("#lb-messages");
  const input = chatbox.querySelector("#lb-input");

  /* =============================
     FUNCTIONS
  ==============================*/
  function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.className = `lb-message ${type}`;
    msg.innerText = text;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "lb-user");
    input.value = "";

    addMessage("Typing...", "lb-bot");

    try {
      const response = await fetch(
        "http://localhost:4000/api/public/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-public-key": config.publicKey,
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();

      messagesDiv.lastChild.remove(); // remove typing
      addMessage(data.aiResponse, "lb-bot");

    } catch (err) {
      messagesDiv.lastChild.remove();
      addMessage("AI failed. Please try again.", "lb-bot");
    }
  }

  /* =============================
     EVENTS
  ==============================*/
  button.onclick = () => {
    chatbox.style.display =
      chatbox.style.display === "flex" ? "none" : "flex";
  };

  chatbox.querySelector("#lb-close").onclick = () => {
    chatbox.style.display = "none";
  };

  chatbox.querySelector("#lb-send").onclick = sendMessage;

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
})();