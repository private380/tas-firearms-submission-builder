
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
function positionClass(position){
 return String(position||"").toLowerCase().replace(/\s+/g,"-");
}

function buildSubmission(){
 const d=state.details;
 const sections=[];
 const text=["SUBMISSION REGARDING THE FIREARMS AMENDMENT (MISCELLANEOUS) BILL 2026","","To: Strategy and Support, Department of Police, Fire and Emergency Management","","I have reviewed the proposed amendments and provide the following individual submission.",""];

 if(Object.values(d).some(Boolean)){
   text.push("ABOUT ME");
   const details=[];
   if(d.name){text.push("Name: "+d.name);details.push(["Name",d.name])}
   if(d.town){text.push("Location: "+d.town);details.push(["Location",d.town])}
   if(d.email){text.push("Email: "+d.email);details.push(["Email",d.email])}
   if(d.background){text.push("Background or interest: "+d.background);details.push(["Background or interest",d.background])}
   text.push("");
   sections.push({type:"details",items:details});
 }

 state.answers.forEach((a,i)=>{
   const x=amendments[i];
   const reasons=[...a.reasons];
   if(a.otherReason)reasons.push(a.otherReason);
   const alternatives=[...a.alternatives];
   if(a.otherAlternative)alternatives.push(a.otherAlternative);

   text.push("----------------------------------------------------------------");
   text.push(`AMENDMENT ${i+1}`);
   text.push(x.title);
   text.push("");
   text.push("Position: "+a.position);

   if(reasons.length){
     text.push("");
     text.push(a.position==="Support" ? "Reasons given in support:" :
               a.position==="Oppose" ? "Concerns raised:" : "Reasons for remaining unsure:");
     reasons.forEach(r=>text.push("- "+r));
   }
   if(alternatives.length){
     text.push("");
     text.push("Suggested alternatives:");
     alternatives.forEach(r=>text.push("- "+r));
   }
   if(a.comments){
     text.push("");
     text.push("Additional comments:");
     text.push(a.comments);
   }
   text.push("");

   sections.push({
     type:"amendment",
     number:i+1,
     title:x.title,
     official:x.official,
     position:a.position,
     reasons,
     alternatives,
     comments:a.comments
   });
 });

 if(state.suggestions){
   text.push("----------------------------------------------------------------","FURTHER SUGGESTIONS","",state.suggestions,"");
   sections.push({type:"further",title:"Further suggestions",body:state.suggestions});
 }
 if(state.closing){
   text.push("CLOSING COMMENTS","",state.closing,"");
   sections.push({type:"closing",title:"Closing comments",body:state.closing});
 }

 text.push("Thank you for considering my submission.");
 if(d.name)text.push("","Kind regards,",d.name);

 return {
   text:text.join("\r\n"),
   sections,
   details:d,
   generated:new Date()
 };
}

function renderDocument(doc,targetId,forPrint=false){
 const target=$(targetId);
 const details=doc.details||{};
 const counts={Support:0,Oppose:0,Unsure:0,"No comment":0};
 const amendmentsOnly=doc.sections.filter(s=>s.type==="amendment");
 amendmentsOnly.forEach(s=>counts[s.position]++);

 const overallSentence=`Overall, this submission supports ${counts.Support} amendment${counts.Support===1?"":"s"}, opposes ${counts.Oppose}, is unsure about ${counts.Unsure}, and records no comment on ${counts["No comment"]}.`;

 const coverDetails=[
   details.name?`<div><span>Name</span><strong>${esc(details.name)}</strong></div>`:"",
   details.town?`<div><span>Location</span><strong>${esc(details.town)}</strong></div>`:"",
   details.email?`<div><span>Email</span><strong>${esc(details.email)}</strong></div>`:"",
   details.background?`<div><span>Background or interest</span><strong>${esc(details.background)}</strong></div>`:""
 ].join("");

 const coverHtml=`<section class="pdf-cover">
   <div class="pdf-cover-inner">
     <div class="document-kicker">Individual consultation submission</div>
     <h1>Firearms Amendment<br>(Miscellaneous) Bill 2026</h1>
     <p class="pdf-cover-subtitle">Prepared in response to the Tasmanian Government consultation</p>
     ${coverDetails?`<div class="pdf-cover-details">${coverDetails}</div>`:""}
     <div class="pdf-cover-meta">
       <span>Prepared ${doc.generated.toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"})}</span>
       <span>Tas Firearms Submission Builder</span>
     </div>
   </div>
 </section>`;

 const compactRows=amendmentsOnly.map(s=>`
   <tr>
     <td>${s.number}</td>
     <td><span class="summary-badge ${positionClass(s.position)}">${esc(s.position)}</span></td>
   </tr>`).join("");

 const summaryHtml=`<section class="pdf-summary-page">
   <div class="document-kicker">Executive summary</div>
   <h1>Submission summary</h1>
   <p class="summary-sentence">${esc(overallSentence)}</p>
   <div class="summary-counts">
     <div class="support"><strong>${counts.Support}</strong><span>Support</span></div>
     <div class="oppose"><strong>${counts.Oppose}</strong><span>Oppose</span></div>
     <div class="unsure"><strong>${counts.Unsure}</strong><span>Unsure</span></div>
     <div class="no-comment"><strong>${counts["No comment"]}</strong><span>No comment</span></div>
   </div>
   <table class="summary-table compact-summary-table">
     <thead><tr><th>Amendment</th><th>Position</th></tr></thead>
     <tbody>${compactRows}</tbody>
   </table>
 </section>`;

 const amendmentHtml=amendmentsOnly.map(s=>{
   const reasonTitle=s.position==="Support"?"Reasons given in support":
                     s.position==="Oppose"?"Concerns that have been raised":
                     s.position==="Unsure"?"Reasons for remaining unsure":"";
   return `<section class="document-amendment position-${positionClass(s.position)}">
     <div class="document-amendment-top">
       <div>
         <div class="document-amendment-number">Amendment ${s.number}</div>
         <h2>${esc(s.title)}</h2>
       </div>
       <span class="document-position-badge ${positionClass(s.position)}">${esc(s.position)}</span>
     </div>
     ${s.reasons.length?`<div class="document-subsection"><h3>${reasonTitle}</h3><ul>${s.reasons.map(r=>`<li>${esc(r)}</li>`).join("")}</ul></div>`:""}
     ${s.alternatives.length?`<div class="document-subsection"><h3>Suggested alternatives</h3><ul>${s.alternatives.map(r=>`<li>${esc(r)}</li>`).join("")}</ul></div>`:""}
     ${s.comments?`<div class="document-subsection"><h3>Additional comments</h3><p>${esc(s.comments).replace(/\n/g,"<br>")}</p></div>`:""}
   </section>`;
 }).join("");

 const furtherHtml=doc.sections.filter(s=>s.type==="further"||s.type==="closing").map(s=>
   `<section class="document-amendment position-neutral"><h2>${esc(s.title)}</h2><p>${esc(s.body).replace(/\n/g,"<br>")}</p></section>`
 ).join("");

 target.innerHTML=`<div class="document-page">
   ${coverHtml}
   ${summaryHtml}
   <section class="pdf-body">
     <div class="document-recipient">
       <strong>To:</strong> Strategy and Support<br>
       Department of Police, Fire and Emergency Management
     </div>
     <p class="document-intro">I have reviewed the proposed amendments and provide the following individual submission.</p>
     ${amendmentHtml}
     ${furtherHtml}
     <footer class="document-signoff">
       <p>Thank you for considering my submission.</p>
       ${details.name?`<p>Kind regards,<br><strong>${esc(details.name)}</strong></p>`:""}
     </footer>
   </section>
 </div>`;

 target.setAttribute("aria-hidden",forPrint?"false":"true");
}
function generate(){
 if(missing().length)return showMissing();
 const doc=buildSubmission();
 $("output").value=doc.text;
 renderDocument(doc,"formattedPreview");
 renderDocument(doc,"printDocument",true);
 show("result");
}

function createPdf(){
 const doc=buildSubmission();
 const printTarget=$("printDocument");

 // Remove any stale print content before creating a fresh print document.
 printTarget.innerHTML="";
 renderDocument(doc,"printDocument",true);

 document.body.classList.add("printing-submission");

 requestAnimationFrame(()=>{
   requestAnimationFrame(()=>{
     window.print();
   });
 });
}
window.addEventListener("afterprint",()=>{
 document.body.classList.remove("printing-submission");
 const printTarget=$("printDocument");
 printTarget.innerHTML="";
 printTarget.setAttribute("aria-hidden","true");
});

function buildEmailBody(){
 const doc=buildSubmission();
 const d=doc.details||{};
 const lines=[
   "Dear Strategy and Support,",
   "",
   "Please find my submission regarding the Firearms Amendment (Miscellaneous) Bill 2026 below.",
   "",
   "============================================================",
   "SUBMISSION",
   "============================================================",
   ""
 ];

 if(d.name)lines.push("Name: "+d.name);
 if(d.town)lines.push("Location: "+d.town);
 if(d.email)lines.push("Email: "+d.email);
 if(d.background)lines.push("Background or interest: "+d.background);
 if(Object.values(d).some(Boolean))lines.push("");

 state.answers.forEach((a,i)=>{
   const x=amendments[i];
   lines.push("------------------------------------------------------------");
   lines.push(`AMENDMENT ${i+1}`);
   lines.push(x.title);
   lines.push("");
   lines.push("POSITION: "+a.position.toUpperCase());

   const reasons=[...a.reasons];
   if(a.otherReason)reasons.push(a.otherReason);
   if(reasons.length){
     lines.push("");
     lines.push(a.position==="Support"?"Reasons given in support:":
                a.position==="Oppose"?"Concerns that have been raised:":"Reasons for remaining unsure:");
     reasons.forEach(r=>lines.push("• "+r));
   }

   const alternatives=[...a.alternatives];
   if(a.otherAlternative)alternatives.push(a.otherAlternative);
   if(alternatives.length){
     lines.push("");
     lines.push("Suggested alternatives:");
     alternatives.forEach(r=>lines.push("• "+r));
   }

   if(a.comments){
     lines.push("");
     lines.push("Additional comments:");
     lines.push(a.comments);
   }
   lines.push("");
 });

 if(state.suggestions)lines.push("============================================================","FURTHER SUGGESTIONS","============================================================","",state.suggestions,"");
 if(state.closing)lines.push("CLOSING COMMENTS","",state.closing,"");

 lines.push("Thank you for considering my submission.");
 if(d.name)lines.push("","Kind regards,",d.name);
 return lines.join("\r\n");
}
$("startBtn").onclick=()=>show("details");$("backWelcome").onclick=()=>show("welcome");$("beginBtn").onclick=()=>{save();state.current=0;render();show("amendmentCard")};
$("prevBtn").onclick=()=>{save();if(!state.current)show("details");else{state.current--;render()}};
$("nextBtn").onclick=()=>{save();if(state.current===20)show("finalComments");else{state.current++;render()}};
$("backLast").onclick=()=>{save();state.current=20;render();show("amendmentCard")};$("reviewBtn").onclick=review;$("editBtn").onclick=()=>{state.current=0;render();show("amendmentCard")};$("generateBtn").onclick=generate;
$("modalClose").onclick=()=>$("modal").classList.add("hidden");$("modalContinue").onclick=()=>{const m=missing();$("modal").classList.add("hidden");state.current=(m[0]||1)-1;render();show("amendmentCard")};
$("pdfBtn").onclick=createPdf;
$("copyBtn").onclick=async()=>{try{await navigator.clipboard.writeText($("output").value)}catch{$("output").select();document.execCommand("copy")}$("copyStatus").textContent="Submission copied to clipboard."};
$("emailBtn").onclick=()=>{const to="submissions.strategy.support@DPFEM.tas.gov.au",sub=encodeURIComponent("Submission - Firearms Amendment (Miscellaneous) Bill 2026"),body=encodeURIComponent(buildEmailBody());location.href=`mailto:${to}?subject=${sub}&body=${body}`};
["name","town","email","background","suggestions","closing"].forEach(id=>$(id).addEventListener("input",save));load();progress();
