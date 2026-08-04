import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  getDatabase,
  onValue,
  ref,
  runTransaction
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDEW0SD8n77F3jsoXw6-tiixTiykTnzupU",
  authDomain: "tas-policy-watch-c451f.firebaseapp.com",
  databaseURL: "https://tas-policy-watch-c451f-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "tas-policy-watch-c451f",
  storageBucket: "tas-policy-watch-c451f.firebasestorage.app",
  messagingSenderId: "508873510393",
  appId: "1:508873510393:web:5bf98ba863d818b1cec128",
  measurementId: "G-ZRRT3FLD1G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const totalRef = ref(database, "communityParticipation/generatedSubmissions");

let authUser = null;
let authReadyResolve;
const authReady = new Promise(resolve => {
  authReadyResolve = resolve;
});

function updateCounterElements(value, status = "") {
  const formatted = Number(value || 0).toLocaleString("en-AU");
  ["generatedCountWelcome", "generatedCountResult"].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = status || formatted;
      element.setAttribute("aria-label", status || `${formatted} submissions generated`);
    }
  });
}

async function initialiseAuthentication() {
  onAuthStateChanged(auth, user => {
    if (user) {
      authUser = user;
      authReadyResolve(user);
    }
  });

  if (!auth.currentUser) {
    await signInAnonymously(auth);
  } else {
    authUser = auth.currentUser;
    authReadyResolve(auth.currentUser);
  }
}

onValue(
  totalRef,
  snapshot => updateCounterElements(snapshot.val() || 0),
  error => {
    console.warn("Unable to read the shared submission counter.", error);
    updateCounterElements(0, "Unavailable");
  }
);

window.recordGlobalPdfGeneration = async function recordGlobalPdfGeneration() {
  await authReady;

  if (!authUser) {
    throw new Error("Anonymous Firebase authentication was not available.");
  }

  const result = await runTransaction(
    totalRef,
    currentValue => (Number(currentValue) || 0) + 1,
    { applyLocally: false }
  );

  return result.committed;
};

updateCounterElements(0, "Loading…");

initialiseAuthentication().catch(error => {
  console.warn("Firebase anonymous sign-in failed.", error);
});
