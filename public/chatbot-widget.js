(function () {
  const scriptTag = document.currentScript;

  // Read dynamic props from data attributes
  const chatbotId =
    scriptTag.getAttribute("data-chatbot-id") || "default-chatbot";
  const companyName =
    scriptTag.getAttribute("data-company-name") || "Your Company";
  const companyDescription =
    scriptTag.getAttribute("data-company-description") ||
    "We are here to assist you.";

  // Create feedback banner
  const banner = document.createElement("div");
  banner.textContent = `Welcome to ${companyName}! We'd love your feedback!`;
  banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            line-height: 28px;
            background-color: #0078ff;
            color: white;
            text-align: center;
            padding: 10px;
            z-index: 9999;
            font-family: 'Arial', sans-serif;
            font-size: 14px;
          `;

  const feedbackButton = document.createElement("button");
  feedbackButton.textContent = "Give Feedback";
  feedbackButton.style.cssText = `
            background-color: white;
            color: #0078ff;
            border: none;
            padding: 6px 12px;
            margin-left: 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
          `;
  banner.appendChild(feedbackButton);

  document.body.appendChild(banner);

  // Handle feedback submission
  feedbackButton.addEventListener("click", () => {
    const feedback = prompt("Please share your feedback:");
    if (feedback) {
      alert(`Thanks for your feedback: "${feedback}"`);
    }
  });

  // Create chatbot button
  const chatbotButton = document.createElement("button");
  chatbotButton.id = chatbotId;
  chatbotButton.textContent = "💬";
  chatbotButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #0078ff;
            color: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 26px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          `;

  document.body.appendChild(chatbotButton);

  // Chatbot Modal
  const chatbotWindow = document.createElement("div");
  chatbotWindow.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 350px;
            max-height: 460px;
            background-color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            padding: 16px;
            z-index: 9999;
            display: none;
            overflow-y: auto;
            overflow-x: hidden;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
            transition: all 0.3s ease;
          `;

  chatbotWindow.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3 style="margin: 0; font-size: 18px; color: #0078ff;">Welcome to ${companyName} Chat!</h3>
              <button style="
                background: transparent;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #888;
              ">&times;</button>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 8px;">${companyDescription}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 10px 0;">
            <div id="chat-content" style="margin-top: 10px; max-height: 300px; overflow-y: auto; display: flex; flex-direction: column;">
              <p style="color: #444;">Hi there! How can we assist you today?</p>
            </div>
            <input type="text" id="user-message"
              placeholder="Type a message..." 
              style="width: 100%; padding: 10px; margin-top: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;" />
          `;

  const closeButton = chatbotWindow.querySelector("button");
  closeButton.addEventListener("click", () => {
    chatbotWindow.style.display = "none";
  });

  document.body.appendChild(chatbotWindow);

  // Chatbot Button Click Handler
  chatbotButton.addEventListener("click", () => {
    // Fullscreen chat on mobile
    if (window.innerWidth < 768) {
      chatbotWindow.style.width = "100%";
      chatbotWindow.style.height = "100%";
      chatbotWindow.style.bottom = "0";
      chatbotWindow.style.right = "0";
      chatbotWindow.style.borderRadius = "0";
    }
    chatbotWindow.style.display =
      chatbotWindow.style.display === "none" ? "block" : "none";
  });

  // Handle Chat Messages (dummy for now)
  const userMessageInput = chatbotWindow.querySelector("#user-message");
  userMessageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && userMessageInput.value.trim()) {
      const message = userMessageInput.value.trim();
      const chatContent = chatbotWindow.querySelector("#chat-content");
      const userMessageElement = document.createElement("div");
      userMessageElement.style.cssText = `
                text-align: right;
                background-color: #0078ff;
                color: white;
                border-radius: 12px;
                padding: 8px 12px;
                margin: 4px 0;
                max-width: fit-content;
                align-self: flex-end;
              `;
      userMessageElement.textContent = message;

      chatContent.appendChild(userMessageElement);
      userMessageInput.value = "";

      // Simulate chatbot response
      setTimeout(() => {
        const botMessageElement = document.createElement("div");
        botMessageElement.style.cssText = `
                  text-align: left;
                  background-color: #f1f1f1;
                  color: #444;
                  border-radius: 12px;
                  padding: 8px 12px;
                  margin: 4px 0;
                  max-width: 80%;
                  align-self: flex-start;
                `;
        botMessageElement.textContent = "Thank you for your message!";
        chatContent.appendChild(botMessageElement);
      }, 1000);
    }
  });
})();
