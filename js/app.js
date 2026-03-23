const form = document.getElementById("messageForm");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const statusMessage = document.getElementById("statusMessage");
const messagesContainer = document.getElementById("messagesContainer");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (name === "" || message === "") {
    statusMessage.textContent = "Du måste fylla i både namn och meddelande.";
    statusMessage.style.color = "red";
    return;
  }

  statusMessage.textContent = "Formuläret fungerar!";
  statusMessage.style.color = "green";

  const newMessage = document.createElement("div");
  newMessage.innerHTML = `
    <h3>${name}</h3>
    <p>${message}</p>
  `;

  messagesContainer.appendChild(newMessage);

  form.reset();
});