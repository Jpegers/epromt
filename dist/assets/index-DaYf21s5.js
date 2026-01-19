(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&c(r)}).observe(document,{childList:!0,subtree:!0});function i(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function c(t){if(t.ep)return;t.ep=!0;const n=i(t);fetch(t.href,n)}})();function L(e,o){e.innerHTML="";const i=document.createElement("main");i.className="screen instruction";const c=document.createElement("h1");c.textContent="Инструкция";const t=document.createElement("section");t.className="card block",t.innerHTML=`
    <p>
      E-Промт — это инструмент для удобной сборки промптов
      для генерации изображений и видео.
    </p>
    <p>
      Вы выбираете параметры, а сервис формирует
      готовый текст промпта, который можно сразу использовать.
    </p>
  `;const n=document.createElement("button");n.className="btn green full",n.textContent="Начать",n.addEventListener("click",()=>{localStorage.setItem("instruction_seen","1"),o({name:"menu"})}),i.appendChild(c),i.appendChild(t),i.appendChild(n),e.appendChild(i)}function f(e,o){const i=document.createElement("header");i.className="app-header";const c=document.createElement("div");if(c.className="app-header-inner",o){const n=document.createElement("button");n.className="back-button",n.innerHTML="←",n.addEventListener("click",o),c.appendChild(n)}const t=document.createElement("div");return t.className="header-title",t.textContent=e,c.appendChild(t),i.appendChild(c),i}function N(e,o){var t,n,r,s,a,l,d,u;e.innerHTML="";const i=f("E-Промт");i.classList.add("menu-header"),e.appendChild(i);const c=document.createElement("main");c.className="screen menu",c.innerHTML=`
    <section class="card block">
      <h3>Собрать промпт</h3>
      <p>Создай промпт для генерации фото или видео</p>
      <div class="actions">
        <button class="btn green" id="build-photo">Фото</button>
        <button class="btn green" id="build-video">Видео</button>
      </div>
    </section>

    <section class="card block">
      <h3>Шаблоны</h3>
      <p>Готовые шаблоны под разные задачи</p>
      <div class="actions">
        <button class="btn green" id="templates-photo">Фото</button>
        <button class="btn green" id="templates-video">Видео</button>
      </div>
    </section>

    <button class="menu-action history-btn" id="history">История копирований</button>

    <footer class="links">
      <button class="link" id="instruction">Инструкция</button>
      <button class="link" id="contacts">О разработчике</button>
      <button class="link" id="privacy">Политика конфиденциальности</button>
    </footer>
  `,e.appendChild(c),(t=c.querySelector("#build-photo"))==null||t.addEventListener("click",()=>o({name:"build",mode:"photo"})),(n=c.querySelector("#build-video"))==null||n.addEventListener("click",()=>o({name:"build",mode:"video"})),(r=c.querySelector("#templates-photo"))==null||r.addEventListener("click",()=>o({name:"templates",mode:"photo"})),(s=c.querySelector("#templates-video"))==null||s.addEventListener("click",()=>o({name:"templates",mode:"video"})),(a=c.querySelector("#history"))==null||a.addEventListener("click",()=>o({name:"history"})),(l=c.querySelector("#instruction"))==null||l.addEventListener("click",()=>o({name:"instruction"})),(d=c.querySelector("#contacts"))==null||d.addEventListener("click",()=>o({name:"contacts"})),(u=c.querySelector("#privacy"))==null||u.addEventListener("click",()=>o({name:"privacy"}))}const T=["style","mood","light"],H=[{key:"style",labelRu:"Стиль",default:"portrait",options:[{key:"portrait",ru:"Портрет",en:"portrait photography"},{key:"cinematic",ru:"Кинематографичный",en:"cinematic style"},{key:"fashion",ru:"Фэшн",en:"fashion photography"}]},{key:"mood",labelRu:"Настроение",default:"calm",options:[{key:"calm",ru:"Спокойное",en:"calm mood"},{key:"dramatic",ru:"Драматичное",en:"dramatic mood"},{key:"energetic",ru:"Энергичное",en:"energetic mood"}]},{key:"light",labelRu:"Свет",default:"soft",options:[{key:"soft",ru:"Мягкий",en:"soft light"},{key:"studio",ru:"Студийный",en:"studio lighting"},{key:"natural",ru:"Естественный",en:"natural light"}]}],M={order:T,groups:H};function S(){const e=M,o={};e.groups.forEach(r=>{o[r.key]=r.default});const i=document.createElement("section");i.className="card block constructor";const c=document.createElement("h3");c.textContent="Параметры",i.appendChild(c),e.order.forEach(r=>{const s=e.groups.find(u=>u.key===r);if(!s)return;const a=document.createElement("div");a.className="field";const l=document.createElement("label");l.textContent=s.labelRu;const d=document.createElement("select");s.options.forEach(u=>{const b=document.createElement("option");b.value=u.key,b.textContent=u.ru,u.key===s.default&&(b.selected=!0),d.appendChild(b)}),d.addEventListener("change",()=>{o[s.key]=d.value}),a.appendChild(l),a.appendChild(d),i.appendChild(a)});function t(){return e.order.map(r=>{const s=e.groups.find(l=>l.key===r);if(!s)return"";const a=s.options.find(l=>l.key===o[s.key]);return(a==null?void 0:a.ru)??""}).filter(Boolean).join(", ")}function n(){return e.order.map(r=>{const s=e.groups.find(l=>l.key===r);if(!s)return"";const a=s.options.find(l=>l.key===o[s.key]);return(a==null?void 0:a.en)??""}).filter(Boolean).join(", ")}return{element:i,getRuResult:t,getEnPrompt:n}}const C="history",E=200;function v(){try{const e=localStorage.getItem(C);if(!e)return[];const o=JSON.parse(e);return Array.isArray(o)?o:[]}catch{return[]}}function x(e){localStorage.setItem(C,JSON.stringify(e))}function w(e){const o=v(),i=o[0];i&&i.en===e.en||(o.unshift(e),o.length>E&&(o.length=E),x(o))}function R(e,o,i,c){e.innerHTML="",e.appendChild(f(c==="photo"?"Собрать промпт — Фото":"Собрать промпт — Видео",i));const t=document.createElement("main");t.className="screen build";const n=document.createElement("section");n.className="card ad",n.textContent="Рекламный блок";const r=S(),s=document.createElement("section");s.className="card result";const a=document.createElement("p");a.textContent=r.getRuResult(),s.appendChild(a),t.addEventListener("change",()=>{a.textContent=r.getRuResult()});const l=document.createElement("button");l.className="btn green full",l.textContent="Скопировать",l.addEventListener("click",async()=>{const d=r.getEnPrompt(),u=r.getRuResult();await navigator.clipboard.writeText(d),w({source:"build",ru:u,en:d,date:Date.now()}),l.textContent="Скопировано",setTimeout(()=>{l.textContent="Скопировать"},1500)}),t.appendChild(n),t.appendChild(r.element),t.appendChild(s),t.appendChild(l),e.appendChild(t)}function q(e,o,i,c){e.innerHTML="",e.appendChild(f(c==="photo"?"Шаблоны — Фото":"Шаблоны — Видео",i));const t=document.createElement("main");t.className="screen templates";const n=document.createElement("section");n.className="card ad",n.textContent="Рекламный блок";const r=document.createElement("section");r.className="template-grid";for(let s=1;s<=9;s++){const a=document.createElement("div");a.className="template-card",a.innerHTML=`
      <div class="template-preview">
        превью<br/>№${s}.jpeg
      </div>
      <div class="template-title">
        Название шаблона №${s}
      </div>
    `,a.addEventListener("click",()=>{o({name:"template",id:String(s),mode:c})}),r.appendChild(a)}t.appendChild(n),t.appendChild(r),e.appendChild(t)}function O(e,o,i,c,t){e.innerHTML="",e.appendChild(f("Скопировать шаблон",i));const n=document.createElement("main");n.className="screen template";const r=document.createElement("section");r.className="card preview",r.textContent=`Раскрытое превью №${c}`;const s=document.createElement("section");s.className="template-info",s.innerHTML=`
    <h3>Название шаблона №${c}</h3>
    <p>
      Какое-то описание или инструкция. Всё зависит от конкретного шаблона.
      Здесь осознанно оставлено место под расширение логики конструктора
      и повторное использование блоков.
    </p>
  `;const a=document.createElement("button");a.className="btn green full",a.textContent="Скопировать",n.appendChild(r),n.appendChild(s),n.appendChild(a),e.appendChild(n)}function P(e,o,i){e.innerHTML="",e.appendChild(f("Контакты",i));const c=document.createElement("main");c.className="screen contacts";const t=document.createElement("section");t.className="card block",t.innerHTML=`
    <h3>О проекте</h3>
    <p>E-Prompt — инструмент для сборки и использования промптов.</p>
  `;const n=document.createElement("section");n.className="card block",n.innerHTML=`
    <h3>Связь</h3>
    <ul class="contact-list">
      <li>
        <span>Telegram</span>
        <a href="https://t.me/your_username" target="_blank" rel="noopener">@your_username</a>
      </li>
      <li>
        <span>Email</span>
        <a href="mailto:you@email.com">you@email.com</a>
      </li>
    </ul>
  `,c.appendChild(t),c.appendChild(n),e.appendChild(c)}function B(e,o,i){e.innerHTML="",e.appendChild(f("Политика конфиденциальности",i));const c=document.createElement("main");c.className="screen privacy";const t=document.createElement("section");t.className="card block",t.innerHTML=`
    <p>
      Данное приложение не собирает и не обрабатывает персональные данные
      пользователей.
    </p>
    <p>
      Все действия выполняются локально в браузере пользователя.
      История промптов хранится в localStorage и не передаётся третьим лицам.
    </p>
    <p>
      Использование сервиса означает согласие с настоящей
      политикой конфиденциальности.
    </p>
  `,c.appendChild(t),e.appendChild(c)}function I(e,o,i){e.innerHTML="",e.appendChild(f("История копирований",i));const c=document.createElement("main");c.className="screen history";const t=v();let n=20;const r=document.createElement("div");r.className="history-list";function s(){r.innerHTML="",t.slice(0,n).forEach(a=>{const l=document.createElement("div");l.className="history-item";const d=a.source==="build"?"Конструктор":"Шаблон"+(a.title?` · ${a.title}`:"");l.innerHTML=`
        <div class="history-content">
            <div class="history-meta">
            <strong>${d}</strong> · ${new Date(a.date).toLocaleString()}
            </div>
            <div class="history-text">${a.ru}</div>
        </div>
        <button class="history-copy-btn" title="Скопировать">⧉</button>
        `,l.querySelector("button").onclick=async()=>{await navigator.clipboard.writeText(a.en)},r.appendChild(l)})}if(s(),t.length>n){const a=document.createElement("div");a.className="history-more";const l=document.createElement("button");l.textContent="Показать ещё",l.onclick=()=>{n+=20,s(),n>=t.length&&a.remove()},a.appendChild(l),c.appendChild(r),c.appendChild(a)}else c.appendChild(r);t.length===0&&(r.innerHTML='<div class="history-empty">История пуста</div>'),e.appendChild(c)}const m=document.getElementById("app");if(!m)throw new Error("#app not found");let p;const k=[];function h(e){p&&k.push(p),p=e,g()}function y(){const e=k.pop();e&&(p=e,g())}function g(){switch(m.innerHTML="",p.name){case"instruction":L(m,h);break;case"menu":N(m,h);break;case"build":R(m,h,y,p.mode);break;case"templates":q(m,h,y,p.mode);break;case"template":O(m,h,y,p.id,p.mode);break;case"contacts":P(m,h,y);break;case"privacy":B(m,h,y);break;case"history":I(m,h,y);break}}function $(){p=localStorage.getItem("instruction_seen")?{name:"menu"}:{name:"instruction"},g()}$();
