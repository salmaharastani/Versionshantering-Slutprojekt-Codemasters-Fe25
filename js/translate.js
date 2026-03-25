let currentLang = 'sv';
let googleReady = false;


window.googleTranslateElementInit = function () {
  new google.translate.TranslateElement({
    pageLanguage: 'sv,en',
    includedLanguages: 'sv,en',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');

  googleReady = true;
  removeGoogleBar();
};


function loadGoogleScript() {
  const script = document.createElement('script');

  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  script.defer = true;

  document.body.appendChild(script);
}


function removeGoogleBar() {
  const interval = setInterval(() => {
    const frame = document.querySelector('.goog-te-banner-frame');
    if (frame) {
      frame.remove();
      clearInterval(interval);
    }
  }, 500);
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("langBtn");

  btn.addEventListener("click", () => {

    if (!googleReady) {
      console.log("⏳ Google not ready yet");
      return;
    }

    const targetLang = currentLang === 'sv' ? 'en' : 'sv';

    const select = document.querySelector(".goog-te-combo");

    if (select) {
      select.value = targetLang;
      select.dispatchEvent(new Event("change"));

      currentLang = targetLang;
      btn.textContent = currentLang === 'sv' ? "English" : "Svenska";
    }
  });
});


loadGoogleScript();
