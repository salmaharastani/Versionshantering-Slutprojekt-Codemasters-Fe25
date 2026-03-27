import { db } from "./firebase.js";
import { ref, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export const deleteMessage = async (id) => {
    if (!id) return;

    const confirmDelete = confirm("Är du säker på att du vill ta bort meddelandet?");
    
    if (confirmDelete) {
        try {
            const messageRef = ref(db, `messages/${id}`);
            await remove(messageRef);
            console.log("Meddelande borttaget:", id);
        } catch (error) {
            console.error("Kunde inte ta bort meddelande:", error);
        }
    }
};