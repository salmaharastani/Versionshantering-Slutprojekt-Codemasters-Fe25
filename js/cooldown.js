const form = document.getElementById("messageForm");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const btn = form.querySelector("button"); // get button inside form

const COOLDOWN_TIME = 3;

let cooldown = false;
let timeLeft = 0;
let interval = null;


form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (cooldown) return;

  const name = nameInput.value.trim();
  const text = messageInput.value.trim();

  if (!name || !text) return;

  const message = document.createElement("p");
  message.textContent = `${name}: ${text}`;

  document.querySelector(".content")?.appendChild(message);

  nameInput.value = "";
  messageInput.value = "";

  setTimeout(() => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.dispatchEvent(new Event("change"));
    }
  }, 300);

  startCooldown();
});

//  COOLDOWN
function startCooldown() {
  cooldown = true;
  timeLeft = COOLDOWN_TIME;

  btn.disabled = true;
  btn.textContent = `Wait ${timeLeft}s`;

  interval = setInterval(() => {
    timeLeft--;

    if (timeLeft > 0) {
      btn.textContent = `Wait ${timeLeft}s`;
    } else {
      clearInterval(interval);

      cooldown = false;
      btn.disabled = false;
      btn.textContent = "Skicka"; // 
    }
  }, 1000);
}
