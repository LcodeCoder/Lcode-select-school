(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();const f=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${e}</svg>`,ce={search:f('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),filter:f('<path d="M4 5h16M7 12h10M10 19h4"/>'),back:f('<path d="m15 18-6-6 6-6"/>'),home:f('<path d="M3 12 12 4l9 8v8h-6v-5h-6v5H3z"/>'),chevronRight:f('<path d="m9 18 6-6-6-6"/>'),chevronDown:f('<path d="m6 9 6 6 6-6"/>'),x:f('<path d="M18 6 6 18M6 6l12 12"/>'),plus:f('<path d="M12 5v14M5 12h14"/>'),edit:f('<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),trash:f('<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),save:f('<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/>'),message:f('<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/>'),pin:f('<path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>'),bed:f('<path d="M2 9V5M2 19v-6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6M2 17h20M6 11V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>'),ac:f('<rect x="3" y="6" width="18" height="9" rx="1.5"/><path d="M6 9v3M10 9v3M14 9v3M18 9v3M7 18l-1 2M12 18v2M17 18l1 2"/>'),bath:f('<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5H4a1 1 0 0 0 0 2h1l3 3M4 11h16M5 11v3a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-3M7 18l-1 3M17 18l1 3"/>'),laundry:f('<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6h.01M12 6h.01"/>'),power:f('<path d="M12 2v10M18.4 6.6a9 9 0 1 1-12.8 0"/>'),wifi:f('<path d="M5 12.55a11 11 0 0 1 14 0M8.5 16.1a6 6 0 0 1 7 0M12 19.5h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/>'),metro:f('<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16M8 19l-2 3M16 19l2 3"/><circle cx="9" cy="15" r="1"/><circle cx="15" cy="15" r="1"/>'),cart:f('<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 2h3l3 13h12l2-8H6"/>'),bike:f('<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17 9 9h5l3 8M9 9l-2 5M14 9l-3 5"/>'),book:f('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14ZM4 19.5V21h16"/>'),clock:f('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),building:f('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 21V12h6v9M9 7h.01M15 7h.01M9 11h.01M15 11h.01"/>'),check:f('<path d="M20 6 9 17l-5-5"/>'),alert:f('<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z"/>'),info:f('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v4h1"/>'),user:f('<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a7 7 0 0 1 14 0v1"/>'),settings:f('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>'),shield:f('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>'),sun:f('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>'),moon:f('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>'),package:f('<path d="m7.5 4.27 9 5.15M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>'),eye:f('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'),flame:f('<path d="M12 2c1.5 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1 .3-1.7.8-2.5C8 9 8.5 10 9.5 10.5 9 8 10.5 5 12 2Z"/><path d="M8.5 14a3.5 3.5 0 1 0 7 0c0-1-.3-2-1-2.5.3 1.5-.7 2.5-2 2.5-.5-1.5-2-2-3-1.5-.3.5-.5 1-.5 1.5Z"/>'),vs:f('<path d="M7 9 3 12l4 3M17 9l4 3-4 3M14 6l-4 12"/>'),trophy:f('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M6 4h12v5a6 6 0 0 1-12 0V4ZM9 21h6M10 17v4M14 17v4"/>'),chart:f('<path d="M3 21h18M7 17V9M12 17V5M17 17v-7"/>'),swap:f('<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>'),zap:f('<path d="M13 2 4 14h7l-2 8 9-12h-7l2-8Z"/>')};function u(e,t=20){return(ce[e]||ce.info).replace("<svg ",`<svg width="${t}" height="${t}" `)}const te="dorm:school-overrides",M="dorm:comments",J="dorm:admin",fe="dorm:theme",ve="dorm:views",qe="lyh20041113lyh";function C(e,t){try{const a=localStorage.getItem(e);return a?JSON.parse(a):t}catch{return t}}function T(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch(a){console.warn("localStorage write failed",a)}}function V(){return C(te,{})}function he(e){return V()[e]||null}function Oe(e,t){const a=V(),n=a[e]||{};return a[e]={...n,...t,id:e,updatedAt:Date.now()},T(te,a),a[e]}function He(e){const t=V();delete t[e],T(te,t)}function Be(e){return!!V()[e]}function j(e){return(C(M,{})[e]||[]).slice().sort((a,n)=>n.createdAt-a.createdAt)}function Pe(e,{author:t,body:a}){const n=C(M,{}),i=n[e]||[],s={id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,schoolId:e,author:(t||"匿名").trim().slice(0,24)||"匿名",body:a.trim().slice(0,600),createdAt:Date.now()};return i.push(s),n[e]=i,T(M,n),s}function De(e,t,{author:a,body:n}){const i=C(M,{}),s=i[e]||[],l=s.findIndex(d=>d.id===t);return l===-1?null:(s[l]={...s[l],author:(a||"匿名").trim().slice(0,24)||"匿名",body:n.trim().slice(0,600),updatedAt:Date.now()},i[e]=s,T(M,i),s[l])}function be(e,t){const a=C(M,{}),n=(a[e]||[]).filter(i=>i.id!==t);a[e]=n,T(M,a)}function G(e){return j(e).length}function ae(){return C(ve,{})}function Q(e){return ae()[e]||0}function Ie(e){const t=ae();return t[e]=(t[e]||0)+1,T(ve,t),t[e]}function ze(e=5){const t=ae();return Object.entries(t).map(([a,n])=>({id:Number(a),count:n})).sort((a,n)=>n.count-a.count).slice(0,e)}function A(){return sessionStorage.getItem(J)==="1"}function Ve(e){e?sessionStorage.setItem(J,"1"):sessionStorage.removeItem(J)}function X(){return localStorage.getItem(fe)||"system"}function je(e){localStorage.setItem(fe,e),ne()}function ne(){const e=X(),t=e==="dark"||e==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=t?"dark":"light"}function Ne(){return document.documentElement.dataset.theme==="dark"}function Ze(){return new Promise(e=>{const t=document.createElement("div");document.body.appendChild(t),t.innerHTML=`
      <dialog id="admin-login-dialog" aria-label="管理员登录">
        <form class="drawer" style="max-width: 360px;" id="admin-login-form">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
            <span style="color: var(--primary);">${u("shield",22)}</span>
            <h2 style="font-size: 1.0625rem; font-weight: 600;">进入管理员模式</h2>
          </div>
          <p style="color: var(--muted); font-size: 0.8125rem; line-height: 1.6; margin-bottom: 14px;">输入管理员密码以编辑学校信息或管理评论。</p>
          <div class="field" style="margin-bottom: 16px;">
            <label class="field-label" for="admin-password">管理员密码</label>
            <input type="password" class="input" id="admin-password" autocomplete="off" autofocus required />
          </div>
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button type="button" class="btn btn-secondary" data-close>取消</button>
            <button type="submit" class="btn btn-primary">进入</button>
          </div>
        </form>
      </dialog>
    `;const a=t.querySelector("dialog");a.showModal();const n=()=>{a.remove(),t.remove()},i=s=>{n(),e(s)};a.addEventListener("click",s=>{s.target===a&&i(!1)}),t.querySelector("[data-close]").addEventListener("click",()=>i(!1)),t.querySelector("#admin-login-form").addEventListener("submit",s=>{s.preventDefault();const l=t.querySelector("#admin-password").value;i(l===qe)}),a.addEventListener("close",()=>{t.isConnected&&i(!1)})})}function ge(){const e=location.hash.replace(/^#/,"");if(!e||e==="/"||e==="")return{name:"list",params:{}};const t=e.split("/").filter(Boolean);return t[0]==="school"&&t[1]?{name:"detail",params:{id:decodeURIComponent(t[1])}}:t[0]==="compare"&&t[1]&&t[2]?{name:"compare",params:{a:decodeURIComponent(t[1]),b:decodeURIComponent(t[2])}}:t[0]==="about"?{name:"about",params:{}}:{name:"list",params:{}}}const P=new Set;let D=ge();window.addEventListener("hashchange",()=>{D=ge();for(const e of P)e(D)});function oe(){return D}function Re(e){return P.add(e),()=>P.delete(e)}function k(e){if(e.startsWith("#")||(e="#"+e),location.hash===e)for(const t of P)t(D);else location.hash=e}function ye(e){return e==="yes"?{cls:"tag-yes",label:"有"}:e==="no"?{cls:"tag-no",label:"无"}:e==="partial"?{cls:"tag-partial",label:"部分有"}:e==null?{cls:"tag-neutral",label:"—"}:{cls:"tag-neutral",label:String(e)}}function Fe(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("较贵")||t.includes("贵")?{cls:"tag-no",label:t}:t.includes("便宜")?{cls:"tag-yes",label:t}:t.includes("一般")||t.includes("适中")?{cls:"tag-partial",label:t}:{cls:"tag-neutral",label:t}}function We(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("非常方便")?{cls:"tag-yes",label:t}:t.includes("比较方便")||t.includes("方便")?{cls:"tag-yes",label:t}:t.includes("一般")?{cls:"tag-partial",label:t}:t.includes("不方便")||t.includes("较差")?{cls:"tag-no",label:t}:{cls:"tag-neutral",label:t}}function Ye(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("在市区")?{cls:"tag-yes",label:t}:t.includes("不在市区")?{cls:"tag-partial",label:t}:{cls:"tag-neutral",label:t}}function _e(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("不查")?{cls:"tag-yes",label:t}:t.includes("很少")?{cls:"tag-yes",label:t}:t.includes("有时")?{cls:"tag-partial",label:t}:t.includes("严")||t.includes("经常")?{cls:"tag-no",label:t}:{cls:"tag-neutral",label:t}}function $e(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("不断电")?{cls:"tag-yes",label:"不断电"}:t.includes("断电")?{cls:"tag-partial",label:t}:{cls:"tag-neutral",label:t}}function Ke(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("不断网")?{cls:"tag-yes",label:"不断网"}:t.includes("断网")?{cls:"tag-no",label:t}:{cls:"tag-neutral",label:t}}function Ue(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("好")||t.includes("快")?{cls:"tag-yes",label:t}:t.includes("一般")?{cls:"tag-partial",label:t}:t.includes("差")||t.includes("慢")||t.includes("无")?{cls:"tag-no",label:t}:{cls:"tag-neutral",label:t}}function Je(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("免费")?{cls:"tag-yes",label:t}:t.includes("低")?{cls:"tag-yes",label:t}:t.includes("贵")||t.includes("高")?{cls:"tag-no",label:t}:t.includes("一般")?{cls:"tag-partial",label:t}:{cls:"tag-neutral",label:t}}function Ge(e){return e?{cls:"tag-info",label:String(e)}:{cls:"tag-neutral",label:"无门禁"}}function Qe(e){const t=new Date(e),a=new Date,n=a-t,i=Math.floor(n/6e4);if(i<1)return"刚刚";if(i<60)return`${i} 分钟前`;const s=Math.floor(i/60);if(s<24)return`${s} 小时前`;const l=Math.floor(s/24);if(l<7)return`${l} 天前`;const d=t.getFullYear()===a.getFullYear(),m=`${t.getMonth()+1}月${t.getDate()}日`;return d?m:`${t.getFullYear()}年${m}`}function c(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const ie=document.createElement("div");ie.className="toast-wrap";document.body.appendChild(ie);function $(e,t=2400){const a=document.createElement("div");a.className="toast",a.textContent=e,ie.appendChild(a),setTimeout(()=>{a.style.opacity="0",a.style.transition="opacity 200ms var(--ease)",setTimeout(()=>a.remove(),220)},t)}function ee({title:e,message:t,confirmText:a="确认",cancelText:n="取消",danger:i=!1}){return new Promise(s=>{const l=document.createElement("dialog");l.innerHTML=`
      <form method="dialog" class="drawer" style="max-width: 420px;">
        <h3 style="font-size: 1.0625rem; margin-bottom: 8px;">${c(e)}</h3>
        <p style="color: var(--muted); font-size: 0.875rem; line-height: 1.6; margin-bottom: 20px;">${c(t)}</p>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button type="button" data-act="cancel" class="btn btn-secondary">${c(n)}</button>
          <button type="button" data-act="confirm" class="btn ${i?"btn-danger":"btn-primary"}">${c(a)}</button>
        </div>
      </form>
    `,document.body.appendChild(l),l.showModal();const d=m=>{l.close(),l.remove(),s(m)};l.querySelector('[data-act="cancel"]').addEventListener("click",()=>d(!1)),l.querySelector('[data-act="confirm"]').addEventListener("click",()=>d(!0)),l.addEventListener("close",()=>{l.isConnected&&d(!1)})})}function Xe(){const e=A();return`
    <header class="app-header">
      <div class="app-header-inner">
        <a class="brand" href="#/" data-nav="home" aria-label="Lcode-select-school 首页">
          <span class="brand-icon">${u("home",26)}</span>
          <span>Lcode-select-school</span>
          <span class="brand-tag">宿舍数据</span>
        </a>
        <div style="flex: 1"></div>
        <button type="button" class="btn-ghost theme-toggle" id="theme-toggle" aria-label="切换主题" title="切换主题">
          <span class="icon-moon">${u("moon",20)}</span>
          <span class="icon-sun">${u("sun",20)}</span>
        </button>
        <button type="button" class="btn-ghost" id="admin-toggle" aria-pressed="${e}" aria-label="${e?"退出管理员模式":"进入管理员模式"}" title="${e?"退出管理员模式":"进入管理员模式"}">
          ${u(e?"shield":"settings",20)}
        </button>
      </div>
    </header>
  `}function et(){const e=document.getElementById("theme-toggle");e==null||e.addEventListener("click",()=>{X();const n=Ne()?"light":"dark";je(n),$(n==="dark"?"已切换到深色模式":"已切换到浅色模式")}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{X()==="system"&&ne()});const t=document.getElementById("admin-toggle");t==null||t.addEventListener("click",async()=>{const n=!A();if(n&&!await Ze()){$("密码错误");return}Ve(n),t.setAttribute("aria-pressed",String(n)),t.setAttribute("aria-label",n?"退出管理员模式":"进入管理员模式"),t.innerHTML=u(n?"shield":"settings",20);const i=new CustomEvent("admin-changed",{detail:n});window.dispatchEvent(i)});const a=document.querySelector('[data-nav="home"]');a==null||a.addEventListener("click",n=>{n.preventDefault(),k("/")})}let x=null,H=null;async function R(){return x||H||(H=fetch("data/schools.json").then(e=>{if(!e.ok)throw new Error(`HTTP ${e.status}`);return e.json()}).then(e=>(x=e,e)).catch(e=>{throw H=null,e}),H)}function F(e){if(!x)return null;const t=Number(e),a=x.schools.find(i=>i.id===t);if(!a)return null;const n=he(t);return tt(a,n)}function tt(e,t){if(!t)return e;const a={...e,...t};return t.facilities&&(a.facilities={...e.facilities,...t.facilities}),t.around&&(a.around={...e.around,...t.around}),a}function se(){return x?x.schools:[]}function at(e,t){let a;return a=ye(e),`<span class="tag ${a.cls}">${c(a.label)}</span>`}function B(e,t,a){return`<span class="labeled-tag">${c(e)}${at(t)}</span>`}function nt(e,t=0){const a=e.facilities||{},n=e.around||{},i=[];if(a.dormAC&&i.push(B("空调",a.dormAC)),a.bedDesk&&i.push(B("上床下桌",a.bedDesk)),a.roomSize&&i.push(`<span class="labeled-tag">${c(String(a.roomSize))}人间</span>`),a.privateBath&&i.push(B("卫浴",a.privateBath)),n.subway&&i.push(B("地铁",n.subway)),a.nightPowerOff){const l=$e(a.nightPowerOff);l.cls!=="tag-neutral"&&i.push(`<span class="labeled-tag">夜间${c(l.label)}</span>`)}const s=[];return e.province&&s.push(e.province),e.city&&s.push(e.city),e.cityType&&s.push(`<span class="tag tag-neutral">${c(e.cityType)}</span>`),e.nature&&s.push(`<span class="tag tag-neutral">${c(e.nature)}</span>`),`
    <button type="button" class="school-card" data-school-id="${e.id}">
      <div class="school-card-head">
        <div>
          <div class="school-card-name">${c(e.name)}</div>
          <div class="school-card-meta">${s.join('<span class="dot"></span>')}</div>
        </div>
        ${e.edited?'<span class="tag tag-info">已编辑</span>':""}
      </div>
      ${i.length?`<div class="school-card-tags">${i.join("")}</div>`:""}
      <div class="school-card-foot">
        <span class="comment-count"><span class="comment-emoji" aria-hidden="true">💬</span><span>${t}</span></span>
        <span class="arrow">看详情 ${u("chevronRight",14)}</span>
      </div>
    </button>
  `}function it({title:e,text:t,actionLabel:a,actionId:n}){return`
    <div class="empty-state">
      <div class="empty-state-emoji" aria-hidden="true">🔍</div>
      <div class="empty-state-icon">${u("info",48)}</div>
      <div class="empty-state-title">${c(e)}</div>
      <div class="empty-state-text">${c(t)}</div>
      ${`<button type="button" class="btn btn-primary" id="${n}">${c(a)}</button>`}
    </div>
  `}function ke(e){const t=[];e.province&&t.push({key:"province",label:e.province}),e.city&&t.push({key:"city",label:e.city}),e.cityType&&t.push({key:"cityType",label:e.cityType}),e.level&&t.push({key:"level",label:e.level}),e.nature&&t.push({key:"nature",label:e.nature}),e.bedDesk&&t.push({key:"bedDesk",label:"上床下桌"}),e.dormAC&&t.push({key:"dormAC",label:"宿舍空调"}),e.privateBath&&t.push({key:"privateBath",label:"独立卫浴"}),e.subway&&t.push({key:"subway",label:"地铁"}),e.roomSize&&t.push({key:"roomSize",label:`${e.roomSize}人间`}),e.nightPowerOff==="no"&&t.push({key:"nightPowerOff",label:"不断电"}),e.nightNetOff==="no"&&t.push({key:"nightNetOff",label:"不断网"});const a=t.map(i=>`
    <button type="button" class="chip" data-filter-clear="${i.key}" aria-pressed="true">
      ${c(i.label)}
      <span class="chip-x" aria-hidden="true">${u("x",12)}</span>
    </button>
  `).join("");return`
    <div class="filter-bar">
      ${`
    <button type="button" class="chip" id="open-filter" aria-haspopup="dialog">
      ${u("filter",16)}
      <span>筛选</span>
      ${t.length?`<span style="font-variant-numeric: tabular-nums;">${t.length}</span>`:""}
    </button>
  `}
      ${a}
      ${t.length?'<button type="button" class="chip" id="clear-all-filters" style="color: var(--accent); border-color: color-mix(in oklch, var(--accent) 30%, transparent);">清除全部</button>':""}
    </div>
  `}function de(e,t){const a=(t.provinces||[]).map(r=>`
    <button type="button" class="chip" data-filter="province" data-value="${c(r)}" aria-pressed="${e.province===r}">${c(r)}</button>
  `).join(""),n=(t.cityTypes||[]).map(r=>`
    <button type="button" class="chip" data-filter="cityType" data-value="${c(r)}" aria-pressed="${e.cityType===r}">${c(r)}</button>
  `).join(""),i=(t.levels||[]).map(r=>`
    <button type="button" class="chip" data-filter="level" data-value="${c(r)}" aria-pressed="${e.level===r}">${c(r)}</button>
  `).join(""),s=(t.natures||[]).map(r=>`
    <button type="button" class="chip" data-filter="nature" data-value="${c(r)}" aria-pressed="${e.nature===r}">${c(r)}</button>
  `).join(""),l=(t.roomSizes||[]).map(r=>`
    <button type="button" class="chip" data-filter="roomSize" data-value="${c(r)}" aria-pressed="${e.roomSize===r}">${c(r)}人间</button>
  `).join(""),d=(r,p,b)=>[{v:"yes",label:"有"},{v:"no",label:"无"},{v:"partial",label:"部分有"}].map(y=>`
      <button type="button" class="chip" data-filter="${r}" data-value="${y.v}" aria-pressed="${p===y.v}">${y.label}</button>
    `).join(""),m=(r,p,b)=>`
      <button type="button" class="chip" data-filter="${r}" data-value="no" aria-pressed="${p==="no"}">不断${b}</button>
      <button type="button" class="chip" data-filter="${r}" data-value="yes" aria-pressed="${p==="yes"}">会断${b}</button>
    `;return`
    <dialog id="filter-dialog" aria-label="筛选条件">
      <div class="drawer">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h2 style="font-size: 1.0625rem;">筛选</h2>
          <button type="button" class="btn-ghost" data-close-filter aria-label="关闭">${u("x",20)}</button>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">省份</div>
          <div class="filter-chips">${a||'<span class="text-muted text-small">无数据</span>'}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">城市等级</div>
          <div class="filter-chips">${n||'<span class="text-muted text-small">无数据</span>'}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">办学层次</div>
          <div class="filter-chips">${i||'<span class="text-muted text-small">无数据</span>'}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">办学性质</div>
          <div class="filter-chips">${s||'<span class="text-muted text-small">无数据</span>'}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">几人间</div>
          <div class="filter-chips">${l||'<span class="text-muted text-small">无数据</span>'}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">上床下桌</div>
          <div class="filter-chips">${d("bedDesk",e.bedDesk)}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">宿舍空调</div>
          <div class="filter-chips">${d("dormAC",e.dormAC)}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">独立卫浴</div>
          <div class="filter-chips">${d("privateBath",e.privateBath)}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">地铁</div>
          <div class="filter-chips">${d("subway",e.subway)}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">夜间断电</div>
          <div class="filter-chips">${m("nightPowerOff",e.nightPowerOff,"电")}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">夜间断网</div>
          <div class="filter-chips">${m("nightNetOff",e.nightNetOff,"网")}</div>
        </div>

        <div class="filter-actions">
          <button type="button" class="btn btn-secondary" style="flex: 1;" data-clear-all>清除全部</button>
          <button type="button" class="btn btn-primary" style="flex: 2;" data-close-filter>查看结果</button>
        </div>
      </div>
    </dialog>
  `}const W=20,le=()=>({q:"",province:"",city:"",cityType:"",level:"",nature:"",bedDesk:"",dormAC:"",privateBath:"",subway:"",roomSize:"",nightPowerOff:"",nightNetOff:"",sort:"default",page:1});let o=le(),we=[],w=[];async function st(e,t){we=e,o.facets=t,S(),rt()}function S(){const e=o.q.trim().toLowerCase();w=we.filter(t=>{if(e&&!`${t.name} ${t.province} ${t.city} ${t.address||""}`.toLowerCase().includes(e)||o.province&&t.province!==o.province||o.city&&t.city!==o.city||o.cityType&&t.cityType!==o.cityType||o.level&&t.level!==o.level||o.nature&&t.nature!==o.nature)return!1;const a=t.facilities||{};if(o.bedDesk&&a.bedDesk!==o.bedDesk||o.dormAC&&a.dormAC!==o.dormAC||o.privateBath&&a.privateBath!==o.privateBath)return!1;if(o.subway){const n=(t.around||{}).subway;if(o.subway==="yes"&&n!=="yes"||o.subway==="no"&&n!=="no"||o.subway==="partial"&&n!=="partial")return!1}return!(o.roomSize&&!String(a.roomSize||"").split(/[、,，]/).map(i=>i.trim()).includes(o.roomSize)||o.nightPowerOff==="no"&&!(a.nightPowerOff||"").includes("不断电")||o.nightPowerOff==="yes"&&(a.nightPowerOff||"").includes("不断电")||o.nightNetOff==="no"&&!(a.nightNetOff||"").includes("不断网")||o.nightNetOff==="yes"&&(a.nightNetOff||"").includes("不断网"))}),o.sort==="comments"?w.sort((t,a)=>G(a.id)-G(t.id)):o.sort==="views"?w.sort((t,a)=>Q(a.id)-Q(t.id)):o.sort==="name"&&w.sort((t,a)=>t.name.localeCompare(a.name,"zh-Hans"))}function lt(){const e=ze(5);if(e.length===0)return"";const t=se(),a=["#ef4444","#f97316","#eab308","#22c55e","#3b82f6"],n=e.map((i,s)=>{const l=t.find(r=>r.id===i.id);if(!l)return"";const d=s+1,m=a[s]||"var(--muted-2)";return`
      <button type="button" class="hot-item" data-school-id="${l.id}">
        <span class="hot-rank" style="color: ${m};">${d}</span>
        <span class="hot-name">${c(l.name)}</span>
        <span class="hot-views">${u("eye",14)}<span>${i.count}</span></span>
      </button>
    `}).join("");return`
    <section class="hot-board" aria-label="热搜学校排名">
      <div class="hot-board-head">
        <div class="hot-board-title">
          <span class="hot-board-icon">${u("flame",18)}</span>
          <span>热搜学校 TOP 5</span>
        </div>
        <span class="hot-board-sub">按浏览次数排序</span>
      </div>
      <div class="hot-board-list">${n}</div>
    </section>
  `}function rt(){const e=document.getElementById("view-host"),t=`
    <main class="app-main">
      <section class="hero">
        <div class="hero-stickers" aria-hidden="true"><span>🛏️</span><span>🚿</span><span>📶</span></div>
        <h1 class="hero-title">查宿舍，挑学校</h1>
        <p class="hero-sub">三千所院校的宿舍与设施一目了然。搜索、筛选、读评论，在 90 秒内排出你的短名单。</p>
      </section>

      ${lt()}

      <section class="search-section">
        <div class="search">
          <span class="search-icon">${u("search",20)}</span>
          <input type="search" id="search-input" class="input" placeholder="学校名 / 城市 / 地址关键字" enterkeyhint="search" autocomplete="off" />
        </div>
        ${ke(o)}
      </section>

      <div class="result-meta">
        <div class="count">
          <span><strong class="num">${w.length}</strong> 所学校</span>
          <select class="select" id="sort-select" style="height: 32px; font-size: 0.8125rem; padding: 0 28px 0 10px; width: auto; min-width: 110px;" aria-label="排序">
            <option value="default">默认排序</option>
            <option value="views" ${o.sort==="views"?"selected":""}>浏览最多</option>
            <option value="comments" ${o.sort==="comments"?"selected":""}>评论最多</option>
            <option value="name" ${o.sort==="name"?"selected":""}>校名 A→Z</option>
          </select>
        </div>
      </div>

      <div id="results"></div>
      <div id="pager"></div>
    </main>
  `;e.innerHTML=t,ot(),ct(),E()}function ct(){document.querySelectorAll(".hot-item").forEach(e=>{e.addEventListener("click",()=>{k(`/school/${e.dataset.schoolId}`)})})}function E(){var l;const e=document.getElementById("results"),t=document.getElementById("pager");if(!e)return;if(w.length===0){e.innerHTML=it({title:"没有匹配的学校",text:"试着清掉一两个筛选项，或者把搜索关键字缩短一些。",actionLabel:"清除全部筛选",actionId:"empty-clear"}),(l=document.getElementById("empty-clear"))==null||l.addEventListener("click",Me),t&&(t.innerHTML="");return}const a=(o.page-1)*W,n=a+W,i=w.slice(a,n);e.innerHTML=`<div class="school-list">${i.map(d=>nt(d,G(d.id))).join("")}</div>`,e.querySelectorAll("[data-school-id]").forEach(d=>{d.addEventListener("click",()=>{k(`/school/${d.dataset.schoolId}`)})});const s=Math.ceil(w.length/W);if(t)if(s<=1)t.innerHTML="";else{const d=o.page,m=[],r=(h,y=h,Z=!1,re=!1)=>{m.push(`<button class="pager-btn${re?" active":""}" ${Z?"disabled":""} data-page="${h}">${y}</button>`)};r(Math.max(1,d-1),"上一页",d===1);const p=Math.max(1,d-2),b=Math.min(s,d+2);p>1&&(r(1),p>2&&m.push('<span class="text-muted">…</span>'));for(let h=p;h<=b;h++)r(h,h,!1,h===d);b<s&&(b<s-1&&m.push('<span class="text-muted">…</span>'),r(s)),r(Math.min(s,d+1),"下一页",d===s),t.innerHTML=`<div class="pager">${m.join("")}</div>`,t.querySelectorAll("[data-page]").forEach(h=>{h.addEventListener("click",()=>{o.page=Number(h.dataset.page),E(),window.scrollTo({top:0,behavior:"smooth"})})})}}function N(){const e=document.querySelector(".search-section .filter-bar");e&&(e.outerHTML=ke(o)),xe();const t=document.getElementById("sort-select");t&&(t.value=o.sort);const a=document.querySelector(".result-meta .count strong");a&&(a.textContent=w.length)}function ot(){var t;const e=document.getElementById("search-input");if(e){let a;e.addEventListener("input",n=>{clearTimeout(a),a=setTimeout(()=>{o.q=n.target.value,o.page=1,S(),E(),N()},180)}),e.value=o.q}(t=document.getElementById("sort-select"))==null||t.addEventListener("change",a=>{o.sort=a.target.value,S(),E()}),xe()}function xe(){var e,t;(e=document.getElementById("open-filter"))==null||e.addEventListener("click",Se),document.querySelectorAll("[data-filter-clear]").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.filterClear;o[n]="",o.page=1,S(),E(),N()})}),(t=document.getElementById("clear-all-filters"))==null||t.addEventListener("click",Me)}function Me(){const e={q:o.q,sort:o.sort,page:1,facets:o.facets};o={...le(),...e},S(),E(),N()}function Se(){var a,n;let e=document.getElementById("filter-panel-host");e||(e=document.createElement("div"),e.id="filter-panel-host",document.body.appendChild(e)),e.innerHTML=de(o,o.facets||{});const t=e.querySelector("dialog");t.showModal(),t.addEventListener("click",i=>{i.target===t&&t.close()}),e.querySelectorAll("[data-filter]").forEach(i=>{i.addEventListener("click",()=>{const s=i.dataset.filter,l=i.dataset.value;o[s]===l?o[s]="":o[s]=l,o.page=1,e.querySelectorAll(`[data-filter="${s}"]`).forEach(d=>{d.setAttribute("aria-pressed",String(o[s]===d.dataset.value))}),S()})}),(a=e.querySelector("[data-close-filter]"))==null||a.addEventListener("click",()=>t.close()),(n=e.querySelector("[data-clear-all]"))==null||n.addEventListener("click",()=>{const i={q:o.q,sort:o.sort,page:1,facets:o.facets};o={...le(),...i},S(),e.innerHTML=de(o,o.facets||{}),t.close(),Se()}),t.addEventListener("close",()=>{E(),N()})}function v(e,t,a={}){return t==null||t===""?`<div class="data-row"><span class="data-key">${c(e)}</span><span class="data-val data-val-text text-muted">—</span></div>`:a.raw?`<div class="data-row"><span class="data-key">${c(e)}</span><span class="data-val data-val-text">${c(t)}</span></div>`:a.tag?`<div class="data-row"><span class="data-key">${c(e)}</span><span class="data-val">${t}</span></div>`:`<div class="data-row"><span class="data-key">${c(e)}</span><span class="data-val data-val-text">${c(t)}</span></div>`}function g(e,t){let a;return t==="price"?a=Fe(e):t==="traffic"?a=We(e):t==="distance"?a=Ye(e):t==="powerOff"?a=$e(e):t==="netOff"?a=Ke(e):t==="checkDorm"?a=_e(e):t==="netSpeed"?a=Ue(e):t==="netPrice"?a=Je(e):t==="curfew"?a=Ge(e):a=ye(e),`<span class="tag ${a.cls}">${c(a.label)}</span>`}function dt(e){const t=A(),a=Be(e.id),n=e.facilities||{},i=e.around||{},s=j(e.id),l=`
    <div class="data-grid">
      ${v("上床下桌",g(n.bedDesk),{tag:!0})}
      ${v("几人间",n.roomSize?`<span class="tag tag-info">${c(String(n.roomSize))}人间</span>`:null,{tag:!0})}
      ${v("宿舍空调",g(n.dormAC),{tag:!0})}
      ${v("教室空调",g(n.classAC),{tag:!0})}
      ${v("独立卫浴",g(n.privateBath),{tag:!0})}
      ${v("洗澡热水时段",n.hotWater,{raw:!0})}
      ${v("洗衣机",n.laundry,{raw:!0})}
      ${v("通宵自习室",n.nightStudy,{raw:!0})}
      ${v("宿舍限电",n.powerLimit,{raw:!0})}
      ${v("夜间断电",g(n.nightPowerOff,"powerOff"),{tag:!0})}
      ${v("夜间断网",g(n.nightNetOff,"netOff"),{tag:!0})}
      ${v("校园网速度",g(n.netSpeed,"netSpeed"),{tag:!0})}
      ${v("校园网价格",g(n.netPrice,"netPrice"),{tag:!0})}
      ${v("大一带电脑",g(n.bringPC),{tag:!0})}
      ${v("查寝情况",g(n.checkDorm,"checkDorm"),{tag:!0})}
      ${v("晚归门禁",g(n.curfew,"curfew"),{tag:!0})}
      ${v("早晚自习",n.selfStudy,{raw:!0})}
      ${v("晨跑要求",n.morningRun,{raw:!0})}
      ${v("跑步打卡",n.runCheck,{raw:!0})}
    </div>
  `,d=`
    <div class="data-grid">
      ${v("地铁",g(i.subway),{tag:!0})}
      ${v("市区距离",g(i.cityDistance,"distance"),{tag:!0})}
      ${v("交通便利",g(i.traffic,"traffic"),{tag:!0})}
      ${v("点外卖",g(i.takeout),{tag:!0})}
      ${v("食堂价格",g(i.canteenPrice,"price"),{tag:!0})}
      ${v("超市价格",g(i.storePrice,"price"),{tag:!0})}
      ${v("收发快递",i.delivery,{raw:!0})}
      ${v("共享单车",i.sharedBike,{raw:!0})}
    </div>
  `,m=s.length?s.map(p=>Ee(p,t)).join(""):`<div class="empty-state" style="padding: 32px 16px;">
         <div class="empty-state-emoji" aria-hidden="true">📝</div>
         <div class="empty-state-text">还没有评论。住过这所学校？留下第一条。</div>
       </div>`,r=`
    <form class="comment-form" id="comment-form">
      <div class="comment-form-row">
        <input type="text" class="input" id="comment-author" placeholder="昵称（可选）" maxlength="24" />
      </div>
      <textarea class="textarea" id="comment-body" placeholder="留下你真实住过这所学校的体验，3 句话就够。" maxlength="600" required></textarea>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
        <span class="text-muted text-small"><span id="char-count">0</span> / 600</span>
        <button type="submit" class="btn btn-primary">${u("plus",16)}<span>发表评论</span></button>
      </div>
    </form>
  `;return`
    <main class="app-main">
      <div class="detail-back-row">
        <a href="#/" class="detail-back" data-back>${u("back",16)}<span>返回列表</span></a>
        <button type="button" class="btn btn-primary detail-vs-btn" id="open-vs">
          ${u("vs",16)}<span>VS 对比</span>
        </button>
      </div>

      <div class="detail-header">
        <div class="detail-title-row">
          <h1 class="detail-name">${c(e.name)}</h1>
          <span class="detail-views" title="本机浏览次数">
            ${u("eye",14)}<span>${Q(e.id)}</span>
          </span>
        </div>
        <div class="detail-meta">
          ${e.province?`<span>${c(e.province)}</span><span class="dot"></span>`:""}
          ${e.city?`<span>${c(e.city)}</span><span class="dot"></span>`:""}
          ${e.cityType?`<span class="tag tag-neutral">${c(e.cityType)}</span>`:""}
          ${e.level?`<span>${c(e.level)}</span>`:""}
          ${e.nature?`<span class="tag tag-neutral">${c(e.nature)}</span>`:""}
          ${a?'<span class="tag tag-info">已编辑</span>':""}
        </div>
        ${e.address?`<div class="text-muted text-small" style="margin-top: 4px; display: flex; align-items: center; gap: 6px;">${u("pin",14)}<span>${c(e.address)}</span></div>`:""}
        ${e.multiCampus?`<div class="text-muted text-small" style="display: flex; align-items: center; gap: 6px;">${u("building",14)}<span>${c(e.multiCampus)}</span></div>`:""}
      </div>

      ${t?pt(a):""}

      <section class="detail-section">
        <h2 class="detail-section-title">${u("bed",18)}<span>宿舍与设施</span></h2>
        ${l}
      </section>

      <section class="detail-section">
        <h2 class="detail-section-title">${u("metro",18)}<span>周边生活</span></h2>
        ${d}
      </section>

      <section class="detail-section">
        <h2 class="detail-section-title">
          ${u("message",18)}<span>评论</span>
          <span class="count num">${s.length}</span>
        </h2>
        ${r}
        <div class="comment-list mt-4" id="comment-list">
          ${m}
        </div>
      </section>
    </main>
  `}function pt(e){return`
    <div class="admin-bar">
      <span>${u("shield",16)}<strong>管理员模式</strong>·编辑会保存在本机</span>
      <div class="admin-bar-actions">
        <button type="button" class="btn btn-secondary" id="edit-school" style="height: 32px; padding: 0 12px; font-size: 0.8125rem;">${u("edit",14)}<span>编辑</span></button>
        ${e?`<button type="button" class="btn btn-danger" id="reset-school" style="height: 32px; padding: 0 12px; font-size: 0.8125rem;">${u("trash",14)}<span>还原</span></button>`:""}
      </div>
    </div>
  `}function Ee(e,t){const a=(e.author||"?").slice(0,1).toUpperCase();return`
    <article class="comment-card" data-comment-id="${e.id}">
      <header class="comment-head">
        <div class="comment-author">
          <span class="comment-avatar">${c(a)}</span>
          <span>${c(e.author)}</span>
        </div>
        <time class="comment-time" datetime="${new Date(e.createdAt).toISOString()}">${Qe(e.createdAt)}</time>
      </header>
      <div class="comment-body">${c(e.body)}</div>
      ${t?`
        <div class="comment-actions">
          <button type="button" class="comment-action" data-act="edit">${u("edit",12)}<span>编辑</span></button>
          <button type="button" class="comment-action danger" data-act="delete">${u("trash",12)}<span>删除</span></button>
        </div>
      `:""}
    </article>
  `}function ut(e){var i,s,l,d;(i=document.querySelector("[data-back]"))==null||i.addEventListener("click",m=>{m.preventDefault(),k("/")});const t=document.getElementById("comment-form"),a=document.getElementById("comment-body"),n=document.getElementById("char-count");a==null||a.addEventListener("input",()=>{n.textContent=a.value.length}),t==null||t.addEventListener("submit",m=>{m.preventDefault();const r=document.getElementById("comment-author").value,p=a.value.trim();if(!p){$("写两句再发吧");return}Pe(e.id,{author:r,body:p}),$("已发表"),I(e),a.value="",n.textContent="0"}),document.querySelectorAll("[data-comment-id]").forEach(m=>{var p,b;const r=m.dataset.commentId;(p=m.querySelector('[data-act="delete"]'))==null||p.addEventListener("click",async()=>{await ee({title:"删除评论？",message:"这条评论会从本机永久删除。",confirmText:"删除",danger:!0})&&(be(e.id,r),$("已删除"),I(e))}),(b=m.querySelector('[data-act="edit"]'))==null||b.addEventListener("click",()=>{Le(e,r)})}),(s=document.getElementById("edit-school"))==null||s.addEventListener("click",()=>mt(e)),(l=document.getElementById("reset-school"))==null||l.addEventListener("click",async()=>{await ee({title:"还原学校数据？",message:"你在本机对这所学校的编辑会被清除，恢复到 Excel 原始数据。",confirmText:"还原",danger:!0})&&(He(e.id),$("已还原"),window.dispatchEvent(new CustomEvent("admin-changed",{detail:A()})),k(`/school/${e.id}`))}),(d=document.getElementById("open-vs"))==null||d.addEventListener("click",()=>ft(e))}function I(e){const t=document.getElementById("comment-list");if(!t)return;const a=A(),n=j(e.id);if(n.length===0){t.innerHTML=`<div class="empty-state" style="padding: 32px 16px;">
      <div class="empty-state-emoji" aria-hidden="true">📝</div>
      <div class="empty-state-text">还没有评论。住过这所学校？留下第一条。</div>
    </div>`;return}t.innerHTML=n.map(s=>Ee(s,a)).join(""),t.querySelectorAll("[data-comment-id]").forEach(s=>{var d,m;const l=s.dataset.commentId;(d=s.querySelector('[data-act="delete"]'))==null||d.addEventListener("click",async()=>{await ee({title:"删除评论？",message:"这条评论会从本机永久删除。",confirmText:"删除",danger:!0})&&(be(e.id,l),$("已删除"),I(e))}),(m=s.querySelector('[data-act="edit"]'))==null||m.addEventListener("click",()=>Le(e,l))});const i=document.querySelector(".detail-section-title .count");i&&(i.textContent=n.length)}function Le(e,t){const a=j(e.id).find(s=>s.id===t);if(!a)return;const n=document.createElement("div");document.body.appendChild(n),n.innerHTML=`
    <dialog id="comment-edit-dialog" aria-label="编辑评论">
      <form class="drawer" style="max-width: 480px;" id="comment-edit-form">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h2 style="font-size: 1.0625rem;">编辑评论</h2>
          <button type="button" class="btn-ghost" data-close>${u("x",20)}</button>
        </div>
        <div class="field" style="margin-bottom: 12px;">
          <label class="field-label" for="edit-author">昵称</label>
          <input type="text" class="input" id="edit-author" maxlength="24" value="${c(a.author)}" />
        </div>
        <div class="field" style="margin-bottom: 16px;">
          <label class="field-label" for="edit-body">评论</label>
          <textarea class="textarea" id="edit-body" maxlength="600" required>${c(a.body)}</textarea>
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button type="button" class="btn btn-secondary" data-close>取消</button>
          <button type="submit" class="btn btn-primary">保存</button>
        </div>
      </form>
    </dialog>
  `;const i=n.querySelector("dialog");i.showModal(),i.addEventListener("click",s=>{s.target===i&&i.close()}),n.querySelectorAll("[data-close]").forEach(s=>s.addEventListener("click",()=>i.close())),i.addEventListener("close",()=>n.remove()),n.querySelector("#comment-edit-form").addEventListener("submit",s=>{s.preventDefault();const l=n.querySelector("#edit-author").value,d=n.querySelector("#edit-body").value.trim();if(!d){$("写两句再保存");return}De(e.id,t,{author:l,body:d}),$("已保存"),i.close(),I(e)})}function mt(e){const t=he(e.id)||{},a={...e.facilities,...t.facilities},n={...e.around,...t.around},i={...e,...t},s=[{group:"基础信息",items:[{k:"name",label:"学校名称",val:i.name||""},{k:"province",label:"省份",val:i.province||""},{k:"city",label:"城市",val:i.city||""},{k:"cityType",label:"城市等级",val:i.cityType||""},{k:"level",label:"层次",val:i.level||""},{k:"nature",label:"性质",val:i.nature||""},{k:"address",label:"地址",val:i.address||""},{k:"multiCampus",label:"多校区",val:i.multiCampus||""}]},{group:"宿舍与设施",items:[{k:"facilities.bedDesk",label:"上床下桌",val:a.bedDesk||"",type:"enum",opts:["","yes","no","partial"]},{k:"facilities.roomSize",label:"几人间",val:a.roomSize||""},{k:"facilities.dormAC",label:"宿舍空调",val:a.dormAC||"",type:"enum",opts:["","yes","no","partial"]},{k:"facilities.classAC",label:"教室空调",val:a.classAC||"",type:"enum",opts:["","yes","no","partial"]},{k:"facilities.privateBath",label:"独立卫浴",val:a.privateBath||"",type:"enum",opts:["","yes","no","partial"]},{k:"facilities.hotWater",label:"洗澡热水时段",val:a.hotWater||""},{k:"facilities.laundry",label:"洗衣机",val:a.laundry||""},{k:"facilities.nightStudy",label:"通宵自习室",val:a.nightStudy||""},{k:"facilities.powerLimit",label:"宿舍限电",val:a.powerLimit||""},{k:"facilities.nightPowerOff",label:"夜间断电",val:a.nightPowerOff||""},{k:"facilities.nightNetOff",label:"夜间断网",val:a.nightNetOff||""},{k:"facilities.netSpeed",label:"校园网速度",val:a.netSpeed||""},{k:"facilities.netPrice",label:"校园网价格",val:a.netPrice||""},{k:"facilities.bringPC",label:"大一带电脑",val:a.bringPC||"",type:"enum",opts:["","yes","no","partial"]},{k:"facilities.checkDorm",label:"查寝情况",val:a.checkDorm||""},{k:"facilities.curfew",label:"晚归门禁",val:a.curfew||""},{k:"facilities.selfStudy",label:"早晚自习",val:a.selfStudy||""},{k:"facilities.morningRun",label:"晨跑要求",val:a.morningRun||""},{k:"facilities.runCheck",label:"跑步打卡",val:a.runCheck||""}]},{group:"周边生活",items:[{k:"around.subway",label:"地铁",val:n.subway||"",type:"enum",opts:["","yes","no","partial"]},{k:"around.cityDistance",label:"市区距离",val:n.cityDistance||""},{k:"around.traffic",label:"交通便利",val:n.traffic||""},{k:"around.takeout",label:"点外卖",val:n.takeout||"",type:"enum",opts:["","yes","no","partial"]},{k:"around.canteenPrice",label:"食堂价格",val:n.canteenPrice||""},{k:"around.storePrice",label:"超市价格",val:n.storePrice||""},{k:"around.delivery",label:"收发快递",val:n.delivery||""},{k:"around.sharedBike",label:"共享单车",val:n.sharedBike||""}]}],l=p=>p==="yes"?"有":p==="no"?"无":p==="partial"?"部分有":"（空）",d=p=>{const b="edit-"+p.k.replace(/\./g,"-");if(p.type==="enum"){const h=p.opts.map(y=>`<option value="${y}" ${p.val===y?"selected":""}>${l(y)}</option>`).join("");return`
        <div class="field" style="margin-bottom: 12px;">
          <label class="field-label" for="${b}">${c(p.label)}</label>
          <select class="select" id="${b}" data-k="${p.k}">${h}</select>
        </div>
      `}return`
      <div class="field" style="margin-bottom: 12px;">
        <label class="field-label" for="${b}">${c(p.label)}</label>
        <input type="text" class="input" id="${b}" data-k="${p.k}" value="${c(p.val)}" />
      </div>
    `},m=document.createElement("div");document.body.appendChild(m),m.innerHTML=`
    <dialog id="school-edit-dialog" aria-label="编辑学校信息">
      <form class="drawer" style="max-width: 640px;" id="school-edit-form">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h2 style="font-size: 1.0625rem;">编辑 · ${c(e.name)}</h2>
          <button type="button" class="btn-ghost" data-close>${u("x",20)}</button>
        </div>
        <div style="max-height: 60vh; overflow-y: auto; padding-right: 4px;">
          ${s.map(p=>`
            <div style="margin-bottom: 20px;">
              <div class="filter-group-title">${c(p.group)}</div>
              ${p.items.map(d).join("")}
            </div>
          `).join("")}
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end; position: sticky; bottom: 0; background: var(--surface); padding-top: 12px;">
          <button type="button" class="btn btn-secondary" data-close>取消</button>
          <button type="submit" class="btn btn-primary">${u("save",16)}<span>保存</span></button>
        </div>
      </form>
    </dialog>
  `;const r=m.querySelector("dialog");r.showModal(),r.addEventListener("click",p=>{p.target===r&&r.close()}),m.querySelectorAll("[data-close]").forEach(p=>p.addEventListener("click",()=>r.close())),r.addEventListener("close",()=>m.remove()),m.querySelector("#school-edit-form").addEventListener("submit",p=>{p.preventDefault();const b={facilities:{},around:{}};m.querySelectorAll("[data-k]").forEach(h=>{const y=h.dataset.k,Z=h.value;((Ce,Te,Ae)=>{const L=Te.split(".");let q=Ce;for(let O=0;O<L.length-1;O++)q[L[O]]=q[L[O]]||{},q=q[L[O]];q[L[L.length-1]]=Ae})(b,y,Z)}),["name","province","city","cityType","level","nature","address","multiCampus"].forEach(h=>{const y=m.querySelector(`[data-k="${h}"]`);y&&(b[h]=y.value)}),Oe(e.id,b),$("已保存到本机"),r.close(),window.dispatchEvent(new CustomEvent("admin-changed",{detail:A()})),k(`/school/${e.id}`)})}function ft(e){const t=se().filter(l=>l.id!==e.id),a=document.createElement("div");document.body.appendChild(a),a.innerHTML=`
    <dialog id="vs-picker-dialog" aria-label="选择对比学校">
      <div class="drawer" style="max-width: 560px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <div>
            <h2 style="font-size: 1.0625rem; display: flex; align-items: center; gap: 8px;">
              ${u("vs",18)}<span>选择对比学校</span>
            </h2>
            <p style="color: var(--muted); font-size: 0.8125rem; margin-top: 4px;">
              当前：<strong style="color: var(--ink-strong);">${c(e.name)}</strong>，再选一所进行属性对比。
            </p>
          </div>
          <button type="button" class="btn-ghost" data-close aria-label="关闭">${u("x",20)}</button>
        </div>
        <div class="field" style="margin-bottom: 12px;">
          <div class="search">
            <span class="search-icon">${u("search",18)}</span>
            <input type="search" class="input" id="vs-search" placeholder="搜索学校名 / 城市" autocomplete="off" style="height: 40px;" />
          </div>
        </div>
        <div id="vs-list" style="max-height: 50vh; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding-right: 4px;">
          ${z(t,"")}
        </div>
      </div>
    </dialog>
  `;const n=a.querySelector("dialog");n.showModal(),n.addEventListener("click",l=>{l.target===n&&n.close()}),a.querySelectorAll("[data-close]").forEach(l=>l.addEventListener("click",()=>n.close())),n.addEventListener("close",()=>a.remove());const i=a.querySelector("#vs-search"),s=a.querySelector("#vs-list");i==null||i.addEventListener("input",l=>{const d=l.target.value.trim().toLowerCase();s.innerHTML=z(t,d),pe(a,e,n)}),pe(a,e,n)}function z(e,t){const a=t?e.filter(n=>`${n.name} ${n.province} ${n.city}`.toLowerCase().includes(t)):e;return a.length===0?'<div class="text-muted text-small" style="padding: 16px; text-align: center;">没有匹配的学校</div>':a.slice(0,200).map(n=>{const i=n.facilities||{},s=[];return i.dormAC==="yes"&&s.push('<span class="tag tag-yes">空调</span>'),i.privateBath==="yes"&&s.push('<span class="tag tag-yes">独卫</span>'),i.bedDesk==="yes"&&s.push('<span class="tag tag-yes">上床下桌</span>'),i.roomSize&&s.push(`<span class="tag tag-info">${c(String(i.roomSize))}人间</span>`),`
      <button type="button" class="vs-pick-item" data-vs-id="${n.id}">
        <div class="vs-pick-main">
          <div class="vs-pick-name">${c(n.name)}</div>
          <div class="vs-pick-meta">${c(n.province)} · ${c(n.city)}${n.cityType?` · ${c(n.cityType)}`:""}</div>
        </div>
        <div class="vs-pick-tags">${s.join("")}</div>
        ${u("chevronRight",16)}
      </button>
    `}).join("")}function pe(e,t,a){e.querySelectorAll("[data-vs-id]").forEach(n=>{n.addEventListener("click",()=>{const i=Number(n.dataset.vsId);a.close(),k(`/compare/${t.id}/${i}`)})})}function ue(e,t){return e==null||e===""?'<span class="cmp-cell cmp-cell-empty">—</span>':t==="roomSize"?`<span class="cmp-cell"><span class="tag tag-info">${c(String(e))}人间</span></span>`:t?`<span class="cmp-cell">${g(e,t)}</span>`:`<span class="cmp-cell cmp-cell-text">${c(String(e))}</span>`}function vt(e,t){const a=e.facilities||{},n=t.facilities||{},i=e.around||{},s=t.around||{},l=[{group:"基础信息",items:[{label:"省份",av:e.province,bv:t.province},{label:"城市",av:e.city,bv:t.city},{label:"城市等级",av:e.cityType,bv:t.cityType},{label:"办学层次",av:e.level,bv:t.level},{label:"办学性质",av:e.nature,bv:t.nature},{label:"地址",av:e.address,bv:t.address},{label:"多校区",av:e.multiCampus,bv:t.multiCampus}]},{group:"宿舍与设施",items:[{label:"上床下桌",av:a.bedDesk,bv:n.bedDesk,kind:"tag"},{label:"几人间",av:a.roomSize,bv:n.roomSize,kind:"roomSize"},{label:"宿舍空调",av:a.dormAC,bv:n.dormAC,kind:"tag"},{label:"教室空调",av:a.classAC,bv:n.classAC,kind:"tag"},{label:"独立卫浴",av:a.privateBath,bv:n.privateBath,kind:"tag"},{label:"洗澡热水时段",av:a.hotWater,bv:n.hotWater},{label:"洗衣机",av:a.laundry,bv:n.laundry},{label:"通宵自习室",av:a.nightStudy,bv:n.nightStudy},{label:"宿舍限电",av:a.powerLimit,bv:n.powerLimit},{label:"夜间断电",av:a.nightPowerOff,bv:n.nightPowerOff,kind:"powerOff"},{label:"夜间断网",av:a.nightNetOff,bv:n.nightNetOff,kind:"netOff"},{label:"校园网速度",av:a.netSpeed,bv:n.netSpeed,kind:"netSpeed"},{label:"校园网价格",av:a.netPrice,bv:n.netPrice,kind:"netPrice"},{label:"大一带电脑",av:a.bringPC,bv:n.bringPC,kind:"tag"},{label:"查寝情况",av:a.checkDorm,bv:n.checkDorm,kind:"checkDorm"},{label:"晚归门禁",av:a.curfew,bv:n.curfew,kind:"curfew"},{label:"早晚自习",av:a.selfStudy,bv:n.selfStudy},{label:"晨跑要求",av:a.morningRun,bv:n.morningRun},{label:"跑步打卡",av:a.runCheck,bv:n.runCheck}]},{group:"周边生活",items:[{label:"地铁",av:i.subway,bv:s.subway,kind:"tag"},{label:"市区距离",av:i.cityDistance,bv:s.cityDistance,kind:"distance"},{label:"交通便利",av:i.traffic,bv:s.traffic,kind:"traffic"},{label:"点外卖",av:i.takeout,bv:s.takeout,kind:"tag"},{label:"食堂价格",av:i.canteenPrice,bv:s.canteenPrice,kind:"price"},{label:"超市价格",av:i.storePrice,bv:s.storePrice,kind:"price"},{label:"收发快递",av:i.delivery,bv:s.delivery},{label:"共享单车",av:i.sharedBike,bv:s.sharedBike}]}];l[1].items.find(r=>r.label==="查寝情况").bv=n.checkDorm;const d=(r,p)=>`
    <div class="cmp-school-head">
      <div class="cmp-school-name">${c(r.name)}</div>
      <div class="cmp-school-meta">
        ${r.province?`${c(r.province)}`:""}${r.city?` · ${c(r.city)}`:""}${r.cityType?` · ${c(r.cityType)}`:""}
      </div>
      <button type="button" class="chip cmp-swap" data-swap="${p}" style="height: 28px; padding: 0 10px; font-size: 0.75rem;">
        ${u("swap",14)}<span>换一所</span>
      </button>
    </div>
  `,m=l.map(r=>`
    <div class="cmp-group">
      <div class="cmp-group-title">${c(r.group)}</div>
      ${r.items.map(p=>`
          <div class="cmp-row">
            <div class="cmp-label">${c(p.label)}</div>
            <div class="cmp-cell-a">${ue(p.av,p.kind)}</div>
            <div class="cmp-cell-b">${ue(p.bv,p.kind)}</div>
          </div>
        `).join("")}
    </div>
  `).join("");return`
    <main class="app-main">
      <div class="detail-back-row">
        <a href="#/" class="detail-back" data-back>${u("back",16)}<span>返回列表</span></a>
        <a href="#/school/${e.id}" class="chip" style="height: 32px; padding: 0 12px; font-size: 0.8125rem;">${u("chevronRight",14)}<span>看 ${c(e.name)} 详情</span></a>
      </div>

      <section class="cmp-hero">
        <div class="cmp-hero-icon">${u("vs",28)}</div>
        <h1 class="cmp-hero-title">学校对比</h1>
        <p class="cmp-hero-sub">逐项查看两所学校的宿舍与设施差异，挑出更适合你的那所。</p>
      </section>

      <section class="cmp-table">
        <div class="cmp-head-row">
          <div class="cmp-label-col"></div>
          <div class="cmp-school-col cmp-school-a">${d(e,"a")}</div>
          <div class="cmp-school-col cmp-school-b">${d(t,"b")}</div>
        </div>
        ${m}
      </section>

      <div class="cmp-actions">
        <button type="button" class="btn btn-secondary" id="cmp-swap-a">${u("swap",16)}<span>换 A 校</span></button>
        <button type="button" class="btn btn-secondary" id="cmp-swap-b">${u("swap",16)}<span>换 B 校</span></button>
      </div>
    </main>
  `}function ht(e,t){var a,n,i;(a=document.querySelector("[data-back]"))==null||a.addEventListener("click",s=>{s.preventDefault(),k("/")}),(n=document.getElementById("cmp-swap-a"))==null||n.addEventListener("click",()=>Y(e,t,"a")),(i=document.getElementById("cmp-swap-b"))==null||i.addEventListener("click",()=>Y(e,t,"b")),document.querySelectorAll(".cmp-swap").forEach(s=>{s.addEventListener("click",()=>{const l=s.dataset.swap;Y(e,t,l)})})}function Y(e,t,a){const n=a==="a"?t.id:e.id,i=se().filter(r=>r.id!==n),s=document.createElement("div");document.body.appendChild(s),s.innerHTML=`
    <dialog id="cmp-picker-dialog" aria-label="选择学校">
      <div class="drawer" style="max-width: 560px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <h2 style="font-size: 1.0625rem; display: flex; align-items: center; gap: 8px;">
            ${u("swap",18)}<span>更换 ${a==="a"?"A":"B"} 校</span>
          </h2>
          <button type="button" class="btn-ghost" data-close aria-label="关闭">${u("x",20)}</button>
        </div>
        <div class="field" style="margin-bottom: 12px;">
          <div class="search">
            <span class="search-icon">${u("search",18)}</span>
            <input type="search" class="input" id="cmp-search" placeholder="搜索学校名 / 城市" autocomplete="off" style="height: 40px;" />
          </div>
        </div>
        <div id="cmp-list" style="max-height: 50vh; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding-right: 4px;">
          ${z(i,"")}
        </div>
      </div>
    </dialog>
  `;const l=s.querySelector("dialog");l.showModal(),l.addEventListener("click",r=>{r.target===l&&l.close()}),s.querySelectorAll("[data-close]").forEach(r=>r.addEventListener("click",()=>l.close())),l.addEventListener("close",()=>s.remove());const d=s.querySelector("#cmp-search"),m=s.querySelector("#cmp-list");d==null||d.addEventListener("input",r=>{const p=r.target.value.trim().toLowerCase();m.innerHTML=z(i,p),me(s,e,t,a,l)}),me(s,e,t,a,l)}function me(e,t,a,n,i){e.querySelectorAll("[data-vs-id]").forEach(s=>{s.addEventListener("click",()=>{const l=Number(s.dataset.vsId);i.close(),k(n==="a"?`/compare/${l}/${a.id}`:`/compare/${t.id}/${l}`)})})}ne();function bt(){const e=document.getElementById("app");e.innerHTML=Xe()+'<div id="view-host"></div>',et()}function _(){const e=document.getElementById("view-host");e.innerHTML=`
    <main class="app-main">
      <div class="school-list mt-6">
        ${Array.from({length:6}).map(()=>`
          <div class="card" style="padding: 14px 16px;">
            <div class="skeleton" style="height: 18px; width: 60%; margin-bottom: 8px;"></div>
            <div class="skeleton" style="height: 12px; width: 40%; margin-bottom: 12px;"></div>
            <div style="display: flex; gap: 6px;">
              <div class="skeleton" style="height: 20px; width: 60px;"></div>
              <div class="skeleton" style="height: 20px; width: 60px;"></div>
              <div class="skeleton" style="height: 20px; width: 60px;"></div>
            </div>
          </div>
        `).join("")}
      </div>
    </main>
  `}function K(e){const t=document.getElementById("view-host");t.innerHTML=`
    <main class="app-main">
      <div class="empty-state" style="padding: 80px 16px;">
        <div class="empty-state-icon"></div>
        <div class="empty-state-title">数据加载失败</div>
        <div class="empty-state-text">${e}</div>
        <button type="button" class="btn btn-primary" onclick="location.reload()">重新加载</button>
      </div>
    </main>
  `}async function U(e){const t=document.getElementById("view-host");if(e.name==="list"){_();try{const a=await R();await st(a.schools,a.facets)}catch(a){K(a.message||"未知错误")}return}if(e.name==="detail"){_();try{await R();const a=F(e.params.id);if(!a){t.innerHTML=`
          <main class="app-main">
            <div class="empty-state" style="padding: 80px 16px;">
              <div class="empty-state-title">找不到这所学校</div>
              <div class="empty-state-text">它可能不在数据集里，或者链接有问题。</div>
              <button type="button" class="btn btn-primary" onclick="location.hash = '#/'">返回列表</button>
            </div>
          </main>
        `;return}Ie(a.id),t.innerHTML=dt(a),ut(a),window.scrollTo({top:0,behavior:"instant"})}catch(a){K(a.message||"未知错误")}return}if(e.name==="about"&&(t.innerHTML='<main class="app-main"><p>关于页暂未实现。</p></main>'),e.name==="compare"){_();try{await R();const a=F(e.params.a),n=F(e.params.b);if(!a||!n){t.innerHTML=`
          <main class="app-main">
            <div class="empty-state" style="padding: 80px 16px;">
              <div class="empty-state-title">找不到要对比的学校</div>
              <div class="empty-state-text">至少有一所学校不在数据集里。</div>
              <button type="button" class="btn btn-primary" onclick="location.hash = '#/'">返回列表</button>
            </div>
          </main>
        `;return}t.innerHTML=vt(a,n),ht(a,n),window.scrollTo({top:0,behavior:"instant"})}catch(a){K(a.message||"未知错误")}return}}function gt(){bt(),Re(e=>{U(e)}),U(oe()),window.addEventListener("admin-changed",()=>{U(oe())})}gt();
