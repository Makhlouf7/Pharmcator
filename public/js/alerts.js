const body = document.querySelector("body");

// Function to create and display an alert
export const showAlert = (message, type, time = 2000) => {
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.style.cssText = `
    position: fixed;
    top: 0;
    left: 50%;
    text-align: center;
    min-width: 200px;
    transform: translateX(-50%);
    background-color: ${type === "success" ? "#28a745" : "#dc3545"};
    color: white;
    padding: 1rem 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 2000;
    font-size: 1rem;
  `;
  body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, time);
};

// Function to show or hide a loader
export const toggleLoader = (action) => {
  let loader = document.querySelector("#global-loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "global-loader";
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;
    loader.innerHTML = `
      <div style="
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    body.appendChild(loader);
  }

  if (action === "show") {
    loader.style.display = "flex";
  } else if (action === "hide") {
    loader.style.display = "none";
  }
};

// Function to show a confirmation dialog
export const showConfirmDialog = async (message) => {
  return new Promise((resolve) => {
    // Create the modal container
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3000;
    `;

    // Create the modal content
    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 100%;
    `;

    // Add the message
    const modalMessage = document.createElement("p");
    modalMessage.textContent = message;
    modalMessage.style.cssText = `
      margin-bottom: 1.5rem;
      font-size: 1rem;
      color: #333;
    `;
    modalContent.appendChild(modalMessage);

    // Add the buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 2px;
    `;

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.cssText = `
      padding: 0.5rem 1rem;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    `;
    cancelButton.addEventListener("click", () => {
      modal.remove();
      resolve(false);
    });

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    confirmButton.style.cssText = `
      padding: 0.5rem 1rem;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    `;
    confirmButton.addEventListener("click", () => {
      modal.remove();
      resolve(true);
    });

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);
    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
    body.appendChild(modal);
  });
};
