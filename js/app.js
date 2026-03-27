import { db, firestore, saveToFirestore, getFromFirestore, listenFirestore } from "./firebase.js";
import { ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { initUsernamePrompt, getUsername } from "./username.js";
import { likeMessage } from "./likeMessages.js";
import { deleteMessage } from "./deleteMessages.js";
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

  const entries = data;

  const filteredEntries = entries.filter((msg) => {
    const category = normalizeCategory(msg.category);
    return selectedCategory === "all" || selectedCategory === category;
  });

  filteredEntries.sort((a, b) => {
    const aTime = new Date(a.createdAt || a.timestamp || 0).getTime();
    const bTime = new Date(b.createdAt || b.timestamp || 0).getTime();

    return selectedTimeSort === "asc" ? aTime - bTime : bTime - aTime;
});

  filteredEntries.forEach((msg) => {
    const category = normalizeCategory(msg.category);

    const categoryInfo = CATEGORY_CONFIG[category];
    const messageDate = msg.createdAt || msg.timestamp || Date.now();
    const div = document.createElement("div");
    div.className = `message-card ${categoryInfo.className}`;
    const currentUser = getUsername();
    const isLoggedIn = currentUser === `${currentUser}`; 
    const hasLiked = msg.likesByUsers && msg.likesByUsers[currentUser];

    div.innerHTML = `
      <span class="message-category-badge">${categoryInfo.label}</span>
      <h3>${msg.name}</h3>
      <p>${msg.message}</p>
      <div class="message-footer">
        <button class="like-btn ${hasLiked ? 'active' : ''}">
          <svg class="thumbs-icon" viewBox="0 0 24 24" width="20" height="20">
            <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12l-1.1-4.89c-.19-.83-.92-1.42-1.77-1.42h-5.67l.93-4.47c.07-.34-.05-.7-.32-.93-.28-.23-.65-.33-.99-.26-.35.07-.64.33-.75.67l-2.73 7.35c-.15.41-.55.67-1 .67H8v11h10.51c.7 0 1.33-.46 1.54-1.14l2.12-7.01c.14-.46.06-.97-.24-1.38z"/>
          </svg>
          <span class="like-count">${msg.likes || 0}</span>
        </button>
        <button class="delete-btn" title="Ta bort" style="display: ${msg.owner === currentUser ? 'inline-flex' : 'none'}">
          <svg class="trash-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
          
        <small>${new Date(messageDate).toLocaleString("sv-SE")}</small>
      </div>
    `;

    const dltBtn = div.querySelector(".delete-btn");
      if (dltBtn && dltBtn.style.display !== "none") {
          dltBtn.onclick = (event) => {
              event.stopPropagation();
              deleteMessage(msg.id);
          };
      }

    div.querySelector(".like-btn").onclick = (event) => {
      event.preventDefault();
      if (!currentUser) return alert("Logga in för att gilla!");
      likeMessage(msg.id, currentUser);
    };

    messagesContainer.appendChild(div);
  });

  if (!messagesContainer.children.length) {
    messagesContainer.innerHTML = "<p>Inga meddelanden i vald kategori</p>";
  }
}

function saveMessage(name, message, category) {
  const messagesRef = ref(db, "messages");
  const currentUser = getUsername();

  push(messagesRef, {
    name: name,
    owner: currentUser,
    message: message,
    category: normalizeCategory(category),
    createdAt: new Date().toISOString()
  });
}

function loadMessages() {
  const messagesRef = ref(db, "messages");

  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    
    if (!data) {
      messagesCache = {};
      messagesContainer.innerHTML = "<p>Inga meddelanden ännu</p>";
      return;
    }

    const messagesWithIds = Object.entries(data).map(([id, msg]) => {
      return { ...msg, id: id };
    });

    messagesCache = messagesWithIds;

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

//----- Lägger till stjärnor ---// 


  const starBtn = document.querySelector('#starsBtn');

    starBtn.addEventListener('click',()=>{
        
        for(let i=0; i<40; i++){
            const star = document.createElement('span');
            star.classList.add('star');

            const rect = starBtn.getBoundingClientRect();
            star.style.left = rect.width / 2 + 'px';
            star.style.top = rect.height / 2 + 'px';

            const size = 8 + Math.random() * 30;
            star.style.width = size + 'px';
            star.style.height = size + 'px';


            const x = (Math.random()-0.5) * 300 + 'px';
            const y = (Math.random()-0.5) * 300 + 'px';

            star.style.setProperty('--x', x);
            star.style.setProperty('--y',y);

            const colors = ["#FFD700", "#FFC700", "#FFB700"];
            star.style.background = colors[Math.floor(Math.random()* colors.length)];

            starBtn.appendChild(star);

            setTimeout(()=>{
                star.remove();
            }, 800)
        }
    });