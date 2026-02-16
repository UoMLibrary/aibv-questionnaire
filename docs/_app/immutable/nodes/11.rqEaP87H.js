import{a as w,f as _}from"../chunks/3MeJAyDi.js";import{i as Y}from"../chunks/Biedmao3.js";import{Y as l,Z as n,W as f,_ as N,w as c,a6 as Z,a7 as H,S as ee,a1 as h,at as I,T as te,I as J,X as F,A as ae,a0 as re,aA as X}from"../chunks/CiiSKS_t.js";import{s as p,e as V}from"../chunks/DNPCJNaY.js";import{i as U}from"../chunks/D0zR2ufV.js";import{e as G,i as K}from"../chunks/hyMIDi62.js";import{s as oe,q as ne}from"../chunks/BOebZ5Rj.js";import{p as z}from"../chunks/J5fKBZMv.js";var ie=_('<div class="flex items-center gap-3"><div class="min-w-[24rem] max-w-xs text-sm leading-snug break-words"> </div> <div class="flex-1 bg-slate-200/60 rounded h-2"><div class="bg-slate-700 h-2 rounded transition-all"></div></div> <div class="w-8 text-sm text-right"> </div></div>'),le=_('<div class="space-y-2 w-full  max-w-4xl "></div>');function ce(q,T){let $=z(T,"values",8);const o=Object.entries($()),v=Math.max(...o.map(([,m])=>m),1);var x=le();G(x,5,()=>o,K,(m,j)=>{var d=Z(()=>H(c(j),2));let R=()=>c(d)[0],S=()=>c(d)[1];var g=ie(),b=l(g),A=l(b,!0);n(b);var y=f(b,2),k=l(y);n(y);var O=f(y,2),M=l(O,!0);n(O),n(g),N(()=>{p(A,R()),oe(k,`width: ${S()/v*100}%`),p(M,S())}),w(m,g)}),n(x),w(q,x)}var de=_('<p class="text-sm">Average score: <strong> </strong> </p>'),fe=_("<li> </li>"),ue=_('<details class="mt-2"><summary class="cursor-pointer text-sm"> </summary> <ul class="mt-1 text-sm text-slate-700"></ul></details>'),ve=_('<div class="rounded-xl border bg-white p-5 shadow-sm space-y-3"><div class="flex items-start justify-between gap-4"><h3 class="font-medium"> </h3> <button type="button" class="shrink-0 text-xs rounded-md border px-2 py-1 text-slate-600 hover:bg-slate-100" title="Copy a Markdown summary suitable for pasting into an LLM or document"> </button></div> <p class="text-sm text-slate-500"> </p> <!> <!> <!></div>');function pe(q,T){ee(T,!1);let $=z(T,"qid",8),o=z(T,"data",8),v=J(!1);function x(){let e=`### ${$()} — ${d.prompt}
`;if(e+=`Responses: ${o().count}

`,d.type==="rating"&&R!==null&&(e+=`**Average rating:** ${R} / ${d.max}

`),(d.type==="single"||d.type==="multi")&&o().values){e+=`**Response distribution:**
`;for(const[t,a]of Object.entries(o().values)){const s=S[t]??t;e+=`- ${s}: ${a}
`}e+=`
`}if(j.length){e+=`**Top themes:**
`;for(const[t,a]of j)e+=`- ${t} (${a})
`;e+=`
`}if(o().freeText?.length){e+=`**Representative responses:**
`;for(const t of o().freeText.slice(0,5))e+=`- “${t}”
`}return e}async function m(){try{await navigator.clipboard.writeText(x()),F(v,!0),setTimeout(()=>F(v,!1),1500)}catch{alert("Unable to copy to clipboard")}}const j=[],d=o().question,R=d.type==="rating"&&o().count>0?(o().sum/o().count).toFixed(2):null,S=d.options?Object.fromEntries(d.options.map(e=>[e.id,e.label])):{};Y();var g=ve(),b=l(g),A=l(b),y=l(A);n(A);var k=f(A,2),O=l(k,!0);n(k),n(b);var M=f(b,2),E=l(M);n(M);var C=f(M,2);{var P=e=>{var t=de(),a=f(l(t)),s=l(a,!0);n(a);var r=f(a);n(t),N(()=>{p(s,R),p(r,` / ${h(()=>d.max)??""}`)}),w(e,t)};U(C,e=>{h(()=>d.type==="rating")&&e(P)})}var D=f(C,2);{var Q=e=>{{let t=ae(()=>(I(o()),h(()=>Object.fromEntries(Object.entries(o().values).map(([a,s])=>[S[a]??a,s])))));ce(e,{get values(){return c(t)}})}};U(D,e=>{h(()=>d.type==="single"||d.type==="multi")&&e(Q)})}var W=f(D,2);{var B=e=>{var t=ue(),a=l(t),s=l(a);n(a);var r=f(a,2);G(r,5,()=>(I(o()),h(()=>o().freeText)),K,(i,u)=>{var L=fe(),se=l(L);n(L),N(()=>p(se,`• ${c(u)??""}`)),w(i,L)}),n(r),n(t),N(()=>p(s,`Verbatim responses (${I(o()),h(()=>o().freeText.length)??""})`)),w(e,t)};U(W,e=>{I(o()),h(()=>o().freeText.length)&&e(B)})}n(g),N(()=>{p(y,`${$()??""}. ${h(()=>d.prompt)??""}`),p(O,c(v)?"Copied ✓":"Copy Markdown"),p(E,`Responses: ${I(o()),h(()=>o().count)??""}`)}),V("click",k,m),w(q,g),te()}var me=_('<div class="text-sm text-slate-700 space-y-1"><div><strong> </strong> </div> <div class="text-xs text-slate-500"> </div></div>'),xe=_('<div class="space-y-6"></div>'),ge=_(`<section class="bg-slate-50 min-h-screen py-10"><div class="mx-auto max-w-5xl px-6 space-y-8"><header class="space-y-2"><h2 class="text-2xl font-semibold tracking-tight text-slate-900">Questionnaire analysis</h2> <p class="text-sm text-slate-600 max-w-2xl">Aggregated results from submitted questionnaire response files.
				Data is analysed per question and shown in summary form.</p></header> <div class="flex justify-end"><button type="button" class="text-sm rounded-md border px-3 py-1.5 text-slate-700 hover:bg-slate-100">Export full Markdown report</button></div> <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"><div class="flex flex-col gap-2"><label class="text-sm font-medium text-slate-700">Response files</label> <input type="file" multiple webkitdirectory accept=".json" class="block w-full text-sm text-slate-700
						file:mr-4 file:rounded-lg file:border-0
						file:bg-slate-900 file:px-4 file:py-2
						file:text-sm file:font-medium file:text-white
						hover:file:bg-slate-800"/> <p class="text-xs text-slate-500">Select the folder containing downloaded questionnaire response JSON files. Other files (for example system or hidden files) will be ignored automatically.</p></div> <!></div> <!></div></section>`);function be(q,T){ee(T,!1);let $=J(0),o=J(0),v=J(0),x=[],m=J({});const j=new Map;for(const e of ne.sections)for(const t of e.questions)j.set(t.id,t);async function d(e){const t=e.currentTarget;if(!t.files||t.files.length===0)return;if(x=[],F(m,{}),F($,t.files.length),F(o,0),F(v,0),!Array.from(t.files).some(s=>s.webkitRelativePath&&s.webkitRelativePath.includes("/"))){alert("Please select a folder containing the response files.");return}for(const s of Array.from(t.files))if(s.name.toLowerCase().endsWith(".json")){X(o);try{const r=JSON.parse(await s.text());x.push(r),X(v)}catch{console.warn("Skipping invalid JSON:",s.name)}}if(c(v)===0){alert("No valid questionnaire JSON files were found in this folder.");return}g()}const R=new Set(["the","and","to","of","a","in","for","is","on","that","with","as","are","it","be","or","by","this","an","at","from","if","but","we","they","their","our"]);function S(e){const t={};for(const a of e){const s=a.toLowerCase().replace(/[^a-z0-9\s]/g,"").split(/\s+/).filter(r=>r.length>2&&!R.has(r));for(const r of s)t[r]=(t[r]||0)+1}return t}function g(){const e={};for(const t of x)for(const[a,s]of Object.entries(t.answers)){const r=j.get(a);if(!r)continue;e[a]||(e[a]={question:r,count:0,values:{},sum:0,freeText:[],keywords:{}});const i=e[a];if(i.count++,r.type==="rating"&&typeof s.value=="number"&&(i.sum+=s.value),r.type==="single"&&typeof s.value=="string"&&(i.values[s.value]=(i.values[s.value]||0)+1),r.type==="multi"&&Array.isArray(s.value))for(const u of s.value)i.values[u]=(i.values[u]||0)+1;r.type==="text"&&typeof s.value=="string"&&s.value.trim()&&i.freeText.push(s.value.trim()),s.otherText?.trim()&&i.freeText.push(s.otherText.trim())}for(const t of Object.values(e))t.freeText.length>0&&(t.keywords=S(t.freeText));F(m,e)}function b(){let e=`# Questionnaire Analysis Report

`;e+=`Generated: ${new Date().toISOString()}

`,e+=`Valid responses processed: ${c(v)}

`,e+=`---

`;for(const[t,a]of Object.entries(c(m))){const s=a.question;if(e+=`## ${t}. ${s.prompt}

`,e+=`Responses: ${a.count}

`,s.type==="rating"&&a.count>0){const r=(a.sum/a.count).toFixed(2);e+=`**Average rating:** ${r} / ${s.max}

`}if((s.type==="single"||s.type==="multi")&&a.values){e+=`**Response distribution:**

`;const r=s.options?Object.fromEntries(s.options.map(i=>[i.id,i.label])):{};for(const[i,u]of Object.entries(a.values)){const L=r[i]??i;e+=`- ${L}: ${u}
`}e+=`
`}if(a.keywords&&Object.keys(a.keywords).length>0){const r=Object.entries(a.keywords).sort((i,u)=>u[1]-i[1]).slice(0,5);e+=`**Top themes:**

`;for(const[i,u]of r)e+=`- ${i} (${u})
`;e+=`
`}if(a.freeText?.length){e+=`**Representative responses:**

`;for(const r of a.freeText.slice(0,5))e+=`- "${r}"
`;e+=`
`}e+=`---

`}return e}async function A(){const e=b();await navigator.clipboard.writeText(e);const t=new Blob([e],{type:"text/markdown"}),a=URL.createObjectURL(t),s=document.createElement("a");s.href=a,s.download=`questionnaire-analysis-${new Date().toISOString()}.md`,s.click(),URL.revokeObjectURL(a)}Y();var y=ge(),k=l(y),O=f(l(k),2),M=l(O);n(O);var E=f(O,2),C=l(E),P=f(l(C),2);re(2),n(C);var D=f(C,2);{var Q=e=>{var t=me(),a=l(t),s=l(a),r=l(s,!0);n(s);var i=f(s);n(a);var u=f(a,2),L=l(u);n(u),n(t),N(()=>{p(r,c(v)),p(i,` valid response file${c(v)===1?"":"s"} processed`),p(L,`(${c(o)??""} JSON file${c(o)===1?"":"s"} found in ${c($)??""} total file${c($)===1?"":"s"})`)}),w(e,t)};U(D,e=>{c(v)>0&&e(Q)})}n(E);var W=f(E,2);{var B=e=>{var t=xe();G(t,5,()=>Object.entries(c(m)),K,(a,s)=>{var r=Z(()=>H(c(s),2));let i=()=>c(r)[0],u=()=>c(r)[1];pe(a,{get qid(){return i()},get data(){return u()}})}),n(t),w(e,t)};U(W,e=>{Object.keys(c(m)).length>0&&e(B)})}n(k),n(y),V("click",M,A),V("change",P,d),w(q,y),te()}function Te(q){be(q,{})}export{Te as component};
