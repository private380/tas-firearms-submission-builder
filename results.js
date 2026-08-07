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

const app=initializeApp(firebaseConfig);
const db=getDatabase(app);
const amendments=Array.isArray(window.BUILDER_DATA)?window.BUILDER_DATA:[];
const $=id=>document.getElementById(id);
const fmt=n=>Number(n||0).toLocaleString("en-AU");
const pct=(n,d)=>d?(100*Number(n||0)/d):0;
const pctText=(n,d)=>`${pct(n,d).toFixed(1)}%`;
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const posLabel=k=>({support:"Support",oppose:"Oppose",unsure:"Unsure",noComment:"No comment"})[k]||k;
const posClass=k=>k==="noComment"?"no-comment":k;

function amendmentRow(i,data){
  const r=data?.amendments?.[String(i)]||{};
  const counts={support:+(r.support||0),oppose:+(r.oppose||0),unsure:+(r.unsure||0),noComment:+(r.noComment||0)};
  const total=Object.values(counts).reduce((a,b)=>a+b,0);
  const leader=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
  return {i,counts,total,leader,title:amendments[i-1]?.title||`Amendment ${i}`,meta:amendments[i-1]||{}};
}

function listHtml(items){
  if(!items?.length)return "<li>None listed.</li>";
  return items.map(x=>`<li>${esc(x)}</li>`).join("");
}

function renderAmendments(data){
  const rows=[];
  for(let i=1;i<=21;i++){
    const x=amendmentRow(i,data);
    const cells=Object.entries(x.counts).map(([k,v])=>`<div class="result-cell"><b>${pctText(v,x.total)}</b><span>${posLabel(k)} · ${fmt(v)}</span></div>`).join("");
    const bars=Object.entries(x.counts).map(([k,v])=>`<span class="${posClass(k)}" style="width:${pct(v,x.total)}%"></span>`).join("");
    const supportReasons=x.meta.support||[];
    const opposeReasons=x.meta.oppose||[];
    const unsureReasons=x.meta.unsure||[];
    rows.push(`
      <article class="amendment-card">
        <div class="amendment-top">
          <div><div class="amendment-num">Amendment ${i}</div><div class="amendment-title">${esc(x.title)}</div></div>
          <div class="leading-result"><strong>${x.leader&&x.total?`${posLabel(x.leader[0])} ${pctText(x.leader[1],x.total)}`:"No data"}</strong><span>${fmt(x.total)} recorded responses</span></div>
        </div>
        <div class="stackbar">${bars}</div>
        <div class="result-grid">${cells}</div>
        <details class="reason-context">
          <summary>Reasons presented to respondents</summary>
          <p class="reason-note"><strong>Note:</strong> the original backend did not store amendment-level reason selections, so historical counts for individual reasons cannot be reconstructed. These are the reason options respondents were shown.</p>
          <div class="reason-columns">
            <div class="reason-box"><h4>Support reasons</h4><ul>${listHtml(supportReasons)}</ul></div>
            <div class="reason-box"><h4>Opposition concerns</h4><ul>${listHtml(opposeReasons)}</ul></div>
            <div class="reason-box"><h4>Unsure reasons</h4><ul>${listHtml(unsureReasons)}</ul></div>
          </div>
        </details>
      </article>`);
  }
  $("amendmentResults").innerHTML=rows.join("");
}

function rankedAmendments(containerId,data,key,limit=10){
  const rows=Array.from({length:21},(_,idx)=>amendmentRow(idx+1,data))
    .filter(x=>x.total)
    .sort((a,b)=>pct(b.counts[key],b.total)-pct(a.counts[key],a.total))
    .slice(0,limit);
  $(containerId).innerHTML=rows.map((x,i)=>`<div class="rank-item"><div class="rank-no">${i+1}</div><div class="rank-label">Amendment ${x.i}: ${esc(x.title)}<span class="rank-sub">${fmt(x.counts[key])} of ${fmt(x.total)} recorded responses</span></div><div class="rank-count">${pctText(x.counts[key],x.total)}</div></div>`).join("");
}

function renderRanked(containerId,obj,limit=10){
  const rows=Object.values(obj||{}).filter(x=>x&&x.label).map(x=>({label:String(x.label),count:+(x.count||0)})).sort((a,b)=>b.count-a.count).slice(0,limit);
  $(containerId).innerHTML=rows.length?rows.map((x,i)=>`<div class="rank-item"><div class="rank-no">${i+1}</div><div class="rank-label">${esc(x.label)}</div><div class="rank-count">${fmt(x.count)}</div></div>`).join(""):'<div class="loading">No aggregate selections were recorded.</div>';
}

function renderKeyFindings(data){
  const rows=Array.from({length:21},(_,idx)=>amendmentRow(idx+1,data)).filter(x=>x.total);
  const majorityOppose=rows.filter(x=>pct(x.counts.oppose,x.total)>50).length;
  const majoritySupport=rows.filter(x=>pct(x.counts.support,x.total)>50).length;
  const strongestOppose=[...rows].sort((a,b)=>pct(b.counts.oppose,b.total)-pct(a.counts.oppose,a.total))[0];
  const strongestSupport=[...rows].sort((a,b)=>pct(b.counts.support,b.total)-pct(a.counts.support,a.total))[0];
  const mostDivided=[...rows].sort((a,b)=>{
    const top2=x=>Object.values(x.counts).map(v=>pct(v,x.total)).sort((m,n)=>n-m).slice(0,2);
    const aa=top2(a),bb=top2(b);
    return (aa[0]-aa[1])-(bb[0]-bb[1]);
  })[0];

  const findings=[
    [`${majorityOppose} of 21`,`amendments recorded more than 50% opposition.`],
    [`${majoritySupport} of 21`,`amendments recorded more than 50% support.`],
    [strongestOppose?`Amendment ${strongestOppose.i} · ${pctText(strongestOppose.counts.oppose,strongestOppose.total)}`:"—","highest recorded opposition."],
    [strongestSupport?`Amendment ${strongestSupport.i} · ${pctText(strongestSupport.counts.support,strongestSupport.total)}`:"—","highest recorded support."],
    [mostDivided?`Amendment ${mostDivided.i}`:"—","closest split between the two leading response categories."]
  ];
  $("keyFindings").innerHTML=findings.map(([a,b])=>`<div class="finding"><strong>${esc(a)}</strong><span>${esc(b)}</span></div>`).join("");
}

async function loadResults(){
  try{
    const [totalSnap,resultsSnap]=await Promise.all([
      get(ref(db,"communityParticipation/generatedSubmissions")),
      get(ref(db,"communityResults"))
    ]);
    const generated=+(totalSnap.val()||0),data=resultsSnap.val()||{};
    $("generatedTotal").textContent=fmt(generated);
    $("recordedTotal").textContent=fmt(data.recordedSubmissions||0);
    renderKeyFindings(data);
    renderAmendments(data);
    rankedAmendments("mostOpposed",data,"oppose");
    rankedAmendments("mostSupported",data,"support");
    renderRanked("furtherSuggestions",data.furtherSuggestions);
    renderRanked("closingSuggestions",data.closingSuggestions);
  }catch(err){
    console.error(err);
    $("errorBox").classList.remove("hidden");
    $("errorBox").textContent="The anonymous results could not be loaded from Firebase. Check that Realtime Database read access remains enabled after the write lock is published.";
  }
}
$("printBtn").addEventListener("click",()=>window.print());
loadResults();
