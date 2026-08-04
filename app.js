
const amendments=window.BUILDER_DATA;
const KEY="tas-firearms-submission-builder-v4";
let state={current:0,answers:Array.from({length:21},()=>({position:"",reasons:[],otherReason:"",alternatives:[],otherAlternative:"",comments:""})),details:{},selectedFurtherSuggestions:[],selectedClosingSuggestions:[],suggestions:"",closing:"",countedCurrentSubmission:false};
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

const FURTHER_SUGGESTIONS=[
 "Require all firearm safes to be securely affixed to the floor and/or wall.",
 "Require a monitored alarm or camera system for all firearm safes.",
 "Require a monitored alarm or camera system where five or more firearms are stored.",
 "Require break-away, movement or tamper alarms to be fitted to firearm safes.",
 "Require concealed GPS tracking devices to be fitted to firearm safes.",
 "Require hard-wired security cameras with battery backup and off-site or cloud recording for firearm storage areas.",
 "Require firearm-safe keys to be kept in a separate room, secured in a separate locked location, or carried on the licence holder's person.",
 "Modernise firearm storage laws, including clearer requirements for anchoring safes and preventing whole-safe theft.",
 "Prioritise theft prevention, secure storage and enforcement against unlawful possession before imposing broad reclassifications on lawful owners.",
 "Publish the evidence relied upon for each firearm reclassification and explain the expected public-safety benefit.",
 "Separate broadly supported administrative and criminal-law reforms from contentious firearm reclassification proposals.",
 "Provide clear grandfathering, compensation and transition arrangements for owners of firearms or magazines that are currently lawful.",
 "Review each affected firearm type individually rather than grouping manually operated actions together without demonstrated evidence of equivalent risk.",
 "Increase penalties for stealing firearms or assisting firearm theft.",
 "Increase resources for investigating illegal firearm trafficking and unlawful possession.",
 "Provide grants or rebates to help lawful owners upgrade firearm storage.",
 "Introduce recognised security ratings for safes based on the number and type of firearms stored.",
 "Introduce enhanced storage requirements for larger firearm collections.",
 "Focus future reforms on reducing theft, unlawful possession and criminal misuse while minimising unnecessary impacts on people already complying with the law."
];

const CLOSING_SUGGESTIONS=[
 "I support amendments that have a demonstrated and proportionate public-safety benefit, but I do not support changes based primarily on optics, political pressure or unsupported assumptions.",
 "This legislation should not proceed unchanged until storage-law weaknesses, transition arrangements and the evidence supporting reclassification have been properly addressed.",
 "Some amendments may make a real difference to community safety, while others may unfairly affect lawful owners without a demonstrated reduction in risk.",
 "Lawful firearm ownership and criminal misuse should be treated as separate policy questions, with restrictions directed at the actual source of harm.",
 "The final legislation should strike a fair balance between community safety and the rights and responsibilities of people already complying with the law."
];

function isSocialInAppBrowser(){
 const ua=navigator.userAgent||"";
 return /FBAN|FBAV|Instagram|Messenger|Line\/|Twitter/i.test(ua);
}

function updateGeneratedCounter(){
 // The live total is supplied by firebase-counter.js.
}

function save(){
 state.details={name:$("name").value,town:$("town").value,email:$("email").value,background:$("background").value};
 state.suggestions=$("suggestions").value;state.closing=$("closing").value;
 localStorage.setItem(KEY,JSON.stringify(state));progress();updateGeneratedCounter();
}
function load(){
 try{const s=JSON.parse(localStorage.getItem(KEY));if(s?.answers?.length===21)state=s}catch{}
 if(!Array.isArray(state.selectedFurtherSuggestions))state.selectedFurtherSuggestions=[];
 if(!Array.isArray(state.selectedClosingSuggestions))state.selectedClosingSuggestions=[];
 if(typeof state.countedCurrentSubmission!=="boolean")state.countedCurrentSubmission=false;
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
 $("guideLink").href=`https://private380.github.io/tas-firearms-amendment-guide/#amendments`;
 $("affected").innerHTML=(x.affected||[]).map(v=>`<li>${esc(v)}</li>`).join("");
 $("positionOptions").innerHTML=["Support","Oppose","Unsure","No comment"].map(p=>`<button class="option ${a.position===p?"active":""}" data-p="${p}">${p}</button>`).join("");
 $("positionOptions").querySelectorAll("button").forEach(b=>b.onclick=()=>{state.countedCurrentSubmission=false;a.position=b.dataset.p;if(a.position==="No comment"){a.reasons=[];a.alternatives=[];a.otherReason="";a.otherAlternative=""}save();render()});
 const values=a.position==="Support"?x.support:a.position==="Oppose"?x.oppose:a.position==="Unsure"?x.unsure:[];
 $("reasonArea").classList.toggle("hidden",!values.length);
 $("reasonHeading").textContent=a.position==="Support"?"Reasons given in support of the proposal":a.position==="Oppose"?"Concerns that have been raised":"Reasons for remaining unsure";
 $("reasonOptions").innerHTML=values.map(v=>`<label class="reason"><input type="checkbox" ${a.reasons.includes(v)?"checked":""}><span>${esc(v)}</span></label>`).join("");
 $("reasonOptions").querySelectorAll("input").forEach(c=>c.onchange=()=>{a.reasons=[...$("reasonOptions").querySelectorAll("input:checked")].map(q=>q.parentElement.querySelector("span").textContent);save()});
 $("otherReason").value=a.otherReason||"";$("otherReason").oninput=e=>{state.countedCurrentSubmission=false;a.otherReason=e.target.value;save()};
 const showAlt=a.position==="Oppose";$("alternativeArea").classList.toggle("hidden",!showAlt);
 $("alternativeOptions").innerHTML=(x.alternatives||[]).map(v=>`<label class="reason"><input type="checkbox" ${a.alternatives.includes(v)?"checked":""}><span>${esc(v)}</span></label>`).join("");
 $("alternativeOptions").querySelectorAll("input").forEach(c=>c.onchange=()=>{a.alternatives=[...$("alternativeOptions").querySelectorAll("input:checked")].map(q=>q.parentElement.querySelector("span").textContent);save()});
 $("otherAlternative").value=a.otherAlternative||"";$("otherAlternative").oninput=e=>{state.countedCurrentSubmission=false;a.otherAlternative=e.target.value;save()};
 $("comments").value=a.comments||"";$("comments").oninput=e=>{state.countedCurrentSubmission=false;a.comments=e.target.value;save()};
 $("prevBtn").textContent=i===0?"Back to details":"Back";$("nextBtn").textContent=i===20?"Further suggestions":"Next";progress();
}

function renderFinalSuggestions(){
 $("furtherSuggestionOptions").innerHTML=FURTHER_SUGGESTIONS.map(v=>`<label class="reason"><input type="checkbox" ${state.selectedFurtherSuggestions.includes(v)?"checked":""}><span>${esc(v)}</span></label>`).join("");
 $("furtherSuggestionOptions").querySelectorAll("input").forEach(c=>c.onchange=()=>{
   state.countedCurrentSubmission=false;state.selectedFurtherSuggestions=[...$("furtherSuggestionOptions").querySelectorAll("input:checked")].map(q=>q.parentElement.querySelector("span").textContent);
   save();
 });

 $("closingSuggestionOptions").innerHTML=CLOSING_SUGGESTIONS.map(v=>`<label class="reason"><input type="checkbox" ${state.selectedClosingSuggestions.includes(v)?"checked":""}><span>${esc(v)}</span></label>`).join("");
 $("closingSuggestionOptions").querySelectorAll("input").forEach(c=>c.onchange=()=>{
   state.countedCurrentSubmission=false;state.selectedClosingSuggestions=[...$("closingSuggestionOptions").querySelectorAll("input:checked")].map(q=>q.parentElement.querySelector("span").textContent);
   save();
 });
}

function missing(){return state.answers.map((a,i)=>a.position?null:i+1).filter(Boolean)}
function showMissing(){const m=missing();$("missingList").innerHTML="<strong>Unanswered amendments:</strong><br>"+m.map(n=>`Amendment ${n}`).join("<br>");$("modal").classList.remove("hidden")}
function review(){
 save();if(missing().length)return showMissing();
 $("reviewSummary").innerHTML=`<div class="summary-row"><span>Personal details</span><strong>${Object.values(state.details).some(Boolean)?"Added":"Optional"}</strong></div><div class="summary-row"><span>Amendments completed</span><strong>21 of 21</strong></div><div class="summary-row"><span>Further suggestions</span><strong>${((state.selectedFurtherSuggestions||[]).length||state.suggestions)?"Added":"None"}</strong></div>`;
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

 const allFurther=[...(state.selectedFurtherSuggestions||[])];
 if(state.suggestions)allFurther.push(state.suggestions);
 if(allFurther.length){
   text.push("----------------------------------------------------------------","FURTHER SUGGESTIONS","");
   allFurther.forEach(v=>text.push("• "+v));
   text.push("");
   sections.push({type:"further",title:"Further suggestions",items:allFurther});
 }

 const allClosing=[...(state.selectedClosingSuggestions||[])];
 if(state.closing)allClosing.push(state.closing);
 if(allClosing.length){
   text.push("CLOSING COMMENTS","");
   allClosing.forEach(v=>text.push("• "+v));
   text.push("");
   sections.push({type:"closing",title:"Closing comments",items:allClosing});
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
   <div class="summary-position-item">
     <span class="summary-number">${s.number}</span>
     <span class="summary-badge ${positionClass(s.position)}">${esc(s.position)}</span>
   </div>`).join("");

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
   <div class="compact-summary-grid">
     ${compactRows}
   </div>
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

 const furtherHtml=doc.sections.filter(s=>s.type==="further"||s.type==="closing").map(s=>{
   const items=Array.isArray(s.items)?s.items:[s.body].filter(Boolean);
   return `<section class="document-amendment position-neutral">
     <h2>${esc(s.title)}</h2>
     ${items.length?`<ul class="document-final-list">${items.map(item=>`<li>${esc(item)}</li>`).join("")}</ul>`:""}
   </section>`;
 }).join("");

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
 const shouldRecordGeneration=!state.countedCurrentSubmission;
 if(shouldRecordGeneration && typeof window.recordGlobalPdfGeneration==="function"){
   window.recordGlobalPdfGeneration()
     .then(recorded=>{
       if(recorded){
         state.countedCurrentSubmission=true;
         save();
       }
     })
     .catch(error=>{
       console.warn("The shared submission counter could not be updated.",error);
     });
 }
 const doc=buildSubmission();

 // Render the final document in the existing hidden print target first.
 renderDocument(doc,"printDocument",true);
 const printHtml=$("printDocument").innerHTML;

 // Use a separate print window. This is more reliable on iPhone/iPad
 // than trying to print a hidden element inside the main application.
 const printWindow=window.open("","_blank");
 if(!printWindow){
   alert("Your browser blocked the PDF window. Please allow pop-ups for this site, then try again.");
   return;
 }

 const cssLinks=[...document.querySelectorAll('link[rel="stylesheet"]')]
   .map(link=>`<link rel="stylesheet" href="${link.href}">`)
   .join("");

 printWindow.document.open();
 printWindow.document.write(`<!doctype html>
 <html lang="en-AU">
 <head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width,initial-scale=1">
   <title>Firearms Amendment Submission</title>
   ${cssLinks}
   <style>
     body{background:#fff!important;margin:0!important;padding:0!important}
     #printDocument{display:block!important;width:auto!important;height:auto!important;overflow:visible!important}
     .document-page{display:block!important}
     @media screen{
       body{padding:12px!important}
     }
   </style>
 </head>
 <body class="printing-submission">
   <article id="printDocument">${printHtml}</article>
   <script>
     window.addEventListener("load",()=>{
       setTimeout(()=>window.print(),350);
     });
   <\/script>
 </body>
 </html>`);
 printWindow.document.close();
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
$("nextBtn").onclick=()=>{save();if(state.current===20){renderFinalSuggestions();show("finalComments")}else{state.current++;render()}};
$("backLast").onclick=()=>{save();state.current=20;render();show("amendmentCard")};$("reviewBtn").onclick=review;$("editBtn").onclick=()=>{state.current=0;render();show("amendmentCard")};$("generateBtn").onclick=generate;
$("modalClose").onclick=()=>$("modal").classList.add("hidden");$("modalContinue").onclick=()=>{const m=missing();$("modal").classList.add("hidden");state.current=(m[0]||1)-1;render();show("amendmentCard")};
$("pdfBtn").onclick=createPdf;
$("copyBtn").onclick=async()=>{try{await navigator.clipboard.writeText($("output").value)}catch{$("output").select();document.execCommand("copy")}$("copyStatus").textContent="Submission copied to clipboard."};
$("emailBtn").onclick=()=>{
 const d=state.details||{};
 const recipient="submissions.strategy.support@DPFEM.tas.gov.au";
 const subject=encodeURIComponent("Submission - Firearms Amendment (Miscellaneous) Bill 2026");
 const name=d.name||"";
 const body=[
   "Dear Strategy and Support,",
   "",
   "Please find attached my submission for consideration regarding the proposed Firearms Amendment (Miscellaneous) Bill 2026.",
   "",
   "Thank you for considering my views as part of the consultation process.",
   "",
   "Kind regards,",
   name
 ].join("\r\n");
 location.href=`mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(body)}`;
};
["name","town","email","background","suggestions","closing"].forEach(id=>$(id).addEventListener("input",()=>{
 state.countedCurrentSubmission=false;
 save();
}));

if(isSocialInAppBrowser())$("inAppBrowserWarning").classList.remove("hidden");

$("copySiteLinkBtn").onclick=async()=>{
 try{
   await navigator.clipboard.writeText(location.href);
   $("copySiteLinkBtn").textContent="Link copied";
 }catch{
   prompt("Copy this website address:",location.href);
 }
};

load();
renderFinalSuggestions();
progress();
updateGeneratedCounter();
