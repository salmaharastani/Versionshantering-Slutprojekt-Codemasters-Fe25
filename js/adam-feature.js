// Adam feature: Weather box floating next to the main container
// Start: bygg UI, placera den bredvid main och starta väderhämtning.
const main = document.querySelector("main");
const messagesContainer = document.getElementById("messagesContainer");

if (main && messagesContainer) {
  // Skapa sidopanelen.
  const sidebar = document.createElement("aside");
  sidebar.id = "weatherSidebar";
  sidebar.style.width = "240px";
  sidebar.style.padding = "16px";
  sidebar.style.border = "none";
  sidebar.style.borderRadius = "8px";
  sidebar.style.background = "#fafafa";
  sidebar.style.position = "absolute";
  sidebar.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.08)";

  // Frasgenerator (slumpad kallpratsfras).
  const headline = document.createElement("p");
  const phrases = [
    "Suger du på kallprat? Snacka om vädret!",
    "Inget att säga? Fråga om det blir regn.",
    "Kallprat hacks: ”Hur är det hos dig?”",
    "Bjud på väder: ”{WEATHER} här, hur är det där?”",
    "Starta mjukt: ”Blir det bättre väder till helgen?”",
    "Isbrytare deluxe: ”Har du sett vårtecken än?”",
    "Snabbt kallprat tips: ”Blåser det lika mycket hos dig?”"
  ];
  // Initiera variabeln för senaste väderkoden (uppdateras när API svarar).
  let currentWeatherCode = null;
  const pickRandomPhrase = () => {
    const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    headline.dataset.template = selectedPhrase;

    if (selectedPhrase.includes("{WEATHER}")) {
      const replacement =
        currentWeatherCode === null
          ? "Väder"
          : getWeatherText(currentWeatherCode);
      headline.textContent = selectedPhrase.replace("{WEATHER}", replacement);
    } else {
      headline.textContent = selectedPhrase;
    }
  };
  pickRandomPhrase();
  headline.style.color = "#4f46e5";
  headline.style.margin = "0 0 12px 0";
  headline.style.fontWeight = "600";

  // Väderdel (ikon + temp/text + knapp för ny fras).
  const weatherBox = document.createElement("div");
  weatherBox.id = "weatherBox";
  weatherBox.style.display = "flex";
  weatherBox.style.alignItems = "center";
  weatherBox.style.gap = "12px";
  weatherBox.style.color = "inherit";

  // Innehåll som ersätts när API-svar kommer.
  const weatherContent = document.createElement("div");
  weatherContent.id = "weatherContent";
  weatherContent.textContent = "Hämtar vädret...";

  // Knapp: användaren kan slumpa ny fras.
  const refreshPhraseBtn = document.createElement("button");
  refreshPhraseBtn.type = "button";
  refreshPhraseBtn.id = "weatherPhraseBtn";
  refreshPhraseBtn.textContent = "Ny fras";
  refreshPhraseBtn.title = "Slumpa ny fras";
  refreshPhraseBtn.style.marginLeft = "auto";
  refreshPhraseBtn.style.padding = "4px 8px";
  refreshPhraseBtn.style.fontSize = "14px";
  refreshPhraseBtn.style.fontWeight = "bold";
  refreshPhraseBtn.style.width = "90px";
  refreshPhraseBtn.style.height = "32px";
  refreshPhraseBtn.style.transform = "translateY(10px)";
  refreshPhraseBtn.style.whiteSpace = "nowrap";
  refreshPhraseBtn.style.overflow = "hidden";
  refreshPhraseBtn.style.textOverflow = "ellipsis";
  refreshPhraseBtn.style.borderRadius = "5px";
  refreshPhraseBtn.style.border = "none";
  refreshPhraseBtn.style.background = "#4f46e5";
  refreshPhraseBtn.style.color = "#ffffff";
  refreshPhraseBtn.style.cursor = "pointer";
  refreshPhraseBtn.style.transition = "background-color 0.1s ease";

  refreshPhraseBtn.addEventListener("click", () => {
    pickRandomPhrase();
  });
  refreshPhraseBtn.addEventListener("mousedown", () => {
    refreshPhraseBtn.style.background = "#4338ca";
  });
  refreshPhraseBtn.addEventListener("mouseup", () => {
    const isDark = document.body.classList.contains("dark-mode");
    refreshPhraseBtn.style.background = isDark ? "#6366f1" : "#4f46e5";
  });
  refreshPhraseBtn.addEventListener("mouseleave", () => {
    const isDark = document.body.classList.contains("dark-mode");
    refreshPhraseBtn.style.background = isDark ? "#6366f1" : "#4f46e5";
  });

  weatherBox.appendChild(weatherContent);
  weatherBox.appendChild(refreshPhraseBtn);

  sidebar.appendChild(headline);
  sidebar.appendChild(weatherBox);

  document.body.appendChild(sidebar);

  // Temasynk (ljus/mörk) för panel och knapp.
  const applySidebarTheme = () => {
    const isDark = document.body.classList.contains("dark-mode");
    sidebar.style.background = isDark ? "#1e293b" : "#fafafa";
    sidebar.style.borderColor = "transparent";
    sidebar.style.color = isDark ? "#f8fafc" : "#222";
    sidebar.style.boxShadow = isDark ? "none" : "0 4px 14px rgba(0, 0, 0, 0.08)";
    headline.style.color = isDark ? "#a5b4fc" : "#4f46e5";
    refreshPhraseBtn.style.borderColor = "transparent";
    refreshPhraseBtn.style.background = isDark ? "#6366f1" : "#4f46e5";
    refreshPhraseBtn.style.color = "#ffffff";
  };

  // Placera panelen precis bredvid <main>; flytta under på små skärmar.
  const gap = 12;
  const positionSidebar = () => {
    const rect = main.getBoundingClientRect();
    const left = window.scrollX + rect.right + gap;
    const top = window.scrollY + rect.top;
    const isMobile = window.innerWidth <= 720;
    const isTablet = window.innerWidth > 720 && window.innerWidth <= 1024;
    const wouldOverflow = left + sidebar.offsetWidth > window.innerWidth - 8;

    if (isMobile || isTablet || wouldOverflow) {
      sidebar.style.width = `${Math.max(220, Math.min(320, rect.width))}px`;
      const desiredLeft = window.scrollX + rect.left;
      const maxLeft = window.scrollX + window.innerWidth - sidebar.offsetWidth - 8;
      sidebar.style.left = `${Math.max(8, Math.min(desiredLeft, maxLeft))}px`;
      sidebar.style.top = `${window.scrollY + rect.bottom + gap}px`;
    } else {
      sidebar.style.width = "240px";
      sidebar.style.left = `${left}px`;
      sidebar.style.top = `${top}px`;
    }
  };

  positionSidebar();
  window.addEventListener("resize", positionSidebar);
  window.addEventListener("scroll", positionSidebar, { passive: true });
  applySidebarTheme();
  const themeObserver = new MutationObserver(applySidebarTheme);
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  // Hämta väder och uppdatera UI + väderanpassad fras.
  loadWeather(weatherContent, headline, (code) => {
    currentWeatherCode = code;
    if (headline.dataset.template && headline.dataset.template.includes("{WEATHER}")) {
      headline.textContent = headline.dataset.template.replace("{WEATHER}", getWeatherText(code));
    }
  });
}

// Geolokalisering -> anropar väder-API:t.
function loadWeather(container, headline, onWeather) {
  if (!("geolocation" in navigator)) {
    container.textContent = "Kan inte hämta platsinfo för vädret.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude, container, headline, onWeather);
    },
    () => {
      container.textContent = "Tillåt plats för att visa vädret.";
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
  );
}


// API-anrop + rendera väder.
async function fetchWeather(latitude, longitude, container, headline, onWeather) {
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${encodeURIComponent(latitude)}` +
      `&longitude=${encodeURIComponent(longitude)}` +
      "&current=temperature_2m,weather_code,wind_speed_10m" +
      "&temperature_unit=celsius" +
      "&wind_speed_unit=ms" +
      "&timezone=auto";

    const response = await fetch(url);
    if (!response.ok) throw new Error("weather fetch failed");
    const data = await response.json();
    const current = data.current;
    if (typeof onWeather === "function") onWeather(current.weather_code);

    const weatherText = getWeatherText(current.weather_code);
    const icon = getWeatherIcon(current.weather_code);

    container.innerHTML = `
      <div style="width: 40px; height: 40px;">${icon}</div>
      <div>
        <div style="font-weight: 600;">${Math.round(current.temperature_2m)}°C</div>
        <div style="font-size: 0.9em;">${weatherText}</div>
      </div>
    `;

    if (headline && headline.dataset.template && headline.dataset.template.includes("{WEATHER}")) {
      const weatherPhrase = getWeatherText(current.weather_code);
      headline.textContent = headline.dataset.template.replace("{WEATHER}", weatherPhrase);
    }
  } catch (error) {
    container.textContent = "Kunde inte hämta vädret just nu.";
  }
}


// Översätt WMO-väderkoder till korta svenska texter.
function getWeatherText(code) {
  if (code === 0) return "Klart";
  if (code === 1 || code === 2) return "Delvis molnigt";
  if (code === 3) return "Mulet";
  if (code === 45 || code === 48) return "Dimma";
  if (code >= 51 && code <= 57) return "Duggregn";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "Regn";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "Snö";
  if (code === 95 || code === 96 || code === 99) return "Åska";
  return "Oklart väder";
}


// Välj ikon baserat på samma väderkod.
function getWeatherIcon(code) {
  const type = getWeatherType(code);
  if (type === "clear") return iconSun();
  if (type === "cloudy") return iconCloud();
  if (type === "rain") return iconRain();
  if (type === "snow") return iconSnow();
  if (type === "thunder") return iconThunder();
  if (type === "fog") return iconFog();
  return iconCloud();
}


// Gruppera koder till ikon-typer.
function getWeatherType(code) {
  if (code === 0) return "clear";
  if (code === 1 || code === 2 || code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code === 95 || code === 96 || code === 99) return "thunder";
  return "cloudy";
}

function iconSun() {
  return `
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
      <circle cx="32" cy="32" r="12" fill="#f5c542"></circle>
      <g stroke="#f5c542" stroke-width="3">
        <line x1="32" y1="4" x2="32" y2="14"></line>
        <line x1="32" y1="50" x2="32" y2="60"></line>
        <line x1="4" y1="32" x2="14" y2="32"></line>
        <line x1="50" y1="32" x2="60" y2="32"></line>
        <line x1="12" y1="12" x2="19" y2="19"></line>
        <line x1="45" y1="45" x2="52" y2="52"></line>
        <line x1="12" y1="52" x2="19" y2="45"></line>
        <line x1="45" y1="19" x2="52" y2="12"></line>
      </g>
    </svg>
  `;
}

function iconCloud() {
  return `
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
      <path d="M20 44h26a10 10 0 0 0 0-20 14 14 0 0 0-27-4A10 10 0 0 0 20 44z" fill="#9aa0a6"></path>
    </svg>
  `;
}

function iconRain() {
  return `
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
      <path d="M20 36h26a10 10 0 0 0 0-20 14 14 0 0 0-27-4A10 10 0 0 0 20 36z" fill="#9aa0a6"></path>
      <g stroke="#4a90e2" stroke-width="3">
        <line x1="24" y1="42" x2="20" y2="52"></line>
        <line x1="34" y1="42" x2="30" y2="52"></line>
        <line x1="44" y1="42" x2="40" y2="52"></line>
      </g>
    </svg>
  `;
}

function iconSnow() {
  return `
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
      <path d="M20 36h26a10 10 0 0 0 0-20 14 14 0 0 0-27-4A10 10 0 0 0 20 36z" fill="#9aa0a6"></path>
      <g stroke="#6bb7d6" stroke-width="2">
        <line x1="24" y1="42" x2="24" y2="52"></line>
        <line x1="20" y1="46" x2="28" y2="46"></line>
        <line x1="34" y1="42" x2="34" y2="52"></line>
        <line x1="30" y1="46" x2="38" y2="46"></line>
        <line x1="44" y1="42" x2="44" y2="52"></line>
        <line x1="40" y1="46" x2="48" y2="46"></line>
      </g>
    </svg>
  `;
}

function iconThunder() {
  return `
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
      <path d="M20 36h26a10 10 0 0 0 0-20 14 14 0 0 0-27-4A10 10 0 0 0 20 36z" fill="#9aa0a6"></path>
      <polygon points="30,38 22,54 32,54 28,62 42,44 32,44" fill="#f5c542"></polygon>
    </svg>
  `;
}

function iconFog() {
  return `
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
      <g stroke="#9aa0a6" stroke-width="4">
        <line x1="12" y1="28" x2="52" y2="28"></line>
        <line x1="8" y1="38" x2="56" y2="38"></line>
        <line x1="12" y1="48" x2="52" y2="48"></line>
      </g>
    </svg>
  `;
}
