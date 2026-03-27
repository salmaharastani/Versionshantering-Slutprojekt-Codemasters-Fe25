const messageForm = document.getElementById('messageForm');
const messageModal = document.getElementById('messageModal');
const closeModal = document.getElementById('closeModal');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Hindrar sidan från att laddas om

  // Här hämtar du värdena (valfritt)
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;

  if (name && message) {
    // Visa pop-upen
    messageModal.showModal();

    // Rensa formuläret efter skickat meddelande
    messageForm.reset();
  } else {
    alert("Vänligen fyll i både namn och meddelande.");
  }
});

// Stäng pop-upen när man klickar på knappen
closeModal.addEventListener('click', () => {
  messageModal.close();
});