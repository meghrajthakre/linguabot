(function () {
  const config = window.LinguaBotConfig;

  if (!config) {
    console.error("LinguaBot config missing");
    return;
  }

  const button = document.createElement("button");
  button.innerText = "Chat";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.padding = "10px 15px";
  button.style.zIndex = "9999";

  document.body.appendChild(button);

  button.onclick = async () => {
    const message = prompt("Ask something:");
    if (!message) return;

    const response = await fetch(
      "http://localhost:4000/api/public/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-public-key": config.publicKey, // ✅ FIXED
        },
        body: JSON.stringify({ message }),
      }
    );

    const data = await response.json();
    alert(data.aiResponse);
  };
})();