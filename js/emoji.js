
const emojiCodes = [0x1F600, 0x1F603, 0x1F604, 0x1F44D, 0x1F44B];

const selectEl = document.querySelector("#emojis");
selectEl.classList.add("emojisSelect");

const defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.textContent = "😊"; 
defaultOption.disabled = true;
defaultOption.selected = true;
selectEl.appendChild(defaultOption);

emojiCodes.forEach(code => {
  const option = document.createElement("option");
  const emoji = String.fromCodePoint(code);
  option.value = emoji;
  option.textContent = emoji;
  selectEl.appendChild(option);
});

const message = document.querySelector("#message"); // rätt id

selectEl.addEventListener("change", () => {
  const emoji = selectEl.value;
  if (!emoji) return;

  const start = message.selectionStart;
  const end = message.selectionEnd;
  const text = message.value;

  message.value = text.slice(0, start) + emoji + text.slice(end);

  message.focus();
  message.selectionStart = message.selectionEnd = start + emoji.length;

  selectEl.value = ""; // återställ dropdown till default
});
