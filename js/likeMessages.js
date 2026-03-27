import { db } from "./firebase.js";
import { ref, runTransaction, get, remove, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export const likeMessage = async (id, username) => {
    if (!id || !username) return;

    const userLikeRef = ref(db, `likesByUsers/${username}/${id}`);
    const globalLikeRef = ref(db, `messages/${id}/likes`);
    const msgUserLikeRef = ref(db, `messages/${id}/likesByUsers/${username}`);

    try {
        const snapshot = await get(userLikeRef);
        const isLiked = snapshot.exists();

        if (isLiked) {
            await remove(userLikeRef);
            await remove(msgUserLikeRef);
            await runTransaction(globalLikeRef, (current) => (current || 1) - 1);
        } else {
            await set(userLikeRef, true);
            await set(msgUserLikeRef, true);
            await runTransaction(globalLikeRef, (current) => (current || 0) + 1);
        }
    } catch (error) {
        console.error("Toggle like error:", error);
    }
};