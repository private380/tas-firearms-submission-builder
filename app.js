
const amendments=window.BUILDER_DATA;
const KEY="tas-firearms-submission-builder-v4";
let state={current:0,answers:Array.from({length:21},()=>({position:"",reasons:[],otherReason:"",alternatives:[],otherAlternative:"",comments:""})),details:{},suggestions:"",closing:""};
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

function save(){
 state.details={name:$("name").value,town:$("town").value,email:$("email").value,background:$("background").value};
 state.suggestions=$("suggestions").value;state.closing=$("closing").value;
 localStorage.setItem(KEY,JSON.stringify(state));progress();
}
function load(){
 try{const s=JSON.parse(localStorage.getItem(KEY));if(s?.answers?.length===21)state=s}catch{}
 ["name","town","email","background"].forEach(k=>$(k).value=state.details?.[k]||"");
 $("suggestions").value=state.suggestions||"";$("closing").value=state.closing||"";
}
function show(id){["welcome","details","amendmentCard","finalComments","review","result"].forEach(x=>$(x).classList.add("hidden"));$(id).classList.remove("hidden");$("progressWrap").classList.toggle("hidden",id==="welcome");scrollTo({top:0,behavior:"smooth"})}
function progress(){const n=state.answers.filter(a=>a.position).length;$("progressBar").style.width=`${n/21*100}%`;$("progressLabel").textContent=`${n} of 21 answered`;$("stepLabel").textContent=`Amendment ${Math.min(state.current+1,21)} of 21`}
function checkedList(container,values,onChange){
 container.innerHTML=values.map(v=>`<label class="reason"><input type="checkbox"><span>${esc(v)}</span></label>`).join("");
 return [...container.querySelectorAll("input")].map((c,i)=>({c,v:values[i],onChange}));
}
function render(){
 const i=state.current,x=amendments[i],a=state.answers[i];
 $("amendmentNumber").textContent=`Amendment ${i+1} of 21`;
 $("amendmentTitle").textContent=x.title;$("official").textContent=x.official;$("plain").textContent=x.plain;$("current").textContent=x.current;$("proposed").textContent=x.proposed;
 $("guideLink").href=`https://nicholas380.github.io/tas-firearms-amendment-guide/#amendments`;
 $("affected").innerHTML=(x.affected||[]).map(v=>`<li>${esc(v)}</li>`).join("");
 $("positionOptions").innerHTML=["Support","Oppose","Unsure","No comment"].map(p=>`<button class="option ${a.position===p?"active":""}" data-p="${p}">${p}</button>`).join("");
 $("positionOptions").querySelectorAll("button").forEach(b=>b.onclick=()=>{a.position=b.dataset.p;if(a.position==="No comment"){a.reasons=[];a.alternatives=[];a.otherReason="";a.otherAlternative=""}save();render()});
 const values=a.position==="Support"?x.support:a.position==="Oppose"?x.oppose:a.position==="Unsure"?x.unsure:[];
 $("reasonArea").classList.toggle("hidden",!values.length);
 $("reasonHeading").textContent=a.position==="Support"?"Reasons given in support of the proposal":a.position==="Oppose"?"Concerns that have been raised":"Reasons for remaining unsure";
 $("reasonOptions").innerHTML=values.map(v=>`<label class="reason"><input type="checkbox" ${a.reasons.includes(v)?"checked":""}><span>${esc(v)}</span></label>`).join("");
 $("reasonOptions").querySelectorAll("input").forEach(c=>c.onchange=()=>{a.reasons=[...$("reasonOptions").querySelectorAll("input:checked")].map(q=>q.parentElement.querySelector("span").textContent);save()});
 $("otherReason").value=a.otherReason||"";$("otherReason").oninput=e=>{a.otherReason=e.target.value;save()};
 const showAlt=a.position==="Oppose";$("alternativeArea").classList.toggle("hidden",!showAlt);
 $("alternativeOptions").innerHTML=(x.alternatives||[]).map(v=>`<label class="reason"><input type="checkbox" ${a.alternatives.includes(v)?"checked":""}><span>${esc(v)}</span></label>`).join("");
 $("alternativeOptions").querySelectorAll("input").forEach(c=>c.onchange=()=>{a.alternatives=[...$("alternativeOptions").querySelectorAll("input:checked")].map(q=>q.parentElement.querySelector("span").textContent);save()});
 $("otherAlternative").value=a.otherAlternative||"";$("otherAlternative").oninput=e=>{a.otherAlternative=e.target.value;save()};
 $("comments").value=a.comments||"";$("comments").oninput=e=>{a.comments=e.target.value;save()};
 $("prevBtn").textContent=i===0?"Back to details":"Back";$("nextBtn").textContent=i===20?"Further suggestions":"Next";progress();
}
function missing(){return state.answers.map((a,i)=>a.position?null:i+1).filter(Boolean)}
function showMissing(){const m=missing();$("missingList").innerHTML="<strong>Unanswered amendments:</strong><br>"+m.map(n=>`Amendment ${n}`).join("<br>");$("modal").classList.remove("hidden")}
function review(){
 save();if(missing().length)return showMissing();
 $("reviewSummary").innerHTML=`<div class="summary-row"><span>Personal details</span><strong>${Object.values(state.details).some(Boolean)?"Added":"Optional"}</strong></div><div class="summary-row"><span>Amendments completed</span><strong>21 of 21</strong></div><div class="summary-row"><span>Further suggestions</span><strong>${state.suggestions?"Added":"None"}</strong></div>`;
 const c={Support:0,Oppose:0,Unsure:0,"No comment":0};state.answers.forEach(a=>c[a.position]++);
 $("positionTotals").innerHTML=Object.entries(c).map(([k,v])=>`<div><strong>${v}</strong>${k}</div>`).join("");show("review");
}
function generate(){
 if(missing().length)return showMissing();
 const d=state.details,L=["Submission regarding the Firearms Amendment (Miscellaneous) Bill 2026 consultation","","To Strategy and Support, Department of Police, Fire and Emergency Management,","","I have reviewed the proposed amendments and provide the following individual submission.",""];
 if(Object.values(d).some(Boolean)){L.push("ABOUT ME");if(d.name)L.push("Name: "+d.name);if(d.town)L.push("Location: "+d.town);if(d.email)L.push("Email: "+d.email);if(d.background)L.push("Background or interest: "+d.background);L.push("")}
 L.push("COMMENTS ON THE PROPOSED AMENDMENTS","");
 state.answers.forEach((a,i)=>{const x=amendments[i];L.push(`${i+1}. ${x.title}`,x.official,`Position: ${a.position}`);if(a.reasons.length||a.otherReason){L.push("Reasons:");a.reasons.forEach(r=>L.push("- "+r));if(a.otherReason)L.push("- "+a.otherReason)}if(a.alternatives.length||a.otherAlternative){L.push("Suggested alternatives:");a.alternatives.forEach(r=>L.push("- "+r));if(a.otherAlternative)L.push("- "+a.otherAlternative)}if(a.comments)L.push("Additional comments: "+a.comments);L.push("")});
 if(state.suggestions)L.push("FURTHER SUGGESTIONS",state.suggestions,"");if(state.closing)L.push("CLOSING COMMENTS",state.closing,"");L.push("Thank you for considering my submission.");if(d.name)L.push("","Kind regards,",d.name);$("output").value=L.join("\n");show("result");
}
$("startBtn").onclick=()=>show("details");$("backWelcome").onclick=()=>show("welcome");$("beginBtn").onclick=()=>{save();state.current=0;render();show("amendmentCard")};
$("prevBtn").onclick=()=>{save();if(!state.current)show("details");else{state.current--;render()}};
$("nextBtn").onclick=()=>{save();if(state.current===20)show("finalComments");else{state.current++;render()}};
$("backLast").onclick=()=>{save();state.current=20;render();show("amendmentCard")};$("reviewBtn").onclick=review;$("editBtn").onclick=()=>{state.current=0;render();show("amendmentCard")};$("generateBtn").onclick=generate;
$("modalClose").onclick=()=>$("modal").classList.add("hidden");$("modalContinue").onclick=()=>{const m=missing();$("modal").classList.add("hidden");state.current=(m[0]||1)-1;render();show("amendmentCard")};
$("copyBtn").onclick=async()=>{try{await navigator.clipboard.writeText($("output").value)}catch{$("output").select();document.execCommand("copy")}$("copyStatus").textContent="Submission copied to clipboard."};
$("emailBtn").onclick=()=>{const to="submissions.strategy.support@DPFEM.tas.gov.au",sub=encodeURIComponent("Submission – Firearms Amendment (Miscellaneous) Bill 2026"),body=encodeURIComponent($("output").value);location.href=`mailto:${to}?subject=${sub}&body=${body}`};
["name","town","email","background","suggestions","closing"].forEach(id=>$(id).addEventListener("input",save));load();progress();
