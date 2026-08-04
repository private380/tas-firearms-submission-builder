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
const resultsRef = ref(database, "communityResults");

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

function normalisePosition(position) {
  const value = String(position || "No comment").toLowerCase();
  if (value === "support") return "support";
  if (value === "oppose") return "oppose";
  if (value === "unsure") return "unsure";
  return "noComment";
}

function suggestionKey(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

window.recordGlobalSubmission = async function recordGlobalSubmission(payload) {
  await authReady;

  if (!authUser) {
    throw new Error("Anonymous Firebase authentication was not available.");
  }

  const totalResult = await runTransaction(
    totalRef,
    currentValue => (Number(currentValue) || 0) + 1,
    { applyLocally: false }
  );

  if (!totalResult.committed) return false;

  const resultsResult = await runTransaction(
    resultsRef,
    currentValue => {
      const data = currentValue && typeof currentValue === "object" ? currentValue : {};
      data.amendments = data.amendments || {};
      data.furtherSuggestions = data.furtherSuggestions || {};
      data.closingSuggestions = data.closingSuggestions || {};
      data.recordedSubmissions = (Number(data.recordedSubmissions) || 0) + 1;

      for (const item of payload.positions || []) {
        const amendmentKey = String(item.amendment);
        const positionKey = normalisePosition(item.position);
        data.amendments[amendmentKey] = data.amendments[amendmentKey] || {
          support: 0,
          oppose: 0,
          unsure: 0,
          noComment: 0
        };
        data.amendments[amendmentKey][positionKey] =
          (Number(data.amendments[amendmentKey][positionKey]) || 0) + 1;
      }

      for (const suggestion of payload.furtherSuggestions || []) {
        const key = suggestionKey(suggestion);
        if (!key) continue;
        data.furtherSuggestions[key] = data.furtherSuggestions[key] || { label: suggestion, count: 0 };
        data.furtherSuggestions[key].label = suggestion;
        data.furtherSuggestions[key].count =
          (Number(data.furtherSuggestions[key].count) || 0) + 1;
      }

      for (const suggestion of payload.closingSuggestions || []) {
        const key = suggestionKey(suggestion);
        if (!key) continue;
        data.closingSuggestions[key] = data.closingSuggestions[key] || { label: suggestion, count: 0 };
        data.closingSuggestions[key].label = suggestion;
        data.closingSuggestions[key].count =
          (Number(data.closingSuggestions[key].count) || 0) + 1;
      }

      return data;
    },
    { applyLocally: false }
  );

  return resultsResult.committed;
};

updateCounterElements(0, "Loading…");

initialiseAuthentication().catch(error => {
  console.warn("Firebase anonymous sign-in failed.", error);
});
