import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

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
const db = getDatabase(app);
const amendments = Array.isArray(window.BUILDER_DATA) ? window.BUILDER_DATA : [];

const $ = id => document.getElementById(id);
const fmt = n => Number(n || 0).toLocaleString("en-AU");
const pct = (n,d) => d ? (100 * Number(n||0) / d) : 0;
const pctText = (n,d) => `${pct(n,d).toFixed(1)}%`;
const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

function positionLabel(key){
  return ({support:"Support",oppose:"Oppose",unsure:"Unsure",noComment:"No comment"})[key] || key;
}
function positionClass(key){ return key === "noComment" ? "no-comment" : key; }

function renderAmendments(data){
  const root = $("amendmentResults");
  const rows = [];
  for(let i=1;i<=21;i++){
    const r = data?.amendments?.[String(i)] || {};
    const counts = {
      support:Number(r.support||0),
      oppose:Number(r.oppose||0),
      unsure:Number(r.unsure||0),
      noComment:Number(r.noComment||0)
    };
    const total = Object.values(counts).reduce((a,b)=>a+b,0);
    const leader = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
    const title = amendments[i-1]?.title || `Amendment ${i}`;

    const cells = Object.entries(counts).map(([k,v]) =>
      `<div class="result-cell"><b>${pctText(v,total)}</b><span>${positionLabel(k)} · ${fmt(v)}</span></div>`
    ).join("");

    const bars = Object.entries(counts).map(([k,v]) =>
      `<span class="${positionClass(k)}" style="width:${pct(v,total)}%" title="${positionLabel(k)} ${pctText(v,total)}"></span>`
    ).join("");

    rows.push(`
      <article class="amendment-card">
        <div class="amendment-top">
          <div>
            <div class="amendment-num">Amendment ${i}</div>
            <div class="amendment-title">${esc(title)}</div>
          </div>
          <div class="leading-result">
            <strong>${leader && total ? `${positionLabel(leader[0])} ${pctText(leader[1],total)}` : "No data"}</strong>
            <span>${fmt(total)} recorded responses</span>
          </div>
        </div>
        <div class="stackbar" aria-label="Result distribution">${bars}</div>
        <div class="result-grid">${cells}</div>
      </article>
    `);
  }
  root.innerHTML = rows.join("");
}

function renderRanked(containerId, obj){
  const root=$(containerId);
  const rows = Object.values(obj || {})
    .filter(x=>x && x.label)
    .map(x=>({label:String(x.label),count:Number(x.count||0)}))
    .sort((a,b)=>b.count-a.count);
  if(!rows.length){ root.innerHTML='<div class="loading">No aggregate selections were recorded.</div>'; return; }
  root.innerHTML = rows.map((x,i)=>`
    <div class="rank-item">
      <div class="rank-no">${i+1}</div>
      <div class="rank-label">${esc(x.label)}</div>
      <div class="rank-count">${fmt(x.count)}</div>
    </div>`).join("");
}

async function loadResults(){
  try{
    const [totalSnap, resultsSnap] = await Promise.all([
      get(ref(db,"communityParticipation/generatedSubmissions")),
      get(ref(db,"communityResults"))
    ]);
    const generated = Number(totalSnap.val() || 0);
    const data = resultsSnap.val() || {};
    $("generatedTotal").textContent = fmt(generated);
    $("recordedTotal").textContent = fmt(data.recordedSubmissions || 0);
    renderAmendments(data);
    renderRanked("furtherSuggestions",data.furtherSuggestions);
    renderRanked("closingSuggestions",data.closingSuggestions);
  }catch(err){
    console.error(err);
    $("errorBox").classList.remove("hidden");
    $("errorBox").textContent = "The anonymous results could not be loaded from Firebase. Check that Realtime Database read access remains enabled after the write lock is published.";
    $("amendmentResults").innerHTML='<div class="loading">Results unavailable.</div>';
    $("furtherSuggestions").innerHTML='<div class="loading">Results unavailable.</div>';
    $("closingSuggestions").innerHTML='<div class="loading">Results unavailable.</div>';
  }
}
$("printBtn").addEventListener("click",()=>window.print());
loadResults();
