(function () {
  const config = window.LinguaBotConfig;
  if (!config || !config.publicKey) {
    console.error("LinguaBot: publicKey missing");
    return;
  }

  /* =============================
     CONFIGURATION
  ==============================*/
  const DEFAULTS = {
    autoPopupDelay: 5000, // Show popup after 5 seconds
    typingSpeed: 50, // ms per character for streaming
    storageKey: 'linguabot_history',
    storageTheme: 'linguabot_theme'
  };

  /* =============================
     STYLE - PREMIUM LIGHT THEME
  ==============================*/
  const style = document.createElement("style");
  style.innerHTML = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* Dark Mode Styles */
    body.lb-dark-mode .lb-button {
      background: #1f2937;
      border-color: #374151;
      color: #f3f4f6;
    }

    body.lb-dark-mode .lb-button:hover {
      background: #374151;
    }

    body.lb-dark-mode .lb-chatbox {
      background: #111827;
      border-color: #374151;
    }

    body.lb-dark-mode .lb-header {
      background: #1f2937;
      color: #f3f4f6;
      border-bottom-color: #374151;
    }

    body.lb-dark-mode .lb-header-info h3 {
      color: #f3f4f6;
    }

    body.lb-dark-mode .lb-header-info p {
      color: #9ca3af;
    }

    body.lb-dark-mode .lb-messages {
      background: #111827;
    }

    body.lb-dark-mode .lb-message.user {
      background: #374151;
      color: #f3f4f6;
      border-color: #4b5563;
    }

    body.lb-dark-mode .lb-message.bot {
      background: #1f2937;
      color: #e5e7eb;
      border-color: #374151;
    }

    body.lb-dark-mode .lb-typing {
      background: #1f2937;
      border-color: #374151;
    }

    body.lb-dark-mode .lb-input-wrapper {
      background: #1f2937;
      border-top-color: #374151;
    }

    body.lb-dark-mode .lb-input {
      background: #111827;
      color: #f3f4f6;
      border-color: #374151;
    }

    body.lb-dark-mode .lb-input:focus {
      border-color: #fbbf24;
      background: #1f2937;
      box-shadow: 0 0 8px rgba(251, 191, 36, 0.2);
    }

    body.lb-dark-mode .lb-send-btn {
      background: #fbbf24;
      color: #1f1f1f;
    }

    body.lb-dark-mode .lb-send-btn:hover {
      background: #f59e0b;
    }

    body.lb-dark-mode .lb-theme-toggle {
      color: #9ca3af;
    }

    /* Light Mode (Default) */
    .lb-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #f5f1e8;
      color: #1f1f1f;
      border: 2px solid #e8dcc8;
      cursor: pointer;
      z-index: 9998;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .lb-button:hover {
      transform: scale(1.1);
      background: #f0e8d8;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }

    .lb-button.active {
      background: #f0e8d8;
    }

    .lb-button svg {
      width: 28px;
      height: 28px;
    }

    .lb-chatbox {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 380px;
      height: 550px;
      background: #fefdfb;
      border-radius: 16px;
      border: 1px solid #e8dcc8;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 9999;
      animation: slideUp 0.3s ease;
    }

    .lb-chatbox.show {
      display: flex;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .lb-header {
      background: #f5f1e8;
      color: #1f1f1f;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e8dcc8;
      gap: 12px;
    }

    .lb-header-title {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .lb-header-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #eee5d3;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .lb-header-info h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: #1f1f1f;
    }

    .lb-header-info p {
      font-size: 12px;
      opacity: 0.6;
      margin-top: 2px;
      color: #666;
    }

    .lb-header-controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .lb-theme-toggle,
    .lb-close-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      opacity: 0.6;
      transition: opacity 0.2s, transform 0.2s;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lb-theme-toggle:hover,
    .lb-close-btn:hover {
      opacity: 1;
      transform: scale(1.1);
    }

    .lb-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #fefdfb;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .lb-messages::-webkit-scrollbar {
      width: 6px;
    }

    .lb-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .lb-messages::-webkit-scrollbar-thumb {
      background: #e8dcc8;
      border-radius: 3px;
    }

    .lb-messages::-webkit-scrollbar-thumb:hover {
      background: #dcc8b0;
    }

    .lb-message-wrapper {
      display: flex;
      gap: 8px;
      animation: fadeIn 0.3s ease;
    }

    .lb-message-wrapper.user {
      justify-content: flex-end;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .lb-message {
      padding: 12px 16px;
      border-radius: 14px;
      max-width: 75%;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
      color:white
    }

    .lb-message.user {
      background: #f5f1e8;
      color: #1f1f1f;
      border-radius: 14px 14px 4px 14px;
      border: 1px solid #e8dcc8;
    }

    .lb-message.bot {
      background: #faf8f4;
      color: #333;
      border-radius: 14px 14px 14px 4px;
      border: 1px solid #e8dcc8;
    }

    .lb-message.streaming {
      min-height: 20px;
    }

    .lb-typing {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      background: #faf8f4;
      border-radius: 14px 14px 14px 4px;
      border: 1px solid #e8dcc8;
      width: fit-content;
    }

    .lb-typing-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #d4c4a8;
      animation: typing 1.4s infinite;
    }

    .lb-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .lb-typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
      0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
      30% { opacity: 1; transform: translateY(-6px); }
    }

    .lb-input-wrapper {
      display: flex;
      gap: 10px;
      padding: 16px;
      background: #fefdfb;
      border-top: 1px solid #e8dcc8;
    }

    .lb-input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e8dcc8;
      border-radius: 24px;
      font-size: 14px;
      outline: none;
      font-family: inherit;
      background: #faf8f4;
      color: #1f1f1f;
      transition: all 0.2s ease;
    }

    .lb-input:focus {
      border-color: #f4d97d;
      background: #fff;
      box-shadow: 0 0 8px rgba(244, 217, 125, 0.2);
    }

    .lb-input::placeholder {
      color: #999;
    }

    .lb-send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: #f4d97d;
      color: #1f1f1f;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
      font-weight: 600;
    }

    .lb-send-btn:hover {
      transform: scale(1.1);
      background: #f0ce6b;
      box-shadow: 0 4px 12px rgba(244, 217, 125, 0.3);
    }

    .lb-send-btn:active {
      transform: scale(0.95);
    }

    .lb-welcome-message {
      text-align: center;
      padding: 20px;
      color: #666;
    }

    .lb-welcome-icon {
      font-size: 42px;
      margin-bottom: 12px;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .lb-welcome-text {
      font-size: 14px;
      line-height: 1.6;
    }

    .lb-welcome-text strong {
      color: #1f1f1f;
    }

    .lb-clear-history {
      font-size: 12px;
      color: #999;
      text-align: center;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e8dcc8;
    }

    .lb-clear-history-btn {
      background: none;
      border: none;
      color: #f4d97d;
      cursor: pointer;
      font-size: 12px;
      text-decoration: underline;
    }

    .lb-clear-history-btn:hover {
      color: #f0ce6b;
    }

    @media (max-width: 480px) {
      .lb-chatbox {
        width: 100%;
        height: 100%;
        max-height: 100vh;
        border-radius: 0;
        bottom: 0;
        right: 0;
      }

      .lb-message {
        max-width: 85%;
      }

      .lb-header-info h3 {
        font-size: 14px;
      }
    }
  `;
  document.head.appendChild(style);

  /* =============================
     ANIMATED SVG ICON
  ==============================*/
  function createAnimatedSVG() {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" 
              stroke-dasharray="60" 
              stroke-dashoffset="60"
              style="animation: drawSVG 2s ease-in-out infinite;">
        </path>
      </svg>
      <style>
        @keyframes drawSVG {
          0%, 100% { stroke-dashoffset: 60; }
          50% { stroke-dashoffset: 0; }
        }
      </style>
    `;
  }

  /* =============================
     STORAGE MANAGEMENT
  ==============================*/
  const Storage = {
    getHistory: () => {
      try {
        return JSON.parse(localStorage.getItem(DEFAULTS.storageKey)) || [];
      } catch {
        return [];
      }
    },
    saveHistory: (messages) => {
      try {
        localStorage.setItem(DEFAULTS.storageKey, JSON.stringify(messages));
      } catch (e) {
        console.warn('Failed to save chat history:', e);
      }
    },
    getTheme: () => {
      return localStorage.getItem(DEFAULTS.storageTheme) || 'light';
    },
    saveTheme: (theme) => {
      localStorage.setItem(DEFAULTS.storageTheme, theme);
    },
    clearHistory: () => {
      localStorage.removeItem(DEFAULTS.storageKey);
    }
  };

  /* =============================
     AUDIO EFFECTS
  ==============================*/
  const Audio = {
    playTyping: () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 300;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  /* =============================
     CREATE ELEMENTS
  ==============================*/
  const button = document.createElement("button");
  button.className = "lb-button";
  button.innerHTML = createAnimatedSVG();

  const chatbox = document.createElement("div");
  chatbox.className = "lb-chatbox";

  chatbox.innerHTML = `
    <div class="lb-header">
      <div class="lb-header-title">
        <div class="lb-header-avatar">🤖</div>
        <div class="lb-header-info">
          <h3>ai assistant</h3>
          <p>Always here to help</p>
        </div>
      </div>
      <div class="lb-header-controls">
        <button class="lb-theme-toggle" id="lb-theme" title="Toggle dark mode">🌙</button>
        <button class="lb-close-btn" id="lb-close">✕</button>
      </div>
    </div>
    <div class="lb-messages" id="lb-messages"></div>
    <div class="lb-input-wrapper">
      <input 
        type="text" 
        class="lb-input" 
        id="lb-input" 
        placeholder="Ask me anything..." 
      />
      <button class="lb-send-btn" id="lb-send">➤</button>
    </div>
  `;

  document.body.appendChild(button);
  document.body.appendChild(chatbox);

  const messagesDiv = chatbox.querySelector("#lb-messages");
  const input = chatbox.querySelector("#lb-input");
  let messages = Storage.getHistory();
  let isStreaming = false;

  /* =============================
     MESSAGE FUNCTIONS
  ==============================*/
  function addMessage(text, type, streaming = false) {
    const wrapper = document.createElement("div");
    wrapper.className = `lb-message-wrapper ${type === "lb-user" ? "user" : "bot"}`;

    const msg = document.createElement("div");
    msg.className = `lb-message ${type}${streaming ? ' streaming' : ''}`;
    msg.innerText = text;

    wrapper.appendChild(msg);
    messagesDiv.appendChild(wrapper);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    return msg;
  }

  function streamMessage(text) {
    isStreaming = true;
    const msg = addMessage('', 'lb-bot', true);
    let charIndex = 0;

    const stream = setInterval(() => {
      if (charIndex < text.length) {
        msg.innerText += text[charIndex];
        charIndex++;
        try {
          Audio.playTyping();
        } catch (e) {
          // Audio context not available
        }
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      } else {
        clearInterval(stream);
        isStreaming = false;
        // Save message to history
        messages.push({ role: 'assistant', content: text });
        Storage.saveHistory(messages);
      }
    }, DEFAULTS.typingSpeed);
  }

  function addTypingIndicator() {
    const wrapper = document.createElement("div");
    wrapper.className = "lb-message-wrapper bot";
    wrapper.id = "lb-typing";

    const typing = document.createElement("div");
    typing.className = "lb-typing";
    typing.innerHTML = `
      <div class="lb-typing-dot"></div>
      <div class="lb-typing-dot"></div>
      <div class="lb-typing-dot"></div>
    `;

    wrapper.appendChild(typing);
    messagesDiv.appendChild(wrapper);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function removeTypingIndicator() {
    const typing = document.getElementById("lb-typing");
    if (typing) typing.remove();
  }

  function addWelcomeMessage() {
    const wrapper = document.createElement("div");
    wrapper.className = "lb-message-wrapper bot";

    const welcome = document.createElement("div");
    welcome.className = "lb-welcome-message";
    welcome.innerHTML = `
      <div class="lb-welcome-icon">👋</div>
      <div class="lb-welcome-text">
        <strong>Hi there!</strong><br>
        How can I help you today?
      </div>
    `;

    wrapper.appendChild(welcome);
    messagesDiv.appendChild(wrapper);
  }

  function loadChatHistory() {
    messagesDiv.innerHTML = '';
    if (messages.length === 0) {
      addWelcomeMessage();
    } else {
      messages.forEach(msg => {
        addMessage(msg.content, msg.role === 'user' ? 'lb-user' : 'lb-bot');
      });
    }
  }

  /* =============================
     SEND MESSAGE
  ==============================*/
  async function sendMessage() {
    if (isStreaming) return;

    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "lb-user");
    messages.push({ role: 'user', content: message });
    Storage.saveHistory(messages);
    input.value = "";
    input.focus();

    addTypingIndicator();

    try {
      const response = await fetch(
        config.apiUrl ? `${config.apiUrl}/api/public/chat` : "http://localhost:4000/api/public/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-public-key": config.publicKey,
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      removeTypingIndicator();
      
      // Stream the response
      streamMessage(data.aiResponse || data.response || "No response received.");

    } catch (err) {
      removeTypingIndicator();
      streamMessage("Sorry, something went wrong. Please try again.");
      console.error("LinguaBot Error:", err);
    }
  }

  /* =============================
     THEME TOGGLE
  ==============================*/
  function toggleTheme() {
    const isDark = document.body.classList.contains('lb-dark-mode');
    if (isDark) {
      document.body.classList.remove('lb-dark-mode');
      Storage.saveTheme('light');
      chatbox.querySelector('#lb-theme').textContent = '🌙';
    } else {
      document.body.classList.add('lb-dark-mode');
      Storage.saveTheme('dark');
      chatbox.querySelector('#lb-theme').textContent = '☀️';
    }
  }

  /* =============================
     AUTO POPUP
  ==============================*/
  function setupAutoPopup() {
    const hasVisited = sessionStorage.getItem('linguabot_visited');
    if (!hasVisited && config.autoPopup !== false) {
      setTimeout(() => {
        chatbox.classList.add("show");
        button.classList.add("active");
        input.focus();
        sessionStorage.setItem('linguabot_visited', 'true');
      }, config.autoPopupDelay || DEFAULTS.autoPopupDelay);
    }
  }

  /* =============================
     INITIALIZATION
  ==============================*/
  function init() {
    // Load theme
    const savedTheme = Storage.getTheme();
    if (savedTheme === 'dark') {
      document.body.classList.add('lb-dark-mode');
      chatbox.querySelector('#lb-theme').textContent = '☀️';
    }

    // Load chat history
    loadChatHistory();

    // Setup auto popup
    setupAutoPopup();
  }

  /* =============================
     EVENTS
  ==============================*/
  button.onclick = () => {
    const isVisible = chatbox.classList.contains("show");
    if (!isVisible) {
      chatbox.classList.add("show");
      button.classList.add("active");
      input.focus();
    } else {
      chatbox.classList.remove("show");
      button.classList.remove("active");
    }
  };

  chatbox.querySelector("#lb-theme").onclick = (e) => {
    e.stopPropagation();
    toggleTheme();
  };

  chatbox.querySelector("#lb-close").onclick = () => {
    chatbox.classList.remove("show");
    button.classList.remove("active");
  };

  chatbox.querySelector("#lb-send").onclick = sendMessage;

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Initialize
  init();
})();