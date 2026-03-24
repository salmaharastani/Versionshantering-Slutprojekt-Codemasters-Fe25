import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, child, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDf01hwn1G5bKYv5us5SmIGoE2k-KjoqM8",
  authDomain: "slutprojekt-versionshant-7cdd2.firebaseapp.com",
  projectId: "slutprojekt-versionshant-7cdd2",
  storageBucket: "slutprojekt-versionshant-7cdd2.firebasestorage.app",
  messagingSenderId: "69522404366",
  appId: "1:69522404366:web:af80160f9973bc91cc785f",
  databaseURL: "https://slutprojekt-versionshant-7cdd2-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);


const rtdb = getDatabase(app);
export { rtdb as db };


const firestore = getFirestore(app);
export { firestore };


export const registerUser = async (username, password) => {
  console.log("Försöker registrera:", username);
  
  try {
    const userRef = ref(rtdb, `users/${username}`);
    const userSnapshot = await get(userRef);
    
    if (userSnapshot.exists()) {
      throw new Error('Username already taken');
    }
    
    await set(ref(rtdb, `users/${username}`), {
      password: password,
      createdAt: new Date().toISOString()
    });
    
    console.log("✅ Användare sparad i Realtime Database!");
    return { username };
  } catch (error) {
    console.error("❌ Register error:", error);
    throw error;
  }
};

export const loginUser = async (username, password) => {
  console.log("Försöker logga in:", username);
  
  try {
    const userRef = ref(rtdb, `users/${username}`);
    const userSnapshot = await get(userRef);
    
    if (!userSnapshot.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userSnapshot.val();
    
    if (userData.password !== password) {
      throw new Error('Incorrect password');
    }
    
    console.log("✅ Inloggning lyckades!");
    return true;
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
};


export const getAllMessages = async () => {
  const messagesRef = ref(rtdb, 'messages');
  const snapshot = await get(messagesRef);
  return snapshot.val();
};


export const postMessage = async (message, name, title) => {
  const messagesRef = ref(rtdb, 'messages');
  const newMessageRef = push(messagesRef);
  
  await set(newMessageRef, {
    message: message,
    name: name,
    title: title || '',
    likes: 0,
    dislikes: 0,
    timestamp: Date.now()
  });
  
  return newMessageRef.key;
};


export const deleteMessagebyId = async (id) => {
  const messageRef = ref(rtdb, `messages/${id}`);
  await set(messageRef, null);
};


export const listenMessages = (callback) => {
  const messagesRef = ref(rtdb, 'messages');
  onValue(messagesRef, (snapshot) => {
    callback(snapshot.val());
  });
};


export const saveToFirestore = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(firestore, collectionName), {
      ...data,
      createdAt: new Date().toISOString()
    });
    console.log("✅ Sparat i Firestore med ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Firestore error:", error);
    throw error;
  }
};


export const getFromFirestore = async (collectionName, docId) => {
  try {
    const docRef = doc(firestore, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("❌ Firestore get error:", error);
    throw error;
  }
};


export const listenFirestore = (collectionName, callback) => {
  const collectionRef = collection(firestore, collectionName);
  onSnapshot(collectionRef, (snapshot) => {
    const data = {};
    snapshot.forEach((doc) => {
      data[doc.id] = doc.data();
    });
    callback(data);
  });
};