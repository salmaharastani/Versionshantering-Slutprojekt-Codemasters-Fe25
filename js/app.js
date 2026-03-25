import { db, firestore, saveToFirestore, getFromFirestore, listenFirestore } from "./firebase.js";
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { initUsernamePrompt, getUsername } from "./username.js";
// ADAM FEATURE: weather sidebar next to messages
import "./adam-feature.js";

const form = document.getElementById("messageForm");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const messageCategorySelect = document.getElementById("messageCategory");
const boardCategoryFilter = document.getElementById("boardCategoryFilter");
const boardTimeSort = document.getElementById("boardTimeSort");
const statusMessage = document.getElementById("statusMessage");
const messagesContainer = document.getElementById("messagesContainer");
const themeToggle = document.getElementById("themeToggle");

console.log(themeToggle);

// Här kan ni ändra kategorierna (se till att det står samma i Index.html också)
const CATEGORY_CONFIG = {
  juridisk: { label: "Juridisk", className: "category-juridisk" },
  vision: { label: "Vision", className: "category-vision" },
  resultat: { label: "Resultat", className: "category-resultat" },
  teamwork: { label: "Teamwork", className: "category-teamwork" },
  larande: { label: "Larande", className: "category-larande" },
  evenemang: { label: "Evenemang", className: "category-evenemang" }
};
const DEFAULT_CATEGORY = "teamwork";
let messagesCache = {};

function normalizeCategory(category) {
  if (CATEGORY_CONFIG[category]) {
    return category;
  }

  return DEFAULT_CATEGORY;
}

function renderMessages(data) {
  const selectedCategory = boardCategoryFilter.value;
  const selectedTimeSort = boardTimeSort.value;

  messagesContainer.innerHTML = "";

  const entries = Object.values(data || {});

  const filteredEntries = entries.filter((msg) => {
    const category = normalizeCategory(msg.category);
    return selectedCategory === "all" || selectedCategory === category;
  });

  filteredEntries.sort((a, b) => {
    const aTime = new Date(a.createdAt || a.timestamp || Date.now()).getTime();
    const bTime = new Date(b.createdAt || b.timestamp || Date.now()).getTime();

    return selectedTimeSort === "asc" ? aTime - bTime : bTime - aTime;
  });

  filteredEntries.forEach((msg) => {
    const category = normalizeCategory(msg.category);

    const categoryInfo = CATEGORY_CONFIG[category];
    const messageDate = msg.createdAt || msg.timestamp || Date.now();
    const div = document.createElement("div");
    div.className = `message-card ${categoryInfo.className}`;

    div.innerHTML = `
      <span class="message-category-badge">${categoryInfo.label}</span>
      <h3>${msg.name}</h3>
      <p>${msg.message}</p>
      <small>${new Date(messageDate).toLocaleString("sv-SE")}</small>
    `;

    messagesContainer.appendChild(div);
  });

  if (!messagesContainer.children.length) {
    messagesContainer.innerHTML = "<p>Inga meddelanden i vald kategori</p>";
  }
}

function saveMessage(name, message, category) {
  const messagesRef = ref(db, "messages");

  push(messagesRef, {
    name: name,
    message: message,
    category: normalizeCategory(category),
    createdAt: new Date().toISOString()
  });
}

function loadMessages() {
  const messagesRef = ref(db, "messages");

  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    messagesCache = data || {};

    if (!data) {
      messagesContainer.innerHTML = "<p>Inga meddelanden ännu</p>";
      return;
    }

    renderMessages(messagesCache);
  });
}


async function saveUserActivity(activity) {
  try {
    const username = getUsername();
    if (username) {
      await saveToFirestore("userActivities", {
        username: username,
        activity: activity,
        timestamp: new Date().toISOString()
      });
      console.log("Aktivitet sparad i Firestore!");
    }
  } catch (error) {
    console.error("Kunde inte spara aktivitet:", error);
  }
}


async function loadUserActivities() {
  try {
    const username = getUsername();
    if (username) {

      console.log("Kan hämta användaraktivitet från Firestore");
    }
  } catch (error) {
    console.error("Kunde inte hämta aktivitet:", error);
  }
}



form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  const category = messageCategorySelect.value;
  const username = getUsername();

  if (name === "" || message === "") {
    statusMessage.textContent = "Du måste fylla i både namn och meddelande.";
    statusMessage.style.color = "red";
    return;
  }

 
  saveMessage(name, message, category);
  

  if (username) {
    await saveUserActivity(`Skickade meddelande: ${message.substring(0, 50)}...`);
  }

  statusMessage.textContent = "Meddelandet sparades!";
  statusMessage.style.color = "green";

  form.reset();
  messageCategorySelect.value = DEFAULT_CATEGORY;
});

boardCategoryFilter.addEventListener("change", () => {
  renderMessages(messagesCache);
});

boardTimeSort.addEventListener("change", () => {
  renderMessages(messagesCache);
});



function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
}

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});


loadMessages();
applySavedTheme();
initUsernamePrompt();

