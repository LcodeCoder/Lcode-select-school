(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&n(d)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();const p=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${e}</svg>`,Q={search:p('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),filter:p('<path d="M4 5h16M7 12h10M10 19h4"/>'),back:p('<path d="m15 18-6-6 6-6"/>'),home:p('<path d="M3 12 12 4l9 8v8h-6v-5h-6v5H3z"/>'),chevronRight:p('<path d="m9 18 6-6-6-6"/>'),chevronDown:p('<path d="m6 9 6 6 6-6"/>'),x:p('<path d="M18 6 6 18M6 6l12 12"/>'),plus:p('<path d="M12 5v14M5 12h14"/>'),edit:p('<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),trash:p('<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),save:p('<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/>'),message:p('<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/>'),pin:p('<path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>'),bed:p('<path d="M2 9V5M2 19v-6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6M2 17h20M6 11V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>'),ac:p('<rect x="3" y="6" width="18" height="9" rx="1.5"/><path d="M6 9v3M10 9v3M14 9v3M18 9v3M7 18l-1 2M12 18v2M17 18l1 2"/>'),bath:p('<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5H4a1 1 0 0 0 0 2h1l3 3M4 11h16M5 11v3a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-3M7 18l-1 3M17 18l1 3"/>'),laundry:p('<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6h.01M12 6h.01"/>'),power:p('<path d="M12 2v10M18.4 6.6a9 9 0 1 1-12.8 0"/>'),wifi:p('<path d="M5 12.55a11 11 0 0 1 14 0M8.5 16.1a6 6 0 0 1 7 0M12 19.5h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/>'),metro:p('<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16M8 19l-2 3M16 19l2 3"/><circle cx="9" cy="15" r="1"/><circle cx="15" cy="15" r="1"/>'),cart:p('<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 2h3l3 13h12l2-8H6"/>'),bike:p('<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17 9 9h5l3 8M9 9l-2 5M14 9l-3 5"/>'),book:p('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14ZM4 19.5V21h16"/>'),clock:p('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),building:p('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 21V12h6v9M9 7h.01M15 7h.01M9 11h.01M15 11h.01"/>'),check:p('<path d="M20 6 9 17l-5-5"/>'),alert:p('<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z"/>'),info:p('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v4h1"/>'),user:p('<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a7 7 0 0 1 14 0v1"/>'),settings:p('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>'),shield:p('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>'),package:p('<path d="m7.5 4.27 9 5.15M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>')};function m(e,t=20){return(Q[e]||Q.info).replace("<svg ",`<svg width="${t}" height="${t}" `)}const K="dorm:school-overrides",w="dorm:comments",Y="dorm:admin";function B(e,t){try{const a=localStorage.getItem(e);return a?JSON.parse(a):t}catch{return t}}function q(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch(a){console.warn("localStorage write failed",a)}}function j(){return B(K,{})}function ie(e){return j()[e]||null}function ye(e,t){const a=j(),n=a[e]||{};return a[e]={...n,...t,id:e,updatedAt:Date.now()},q(K,a),a[e]}function be(e){const t=j();delete t[e],q(K,t)}function $e(e){return!!j()[e]}function N(e){return(B(w,{})[e]||[]).slice().sort((a,n)=>n.createdAt-a.createdAt)}function xe(e,{author:t,body:a}){const n=B(w,{}),i=n[e]||[],s={id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,schoolId:e,author:(t||"匿名").trim().slice(0,24)||"匿名",body:a.trim().slice(0,600),createdAt:Date.now()};return i.push(s),n[e]=i,q(w,n),s}function we(e,t,{author:a,body:n}){const i=B(w,{}),s=i[e]||[],d=s.findIndex(c=>c.id===t);return d===-1?null:(s[d]={...s[d],author:(a||"匿名").trim().slice(0,24)||"匿名",body:n.trim().slice(0,600),updatedAt:Date.now()},i[e]=s,q(w,i),s[d])}function se(e,t){const a=B(w,{}),n=(a[e]||[]).filter(i=>i.id!==t);a[e]=n,q(w,a)}function W(e){return N(e).length}function E(){return sessionStorage.getItem(Y)==="1"}function ke(e){e?sessionStorage.setItem(Y,"1"):sessionStorage.removeItem(Y)}function le(){const e=location.hash.replace(/^#/,"");if(!e||e==="/"||e==="")return{name:"list",params:{}};const t=e.split("/").filter(Boolean);return t[0]==="school"&&t[1]?{name:"detail",params:{id:decodeURIComponent(t[1])}}:t[0]==="about"?{name:"about",params:{}}:{name:"list",params:{}}}const D=new Set;let I=le();window.addEventListener("hashchange",()=>{I=le();for(const e of D)e(I)});function X(){return I}function Se(e){return D.add(e),()=>D.delete(e)}function A(e){if(e.startsWith("#")||(e="#"+e),location.hash===e)for(const t of D)t(I);else location.hash=e}function Me(){const e=E();return`
    <header class="app-header">
      <div class="app-header-inner">
        <a class="brand" href="#/" data-nav="home" aria-label="寝室搜 首页">
          <span class="brand-icon">${m("home",26)}</span>
          <span>寝室搜</span>
          <span class="brand-tag">宿舍数据</span>
        </a>
        <div style="flex: 1"></div>
        <button type="button" class="btn-ghost" id="admin-toggle" aria-pressed="${e}" aria-label="${e?"退出管理员模式":"进入管理员模式"}" title="${e?"退出管理员模式":"进入管理员模式"}">
          ${m(e?"shield":"settings",20)}
        </button>
      </div>
    </header>
  `}function Ee(){const e=document.getElementById("admin-toggle");e==null||e.addEventListener("click",()=>{const a=!E();ke(a),e.setAttribute("aria-pressed",String(a)),e.setAttribute("aria-label",a?"退出管理员模式":"进入管理员模式"),e.innerHTML=m(a?"shield":"settings",20);const n=new CustomEvent("admin-changed",{detail:a});window.dispatchEvent(n)});const t=document.querySelector('[data-nav="home"]');t==null||t.addEventListener("click",a=>{a.preventDefault(),A("/")})}let T=null,O=null;async function ee(){return T||O||(O=fetch("data/schools.json").then(e=>{if(!e.ok)throw new Error(`HTTP ${e.status}`);return e.json()}).then(e=>(T=e,e)).catch(e=>{throw O=null,e}),O)}function Le(e){if(!T)return null;const t=Number(e),a=T.schools.find(i=>i.id===t);if(!a)return null;const n=ie(t);return Ce(a,n)}function Ce(e,t){if(!t)return e;const a={...e,...t};return t.facilities&&(a.facilities={...e.facilities,...t.facilities}),t.around&&(a.around={...e.around,...t.around}),a}function re(e){return e==="yes"?{cls:"tag-yes",label:"有"}:e==="no"?{cls:"tag-no",label:"无"}:e==="partial"?{cls:"tag-partial",label:"部分有"}:e==null?{cls:"tag-neutral",label:"—"}:{cls:"tag-neutral",label:String(e)}}function Oe(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("较贵")||t.includes("贵")?{cls:"tag-no",label:t}:t.includes("便宜")?{cls:"tag-yes",label:t}:t.includes("一般")||t.includes("适中")?{cls:"tag-partial",label:t}:{cls:"tag-neutral",label:t}}function Te(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("非常方便")?{cls:"tag-yes",label:t}:t.includes("比较方便")||t.includes("方便")?{cls:"tag-yes",label:t}:t.includes("一般")?{cls:"tag-partial",label:t}:t.includes("不方便")||t.includes("较差")?{cls:"tag-no",label:t}:{cls:"tag-neutral",label:t}}function Ae(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("在市区")?{cls:"tag-yes",label:t}:t.includes("不在市区")?{cls:"tag-partial",label:t}:{cls:"tag-neutral",label:t}}function Be(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("不查")?{cls:"tag-yes",label:t}:t.includes("很少")?{cls:"tag-yes",label:t}:t.includes("有时")?{cls:"tag-partial",label:t}:t.includes("严")||t.includes("经常")?{cls:"tag-no",label:t}:{cls:"tag-neutral",label:t}}function P(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("不断电")?{cls:"tag-yes",label:"不断电"}:t.includes("断电")?{cls:"tag-partial",label:t}:{cls:"tag-neutral",label:t}}function qe(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("不断网")?{cls:"tag-yes",label:"不断网"}:t.includes("断网")?{cls:"tag-no",label:t}:{cls:"tag-neutral",label:t}}function He(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("好")||t.includes("快")?{cls:"tag-yes",label:t}:t.includes("一般")?{cls:"tag-partial",label:t}:t.includes("差")||t.includes("慢")||t.includes("无")?{cls:"tag-no",label:t}:{cls:"tag-neutral",label:t}}function Pe(e){if(!e)return{cls:"tag-neutral",label:"—"};const t=String(e);return t.includes("免费")?{cls:"tag-yes",label:t}:t.includes("低")?{cls:"tag-yes",label:t}:t.includes("贵")||t.includes("高")?{cls:"tag-no",label:t}:t.includes("一般")?{cls:"tag-partial",label:t}:{cls:"tag-neutral",label:t}}function De(e){return e?{cls:"tag-info",label:String(e)}:{cls:"tag-neutral",label:"无门禁"}}function Ie(e){const t=new Date(e),a=new Date,n=a-t,i=Math.floor(n/6e4);if(i<1)return"刚刚";if(i<60)return`${i} 分钟前`;const s=Math.floor(i/60);if(s<24)return`${s} 小时前`;const d=Math.floor(s/24);if(d<7)return`${d} 天前`;const c=t.getFullYear()===a.getFullYear(),f=`${t.getMonth()+1}月${t.getDate()}日`;return c?f:`${t.getFullYear()}年${f}`}function r(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function H(e,t){let a;return a=re(e),`<span class="tag ${a.cls}">${r(a.label)}</span>`}function ze(e,t=0){const a=e.facilities||{},n=e.around||{},i=[];a.dormAC&&i.push(H(a.dormAC)),a.bedDesk&&i.push(H(a.bedDesk)),a.roomSize&&i.push(`<span class="tag tag-info">${r(String(a.roomSize))}人间</span>`),a.privateBath&&i.push(H(a.privateBath)),n.subway&&i.push(H(n.subway)),a.nightPowerOff&&i.push(P(a.nightPowerOff).cls?`<span class="tag ${P(a.nightPowerOff).cls}">${r(P(a.nightPowerOff).label)}</span>`:"");const s=[];return e.province&&s.push(e.province),e.city&&s.push(e.city),e.cityType&&s.push(`<span class="tag tag-neutral">${r(e.cityType)}</span>`),e.nature&&s.push(`<span class="tag tag-neutral">${r(e.nature)}</span>`),`
    <button type="button" class="school-card" data-school-id="${e.id}">
      <div class="school-card-head">
        <div>
          <div class="school-card-name">${r(e.name)}</div>
          <div class="school-card-meta">${s.join('<span class="dot"></span>')}</div>
        </div>
        ${e.edited?'<span class="tag tag-info">已编辑</span>':""}
      </div>
      ${i.length?`<div class="school-card-tags">${i.join("")}</div>`:""}
      <div class="school-card-foot">
        <span class="comment-count">${m("message",14)}<span>${t}</span></span>
        <span class="arrow">详情 ${m("chevronRight",14)}</span>
      </div>
    </button>
  `}function je({title:e,text:t,actionLabel:a,actionId:n}){return`
    <div class="empty-state">
      <div class="empty-state-icon">${m("info",48)}</div>
      <div class="empty-state-title">${r(e)}</div>
      <div class="empty-state-text">${r(t)}</div>
      ${`<button type="button" class="btn btn-primary" id="${n}">${r(a)}</button>`}
    </div>
  `}function ce(e){const t=[];e.province&&t.push({key:"province",label:e.province}),e.city&&t.push({key:"city",label:e.city}),e.cityType&&t.push({key:"cityType",label:e.cityType}),e.level&&t.push({key:"level",label:e.level}),e.nature&&t.push({key:"nature",label:e.nature}),e.bedDesk&&t.push({key:"bedDesk",label:"上床下桌"}),e.dormAC&&t.push({key:"dormAC",label:"宿舍空调"}),e.privateBath&&t.push({key:"privateBath",label:"独立卫浴"}),e.subway&&t.push({key:"subway",label:"地铁"}),e.roomSize&&t.push({key:"roomSize",label:`${e.roomSize}人间`}),e.nightPowerOff==="no"&&t.push({key:"nightPowerOff",label:"不断电"}),e.nightNetOff==="no"&&t.push({key:"nightNetOff",label:"不断网"});const a=t.map(i=>`
    <button type="button" class="chip" data-filter-clear="${i.key}" aria-pressed="true">
      ${r(i.label)}
      <span class="chip-x" aria-hidden="true">${m("x",12)}</span>
    </button>
  `).join("");return`
    <div class="filter-bar">
      ${`
    <button type="button" class="chip" id="open-filter" aria-haspopup="dialog">
      ${m("filter",16)}
      <span>筛选</span>
      ${t.length?`<span style="font-variant-numeric: tabular-nums;">${t.length}</span>`:""}
    </button>
  `}
      ${a}
      ${t.length?'<button type="button" class="chip" id="clear-all-filters" style="color: var(--accent); border-color: color-mix(in oklch, var(--accent) 30%, transparent);">清除全部</button>':""}
    </div>
  `}function te(e,t){const a=(t.provinces||[]).map(o=>`
    <button type="button" class="chip" data-filter="province" data-value="${r(o)}" aria-pressed="${e.province===o}">${r(o)}</button>
  `).join(""),n=(t.cityTypes||[]).map(o=>`
    <button type="button" class="chip" data-filter="cityType" data-value="${r(o)}" aria-pressed="${e.cityType===o}">${r(o)}</button>
  `).join(""),i=(t.levels||[]).map(o=>`
    <button type="button" class="chip" data-filter="level" data-value="${r(o)}" aria-pressed="${e.level===o}">${r(o)}</button>
  `).join(""),s=(t.natures||[]).map(o=>`
    <button type="button" class="chip" data-filter="nature" data-value="${r(o)}" aria-pressed="${e.nature===o}">${r(o)}</button>
  `).join(""),d=(t.roomSizes||[]).map(o=>`
    <button type="button" class="chip" data-filter="roomSize" data-value="${r(o)}" aria-pressed="${e.roomSize===o}">${r(o)}人间</button>
  `).join(""),c=(o,u,g)=>[{v:"yes",label:"有"},{v:"no",label:"无"},{v:"partial",label:"部分有"}].map(b=>`
      <button type="button" class="chip" data-filter="${o}" data-value="${b.v}" aria-pressed="${u===b.v}">${b.label}</button>
    `).join(""),f=(o,u,g)=>`
      <button type="button" class="chip" data-filter="${o}" data-value="no" aria-pressed="${u==="no"}">不断${g}</button>
      <button type="button" class="chip" data-filter="${o}" data-value="yes" aria-pressed="${u==="yes"}">会断${g}</button>
    `;return`
    <dialog id="filter-dialog" aria-label="筛选条件">
      <div class="drawer">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h2 style="font-size: 1.0625rem;">筛选</h2>
          <button type="button" class="btn-ghost" data-close-filter aria-label="关闭">${m("x",20)}</button>
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
          <div class="filter-chips">${d||'<span class="text-muted text-small">无数据</span>'}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">上床下桌</div>
          <div class="filter-chips">${c("bedDesk",e.bedDesk)}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">宿舍空调</div>
          <div class="filter-chips">${c("dormAC",e.dormAC)}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">独立卫浴</div>
          <div class="filter-chips">${c("privateBath",e.privateBath)}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">地铁</div>
          <div class="filter-chips">${c("subway",e.subway)}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">夜间断电</div>
          <div class="filter-chips">${f("nightPowerOff",e.nightPowerOff,"电")}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">夜间断网</div>
          <div class="filter-chips">${f("nightNetOff",e.nightNetOff,"网")}</div>
        </div>

        <div class="filter-actions">
          <button type="button" class="btn btn-secondary" style="flex: 1;" data-clear-all>清除全部</button>
          <button type="button" class="btn btn-primary" style="flex: 2;" data-close-filter>查看结果</button>
        </div>
      </div>
    </dialog>
  `}const Z=20,_=()=>({q:"",province:"",city:"",cityType:"",level:"",nature:"",bedDesk:"",dormAC:"",privateBath:"",subway:"",roomSize:"",nightPowerOff:"",nightNetOff:"",sort:"default",page:1});let l=_(),oe=[],x=[];async function Ne(e,t){oe=e,l.facets=t,k(),Ve()}function k(){const e=l.q.trim().toLowerCase();x=oe.filter(t=>{if(e&&!`${t.name} ${t.province} ${t.city} ${t.address||""}`.toLowerCase().includes(e)||l.province&&t.province!==l.province||l.city&&t.city!==l.city||l.cityType&&t.cityType!==l.cityType||l.level&&t.level!==l.level||l.nature&&t.nature!==l.nature)return!1;const a=t.facilities||{};if(l.bedDesk&&a.bedDesk!==l.bedDesk||l.dormAC&&a.dormAC!==l.dormAC||l.privateBath&&a.privateBath!==l.privateBath)return!1;if(l.subway){const n=(t.around||{}).subway;if(l.subway==="yes"&&n!=="yes"||l.subway==="no"&&n!=="no"||l.subway==="partial"&&n!=="partial")return!1}return!(l.roomSize&&!String(a.roomSize||"").split(/[、,，]/).map(i=>i.trim()).includes(l.roomSize)||l.nightPowerOff==="no"&&!(a.nightPowerOff||"").includes("不断电")||l.nightPowerOff==="yes"&&(a.nightPowerOff||"").includes("不断电")||l.nightNetOff==="no"&&!(a.nightNetOff||"").includes("不断网")||l.nightNetOff==="yes"&&(a.nightNetOff||"").includes("不断网"))}),l.sort==="comments"?x.sort((t,a)=>W(a.id)-W(t.id)):l.sort==="name"&&x.sort((t,a)=>t.name.localeCompare(a.name,"zh-Hans"))}function Ve(){const e=document.getElementById("app"),t=`
    <main class="app-main">
      <section class="hero">
        <h1 class="hero-title">查宿舍，挑学校</h1>
        <p class="hero-sub">三千所院校的宿舍与设施一目了然。搜索、筛选、读评论，在 90 秒内排出你的短名单。</p>
      </section>

      <section class="search-section">
        <div class="search">
          <span class="search-icon">${m("search",20)}</span>
          <input type="search" id="search-input" class="input" placeholder="学校名 / 城市 / 地址关键字" enterkeyhint="search" autocomplete="off" />
        </div>
        ${ce(l)}
      </section>

      <div class="result-meta">
        <div class="count">
          <span><strong class="num">${x.length}</strong> 所学校</span>
          <select class="select" id="sort-select" style="height: 32px; font-size: 0.8125rem; padding: 0 28px 0 10px; width: auto; min-width: 110px;" aria-label="排序">
            <option value="default">默认排序</option>
            <option value="comments" ${l.sort==="comments"?"selected":""}>评论最多</option>
            <option value="name" ${l.sort==="name"?"selected":""}>校名 A→Z</option>
          </select>
        </div>
      </div>

      <div id="results"></div>
      <div id="pager"></div>
    </main>
  `;e.innerHTML=t,Fe(),S()}function S(){var d;const e=document.getElementById("results"),t=document.getElementById("pager");if(!e)return;if(x.length===0){e.innerHTML=je({title:"没有匹配的学校",text:"试着清掉一两个筛选项，或者把搜索关键字缩短一些。",actionLabel:"清除全部筛选",actionId:"empty-clear"}),(d=document.getElementById("empty-clear"))==null||d.addEventListener("click",ue),t&&(t.innerHTML="");return}const a=(l.page-1)*Z,n=a+Z,i=x.slice(a,n);e.innerHTML=`<div class="school-list">${i.map(c=>ze(c,W(c.id))).join("")}</div>`,e.querySelectorAll("[data-school-id]").forEach(c=>{c.addEventListener("click",()=>{A(`/school/${c.dataset.schoolId}`)})});const s=Math.ceil(x.length/Z);if(t)if(s<=1)t.innerHTML="";else{const c=l.page,f=[],o=(h,b=h,F=!1,G=!1)=>{f.push(`<button class="pager-btn${G?" active":""}" ${F?"disabled":""} data-page="${h}">${b}</button>`)};o(Math.max(1,c-1),"上一页",c===1);const u=Math.max(1,c-2),g=Math.min(s,c+2);u>1&&(o(1),u>2&&f.push('<span class="text-muted">…</span>'));for(let h=u;h<=g;h++)o(h,h,!1,h===c);g<s&&(g<s-1&&f.push('<span class="text-muted">…</span>'),o(s)),o(Math.min(s,c+1),"下一页",c===s),t.innerHTML=`<div class="pager">${f.join("")}</div>`,t.querySelectorAll("[data-page]").forEach(h=>{h.addEventListener("click",()=>{l.page=Number(h.dataset.page),S(),window.scrollTo({top:0,behavior:"smooth"})})})}}function V(){const e=document.querySelector(".search-section .filter-bar");e&&(e.outerHTML=ce(l)),de();const t=document.getElementById("sort-select");t&&(t.value=l.sort);const a=document.querySelector(".result-meta .count strong");a&&(a.textContent=x.length)}function Fe(){var t;const e=document.getElementById("search-input");if(e){let a;e.addEventListener("input",n=>{clearTimeout(a),a=setTimeout(()=>{l.q=n.target.value,l.page=1,k(),S(),V()},180)}),e.value=l.q}(t=document.getElementById("sort-select"))==null||t.addEventListener("change",a=>{l.sort=a.target.value,k(),S()}),de()}function de(){var e,t;(e=document.getElementById("open-filter"))==null||e.addEventListener("click",pe),document.querySelectorAll("[data-filter-clear]").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.filterClear;l[n]="",l.page=1,k(),S(),V()})}),(t=document.getElementById("clear-all-filters"))==null||t.addEventListener("click",ue)}function ue(){const e={q:l.q,sort:l.sort,page:1,facets:l.facets};l={..._(),...e},k(),S(),V()}function pe(){var a,n;let e=document.getElementById("filter-panel-host");e||(e=document.createElement("div"),e.id="filter-panel-host",document.body.appendChild(e)),e.innerHTML=te(l,l.facets||{});const t=e.querySelector("dialog");t.showModal(),t.addEventListener("click",i=>{i.target===t&&t.close()}),e.querySelectorAll("[data-filter]").forEach(i=>{i.addEventListener("click",()=>{const s=i.dataset.filter,d=i.dataset.value;l[s]===d?l[s]="":l[s]=d,l.page=1,e.querySelectorAll(`[data-filter="${s}"]`).forEach(c=>{c.setAttribute("aria-pressed",String(l[s]===c.dataset.value))}),k()})}),(a=e.querySelector("[data-close-filter]"))==null||a.addEventListener("click",()=>t.close()),(n=e.querySelector("[data-clear-all]"))==null||n.addEventListener("click",()=>{const i={q:l.q,sort:l.sort,page:1,facets:l.facets};l={..._(),...i},k(),e.innerHTML=te(l,l.facets||{}),t.close(),pe()}),t.addEventListener("close",()=>{S(),V()})}const U=document.createElement("div");U.className="toast-wrap";document.body.appendChild(U);function $(e,t=2400){const a=document.createElement("div");a.className="toast",a.textContent=e,U.appendChild(a),setTimeout(()=>{a.style.opacity="0",a.style.transition="opacity 200ms var(--ease)",setTimeout(()=>a.remove(),220)},t)}function J({title:e,message:t,confirmText:a="确认",cancelText:n="取消",danger:i=!1}){return new Promise(s=>{const d=document.createElement("dialog");d.innerHTML=`
      <form method="dialog" class="drawer" style="max-width: 420px;">
        <h3 style="font-size: 1.0625rem; margin-bottom: 8px;">${r(e)}</h3>
        <p style="color: var(--muted); font-size: 0.875rem; line-height: 1.6; margin-bottom: 20px;">${r(t)}</p>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button type="button" data-act="cancel" class="btn btn-secondary">${r(n)}</button>
          <button type="button" data-act="confirm" class="btn ${i?"btn-danger":"btn-primary"}">${r(a)}</button>
        </div>
      </form>
    `,document.body.appendChild(d),d.showModal();const c=f=>{d.close(),d.remove(),s(f)};d.querySelector('[data-act="cancel"]').addEventListener("click",()=>c(!1)),d.querySelector('[data-act="confirm"]').addEventListener("click",()=>c(!0)),d.addEventListener("close",()=>{d.isConnected&&c(!1)})})}function v(e,t,a={}){return t==null||t===""?`<div class="data-row"><span class="data-key">${r(e)}</span><span class="data-val data-val-text text-muted">—</span></div>`:a.raw?`<div class="data-row"><span class="data-key">${r(e)}</span><span class="data-val data-val-text">${r(t)}</span></div>`:a.tag?`<div class="data-row"><span class="data-key">${r(e)}</span><span class="data-val">${t}</span></div>`:`<div class="data-row"><span class="data-key">${r(e)}</span><span class="data-val data-val-text">${r(t)}</span></div>`}function y(e,t){let a;return t==="price"?a=Oe(e):t==="traffic"?a=Te(e):t==="distance"?a=Ae(e):t==="powerOff"?a=P(e):t==="netOff"?a=qe(e):t==="checkDorm"?a=Be(e):t==="netSpeed"?a=He(e):t==="netPrice"?a=Pe(e):t==="curfew"?a=De(e):a=re(e),`<span class="tag ${a.cls}">${r(a.label)}</span>`}function Ze(e){const t=E(),a=$e(e.id),n=e.facilities||{},i=e.around||{},s=N(e.id),d=`
    <div class="data-grid">
      ${v("上床下桌",y(n.bedDesk),{tag:!0})}
      ${v("几人间",n.roomSize?`<span class="tag tag-info">${r(String(n.roomSize))}人间</span>`:null,{tag:!0})}
      ${v("宿舍空调",y(n.dormAC),{tag:!0})}
      ${v("教室空调",y(n.classAC),{tag:!0})}
      ${v("独立卫浴",y(n.privateBath),{tag:!0})}
      ${v("洗澡热水时段",n.hotWater,{raw:!0})}
      ${v("洗衣机",n.laundry,{raw:!0})}
      ${v("通宵自习室",n.nightStudy,{raw:!0})}
      ${v("宿舍限电",n.powerLimit,{raw:!0})}
      ${v("夜间断电",y(n.nightPowerOff,"powerOff"),{tag:!0})}
      ${v("夜间断网",y(n.nightNetOff,"netOff"),{tag:!0})}
      ${v("校园网速度",y(n.netSpeed,"netSpeed"),{tag:!0})}
      ${v("校园网价格",y(n.netPrice,"netPrice"),{tag:!0})}
      ${v("大一带电脑",y(n.bringPC),{tag:!0})}
      ${v("查寝情况",y(n.checkDorm,"checkDorm"),{tag:!0})}
      ${v("晚归门禁",y(n.curfew,"curfew"),{tag:!0})}
      ${v("早晚自习",n.selfStudy,{raw:!0})}
      ${v("晨跑要求",n.morningRun,{raw:!0})}
      ${v("跑步打卡",n.runCheck,{raw:!0})}
    </div>
  `,c=`
    <div class="data-grid">
      ${v("地铁",y(i.subway),{tag:!0})}
      ${v("市区距离",y(i.cityDistance,"distance"),{tag:!0})}
      ${v("交通便利",y(i.traffic,"traffic"),{tag:!0})}
      ${v("点外卖",y(i.takeout),{tag:!0})}
      ${v("食堂价格",y(i.canteenPrice,"price"),{tag:!0})}
      ${v("超市价格",y(i.storePrice,"price"),{tag:!0})}
      ${v("收发快递",i.delivery,{raw:!0})}
      ${v("共享单车",i.sharedBike,{raw:!0})}
    </div>
  `,f=s.length?s.map(u=>fe(u,t)).join(""):`<div class="empty-state" style="padding: 32px 16px;">
         <div class="empty-state-icon">${m("message",36)}</div>
         <div class="empty-state-text">还没有评论。住过这所学校？留下第一条。</div>
       </div>`,o=`
    <form class="comment-form" id="comment-form">
      <div class="comment-form-row">
        <input type="text" class="input" id="comment-author" placeholder="昵称（可选）" maxlength="24" />
      </div>
      <textarea class="textarea" id="comment-body" placeholder="留下你真实住过这所学校的体验，3 句话就够。" maxlength="600" required></textarea>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
        <span class="text-muted text-small"><span id="char-count">0</span> / 600</span>
        <button type="submit" class="btn btn-primary">${m("plus",16)}<span>发表评论</span></button>
      </div>
    </form>
  `;return`
    <main class="app-main">
      <a href="#/" class="detail-back" data-back>${m("back",16)}<span>返回列表</span></a>

      <div class="detail-header">
        <h1 class="detail-name">${r(e.name)}</h1>
        <div class="detail-meta">
          ${e.province?`<span>${r(e.province)}</span><span class="dot"></span>`:""}
          ${e.city?`<span>${r(e.city)}</span><span class="dot"></span>`:""}
          ${e.cityType?`<span class="tag tag-neutral">${r(e.cityType)}</span>`:""}
          ${e.level?`<span>${r(e.level)}</span>`:""}
          ${e.nature?`<span class="tag tag-neutral">${r(e.nature)}</span>`:""}
          ${a?'<span class="tag tag-info">已编辑</span>':""}
        </div>
        ${e.address?`<div class="text-muted text-small" style="margin-top: 4px; display: flex; align-items: center; gap: 6px;">${m("pin",14)}<span>${r(e.address)}</span></div>`:""}
        ${e.multiCampus?`<div class="text-muted text-small" style="display: flex; align-items: center; gap: 6px;">${m("building",14)}<span>${r(e.multiCampus)}</span></div>`:""}
      </div>

      ${t?Re(a):""}

      <section class="detail-section">
        <h2 class="detail-section-title">${m("bed",18)}<span>宿舍与设施</span></h2>
        ${d}
      </section>

      <section class="detail-section">
        <h2 class="detail-section-title">${m("metro",18)}<span>周边生活</span></h2>
        ${c}
      </section>

      <section class="detail-section">
        <h2 class="detail-section-title">
          ${m("message",18)}<span>评论</span>
          <span class="count num">${s.length}</span>
        </h2>
        ${o}
        <div class="comment-list mt-4" id="comment-list">
          ${f}
        </div>
      </section>
    </main>
  `}function Re(e){return`
    <div class="admin-bar">
      <span>${m("shield",16)}<strong>管理员模式</strong>·编辑会保存在本机</span>
      <div class="admin-bar-actions">
        <button type="button" class="btn btn-secondary" id="edit-school" style="height: 32px; padding: 0 12px; font-size: 0.8125rem;">${m("edit",14)}<span>编辑</span></button>
        ${e?`<button type="button" class="btn btn-danger" id="reset-school" style="height: 32px; padding: 0 12px; font-size: 0.8125rem;">${m("trash",14)}<span>还原</span></button>`:""}
      </div>
    </div>
  `}function fe(e,t){const a=(e.author||"?").slice(0,1).toUpperCase();return`
    <article class="comment-card" data-comment-id="${e.id}">
      <header class="comment-head">
        <div class="comment-author">
          <span class="comment-avatar">${r(a)}</span>
          <span>${r(e.author)}</span>
        </div>
        <time class="comment-time" datetime="${new Date(e.createdAt).toISOString()}">${Ie(e.createdAt)}</time>
      </header>
      <div class="comment-body">${r(e.body)}</div>
      ${t?`
        <div class="comment-actions">
          <button type="button" class="comment-action" data-act="edit">${m("edit",12)}<span>编辑</span></button>
          <button type="button" class="comment-action danger" data-act="delete">${m("trash",12)}<span>删除</span></button>
        </div>
      `:""}
    </article>
  `}function Ye(e){var i,s,d;(i=document.querySelector("[data-back]"))==null||i.addEventListener("click",c=>{c.preventDefault(),A("/")});const t=document.getElementById("comment-form"),a=document.getElementById("comment-body"),n=document.getElementById("char-count");a==null||a.addEventListener("input",()=>{n.textContent=a.value.length}),t==null||t.addEventListener("submit",c=>{c.preventDefault();const f=document.getElementById("comment-author").value,o=a.value.trim();if(!o){$("写两句再发吧");return}xe(e.id,{author:f,body:o}),$("已发表"),z(e),a.value="",n.textContent="0"}),document.querySelectorAll("[data-comment-id]").forEach(c=>{var o,u;const f=c.dataset.commentId;(o=c.querySelector('[data-act="delete"]'))==null||o.addEventListener("click",async()=>{await J({title:"删除评论？",message:"这条评论会从本机永久删除。",confirmText:"删除",danger:!0})&&(se(e.id,f),$("已删除"),z(e))}),(u=c.querySelector('[data-act="edit"]'))==null||u.addEventListener("click",()=>{me(e,f)})}),(s=document.getElementById("edit-school"))==null||s.addEventListener("click",()=>We(e)),(d=document.getElementById("reset-school"))==null||d.addEventListener("click",async()=>{await J({title:"还原学校数据？",message:"你在本机对这所学校的编辑会被清除，恢复到 Excel 原始数据。",confirmText:"还原",danger:!0})&&(be(e.id),$("已还原"),window.dispatchEvent(new CustomEvent("admin-changed",{detail:E()})),A(`/school/${e.id}`))})}function z(e){const t=document.getElementById("comment-list");if(!t)return;const a=E(),n=N(e.id);if(n.length===0){t.innerHTML=`<div class="empty-state" style="padding: 32px 16px;">
      <div class="empty-state-icon">${m("message",36)}</div>
      <div class="empty-state-text">还没有评论。住过这所学校？留下第一条。</div>
    </div>`;return}t.innerHTML=n.map(s=>fe(s,a)).join(""),t.querySelectorAll("[data-comment-id]").forEach(s=>{var c,f;const d=s.dataset.commentId;(c=s.querySelector('[data-act="delete"]'))==null||c.addEventListener("click",async()=>{await J({title:"删除评论？",message:"这条评论会从本机永久删除。",confirmText:"删除",danger:!0})&&(se(e.id,d),$("已删除"),z(e))}),(f=s.querySelector('[data-act="edit"]'))==null||f.addEventListener("click",()=>me(e,d))});const i=document.querySelector(".detail-section-title .count");i&&(i.textContent=n.length)}function me(e,t){const a=N(e.id).find(s=>s.id===t);if(!a)return;const n=document.createElement("div");document.body.appendChild(n),n.innerHTML=`
    <dialog id="comment-edit-dialog" aria-label="编辑评论">
      <form class="drawer" style="max-width: 480px;" id="comment-edit-form">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h2 style="font-size: 1.0625rem;">编辑评论</h2>
          <button type="button" class="btn-ghost" data-close>${m("x",20)}</button>
        </div>
        <div class="field" style="margin-bottom: 12px;">
          <label class="field-label" for="edit-author">昵称</label>
          <input type="text" class="input" id="edit-author" maxlength="24" value="${r(a.author)}" />
        </div>
        <div class="field" style="margin-bottom: 16px;">
          <label class="field-label" for="edit-body">评论</label>
          <textarea class="textarea" id="edit-body" maxlength="600" required>${r(a.body)}</textarea>
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button type="button" class="btn btn-secondary" data-close>取消</button>
          <button type="submit" class="btn btn-primary">保存</button>
        </div>
      </form>
    </dialog>
  `;const i=n.querySelector("dialog");i.showModal(),i.addEventListener("click",s=>{s.target===i&&i.close()}),n.querySelectorAll("[data-close]").forEach(s=>s.addEventListener("click",()=>i.close())),i.addEventListener("close",()=>n.remove()),n.querySelector("#comment-edit-form").addEventListener("submit",s=>{s.preventDefault();const d=n.querySelector("#edit-author").value,c=n.querySelector("#edit-body").value.trim();if(!c){$("写两句再保存");return}we(e.id,t,{author:d,body:c}),$("已保存"),i.close(),z(e)})}function We(e){const t=ie(e.id)||{},a={...e.facilities,...t.facilities},n={...e.around,...t.around},i={...e,...t},s=[{group:"基础信息",items:[{k:"name",label:"学校名称",val:i.name||""},{k:"province",label:"省份",val:i.province||""},{k:"city",label:"城市",val:i.city||""},{k:"cityType",label:"城市等级",val:i.cityType||""},{k:"level",label:"层次",val:i.level||""},{k:"nature",label:"性质",val:i.nature||""},{k:"address",label:"地址",val:i.address||""},{k:"multiCampus",label:"多校区",val:i.multiCampus||""}]},{group:"宿舍与设施",items:[{k:"facilities.bedDesk",label:"上床下桌",val:a.bedDesk||"",type:"enum",opts:["","yes","no","partial"]},{k:"facilities.roomSize",label:"几人间",val:a.roomSize||""},{k:"facilities.dormAC",label:"宿舍空调",val:a.dormAC||"",type:"enum",opts:["","yes","no","partial"]},{k:"facilities.classAC",label:"教室空调",val:a.classAC||"",type:"enum",opts:["","yes","no","partial"]},{k:"facilities.privateBath",label:"独立卫浴",val:a.privateBath||"",type:"enum",opts:["","yes","no","partial"]},{k:"facilities.hotWater",label:"洗澡热水时段",val:a.hotWater||""},{k:"facilities.laundry",label:"洗衣机",val:a.laundry||""},{k:"facilities.nightStudy",label:"通宵自习室",val:a.nightStudy||""},{k:"facilities.powerLimit",label:"宿舍限电",val:a.powerLimit||""},{k:"facilities.nightPowerOff",label:"夜间断电",val:a.nightPowerOff||""},{k:"facilities.nightNetOff",label:"夜间断网",val:a.nightNetOff||""},{k:"facilities.netSpeed",label:"校园网速度",val:a.netSpeed||""},{k:"facilities.netPrice",label:"校园网价格",val:a.netPrice||""},{k:"facilities.bringPC",label:"大一带电脑",val:a.bringPC||"",type:"enum",opts:["","yes","no","partial"]},{k:"facilities.checkDorm",label:"查寝情况",val:a.checkDorm||""},{k:"facilities.curfew",label:"晚归门禁",val:a.curfew||""},{k:"facilities.selfStudy",label:"早晚自习",val:a.selfStudy||""},{k:"facilities.morningRun",label:"晨跑要求",val:a.morningRun||""},{k:"facilities.runCheck",label:"跑步打卡",val:a.runCheck||""}]},{group:"周边生活",items:[{k:"around.subway",label:"地铁",val:n.subway||"",type:"enum",opts:["","yes","no","partial"]},{k:"around.cityDistance",label:"市区距离",val:n.cityDistance||""},{k:"around.traffic",label:"交通便利",val:n.traffic||""},{k:"around.takeout",label:"点外卖",val:n.takeout||"",type:"enum",opts:["","yes","no","partial"]},{k:"around.canteenPrice",label:"食堂价格",val:n.canteenPrice||""},{k:"around.storePrice",label:"超市价格",val:n.storePrice||""},{k:"around.delivery",label:"收发快递",val:n.delivery||""},{k:"around.sharedBike",label:"共享单车",val:n.sharedBike||""}]}],d=u=>u==="yes"?"有":u==="no"?"无":u==="partial"?"部分有":"（空）",c=u=>{const g="edit-"+u.k.replace(/\./g,"-");if(u.type==="enum"){const h=u.opts.map(b=>`<option value="${b}" ${u.val===b?"selected":""}>${d(b)}</option>`).join("");return`
        <div class="field" style="margin-bottom: 12px;">
          <label class="field-label" for="${g}">${r(u.label)}</label>
          <select class="select" id="${g}" data-k="${u.k}">${h}</select>
        </div>
      `}return`
      <div class="field" style="margin-bottom: 12px;">
        <label class="field-label" for="${g}">${r(u.label)}</label>
        <input type="text" class="input" id="${g}" data-k="${u.k}" value="${r(u.val)}" />
      </div>
    `},f=document.createElement("div");document.body.appendChild(f),f.innerHTML=`
    <dialog id="school-edit-dialog" aria-label="编辑学校信息">
      <form class="drawer" style="max-width: 640px;" id="school-edit-form">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h2 style="font-size: 1.0625rem;">编辑 · ${r(e.name)}</h2>
          <button type="button" class="btn-ghost" data-close>${m("x",20)}</button>
        </div>
        <div style="max-height: 60vh; overflow-y: auto; padding-right: 4px;">
          ${s.map(u=>`
            <div style="margin-bottom: 20px;">
              <div class="filter-group-title">${r(u.group)}</div>
              ${u.items.map(c).join("")}
            </div>
          `).join("")}
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end; position: sticky; bottom: 0; background: var(--surface); padding-top: 12px;">
          <button type="button" class="btn btn-secondary" data-close>取消</button>
          <button type="submit" class="btn btn-primary">${m("save",16)}<span>保存</span></button>
        </div>
      </form>
    </dialog>
  `;const o=f.querySelector("dialog");o.showModal(),o.addEventListener("click",u=>{u.target===o&&o.close()}),f.querySelectorAll("[data-close]").forEach(u=>u.addEventListener("click",()=>o.close())),o.addEventListener("close",()=>f.remove()),f.querySelector("#school-edit-form").addEventListener("submit",u=>{u.preventDefault();const g={facilities:{},around:{}};f.querySelectorAll("[data-k]").forEach(h=>{const b=h.dataset.k,F=h.value;((ve,he,ge)=>{const M=he.split(".");let L=ve;for(let C=0;C<M.length-1;C++)L[M[C]]=L[M[C]]||{},L=L[M[C]];L[M[M.length-1]]=ge})(g,b,F)}),["name","province","city","cityType","level","nature","address","multiCampus"].forEach(h=>{const b=f.querySelector(`[data-k="${h}"]`);b&&(g[h]=b.value)}),ye(e.id,g),$("已保存到本机"),o.close(),window.dispatchEvent(new CustomEvent("admin-changed",{detail:E()})),A(`/school/${e.id}`)})}function Je(){const e=document.getElementById("app");e.innerHTML=Me()+'<div id="view-host"></div>',Ee()}function ae(){const e=document.getElementById("view-host");e.innerHTML=`
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
  `}function ne(e){const t=document.getElementById("view-host");t.innerHTML=`
    <main class="app-main">
      <div class="empty-state" style="padding: 80px 16px;">
        <div class="empty-state-icon"></div>
        <div class="empty-state-title">数据加载失败</div>
        <div class="empty-state-text">${e}</div>
        <button type="button" class="btn btn-primary" onclick="location.reload()">重新加载</button>
      </div>
    </main>
  `}async function R(e){const t=document.getElementById("view-host");if(e.name==="list"){ae();try{const a=await ee();await Ne(a.schools,a.facets)}catch(a){ne(a.message||"未知错误")}return}if(e.name==="detail"){ae();try{await ee();const a=Le(e.params.id);if(!a){t.innerHTML=`
          <main class="app-main">
            <div class="empty-state" style="padding: 80px 16px;">
              <div class="empty-state-title">找不到这所学校</div>
              <div class="empty-state-text">它可能不在数据集里，或者链接有问题。</div>
              <button type="button" class="btn btn-primary" onclick="location.hash = '#/'">返回列表</button>
            </div>
          </main>
        `;return}t.innerHTML=Ze(a),Ye(a),window.scrollTo({top:0,behavior:"instant"})}catch(a){ne(a.message||"未知错误")}return}e.name==="about"&&(t.innerHTML='<main class="app-main"><p>关于页暂未实现。</p></main>')}function Ke(){Je(),Se(e=>{R(e)}),R(X()),window.addEventListener("admin-changed",()=>{R(X())})}Ke();
