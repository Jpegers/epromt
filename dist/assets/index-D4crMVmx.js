(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function i(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(e){if(e.ep)return;e.ep=!0;const o=i(e);fetch(e.href,o)}})();function H(n,a){n.innerHTML="";const i=document.createElement("main");i.className="screen instruction";const t=document.createElement("h1");t.textContent="Инструкция";const e=document.createElement("section");e.className="card block",e.innerHTML=`
    <p>
      E-Промт — это инструмент для удобной сборки промптов
      для генерации изображений и видео.
    </p>
    <p>
      Вы выбираете параметры, а сервис формирует
      готовый текст промпта, который можно сразу использовать.
    </p>
  `;const o=document.createElement("button");o.className="btn green full",o.textContent="Начать",o.addEventListener("click",()=>{localStorage.setItem("instruction_seen","1"),a({name:"menu"})}),i.appendChild(t),i.appendChild(e),i.appendChild(o),n.appendChild(i)}function g(n,a){const i=document.createElement("header");i.className="app-header";const t=document.createElement("div");if(t.className="app-header-inner",a){const o=document.createElement("button");o.className="back-button",o.innerHTML="←",o.addEventListener("click",a),t.appendChild(o)}const e=document.createElement("div");return e.className="header-title",e.textContent=n,t.appendChild(e),i.appendChild(t),i}function M(n,a){var e,o,r,l,s,c,d,u;n.innerHTML="";const i=g("E-Промт");i.classList.add("menu-header"),n.appendChild(i);const t=document.createElement("main");t.className="screen menu",t.innerHTML=`
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
  `,n.appendChild(t),(e=t.querySelector("#build-photo"))==null||e.addEventListener("click",()=>a({name:"build",mode:"photo"})),(o=t.querySelector("#build-video"))==null||o.addEventListener("click",()=>a({name:"build",mode:"video"})),(r=t.querySelector("#templates-photo"))==null||r.addEventListener("click",()=>a({name:"templates",mode:"photo"})),(l=t.querySelector("#templates-video"))==null||l.addEventListener("click",()=>a({name:"templates",mode:"video"})),(s=t.querySelector("#history"))==null||s.addEventListener("click",()=>a({name:"history"})),(c=t.querySelector("#instruction"))==null||c.addEventListener("click",()=>a({name:"instruction"})),(d=t.querySelector("#contacts"))==null||d.addEventListener("click",()=>a({name:"contacts"})),(u=t.querySelector("#privacy"))==null||u.addEventListener("click",()=>a({name:"privacy"}))}function q(n){const a=n,i={};a.groups.forEach(l=>{i[l.key]=l.default});const t=document.createElement("section");t.className="card block constructor";const e=document.createElement("h3");e.textContent="Параметры",t.appendChild(e),a.order.forEach(l=>{const s=a.groups.find(m=>m.key===l);if(!s)return;const c=document.createElement("div");c.className="field";const d=document.createElement("label");d.textContent=s.labelRu;const u=document.createElement("select");s.options.forEach(m=>{const f=document.createElement("option");f.value=m.key,f.textContent=m.ru,m.key===s.default&&(f.selected=!0),u.appendChild(f)}),u.addEventListener("change",()=>{i[s.key]=u.value}),c.appendChild(d),c.appendChild(u),t.appendChild(c)});function o(){return a.order.map(l=>{const s=a.groups.find(d=>d.key===l);if(!s)return"";const c=s.options.find(d=>d.key===i[s.key]);return(c==null?void 0:c.ru)??""}).filter(Boolean).join(", ")}function r(){return a.order.map(l=>{const s=a.groups.find(d=>d.key===l);if(!s)return"";const c=s.options.find(d=>d.key===i[s.key]);return(c==null?void 0:c.en)??""}).filter(Boolean).join(", ")}return{element:t,getRuResult:o,getEnPrompt:r}}const L="history",E=200;function w(){try{const n=localStorage.getItem(L);if(!n)return[];const a=JSON.parse(n);return Array.isArray(a)?a:[]}catch{return[]}}function _(n){localStorage.setItem(L,JSON.stringify(n))}function N(n){const a=w(),i=a[0];i&&i.en===n.en||(a.unshift(n),a.length>E&&(a.length=E),_(a))}const O=["style","camera","lighting","quality"],$=[{key:"style",labelRu:"Стиль изображения",default:"photo",options:[{key:"photo",ru:"Фотореализм",en:"photorealistic, ultra detailed, natural lighting"},{key:"cinema",ru:"Кинематографичный",en:"cinematic lighting, dramatic atmosphere, shallow depth of field"},{key:"illustration",ru:"Иллюстрация",en:"digital illustration, clean lines, stylized colors"}]},{key:"camera",labelRu:"Камера и ракурс",default:"portrait",options:[{key:"portrait",ru:"Портрет",en:"portrait shot, 85mm lens"},{key:"wide",ru:"Широкий план",en:"wide angle shot, environmental context"},{key:"close",ru:"Крупный план",en:"close-up shot, high detail"}]},{key:"lighting",labelRu:"Освещение",default:"soft",options:[{key:"soft",ru:"Мягкий свет",en:"soft natural light, smooth shadows"},{key:"studio",ru:"Студийный свет",en:"studio lighting, controlled highlights"},{key:"back",ru:"Контровой свет",en:"backlight, rim light"}]},{key:"quality",labelRu:"Качество",default:"high",options:[{key:"high",ru:"Высокое",en:"high resolution, sharp focus"},{key:"ultra",ru:"Максимальное",en:"ultra high resolution, professional quality"}]}],I={order:O,groups:$},P=["scene","camera","motion","quality"],A=[{key:"scene",labelRu:"Тип сцены",default:"cinematic",options:[{key:"cinematic",ru:"Кинематографичная сцена",en:"cinematic scene, dramatic lighting, film look"},{key:"lifestyle",ru:"Лайфстайл",en:"lifestyle scene, natural environment, realistic mood"},{key:"abstract",ru:"Абстрактная",en:"abstract scene, artistic composition"}]},{key:"camera",labelRu:"Работа камеры",default:"static",options:[{key:"static",ru:"Статичная камера",en:"static camera"},{key:"pan",ru:"Плавный пан",en:"slow camera pan"},{key:"tracking",ru:"Следование за объектом",en:"tracking shot following the subject"}]},{key:"motion",labelRu:"Движение в кадре",default:"subtle",options:[{key:"subtle",ru:"Лёгкое движение",en:"subtle motion, smooth animation"},{key:"dynamic",ru:"Динамичное движение",en:"dynamic motion, energetic movement"},{key:"slowmo",ru:"Замедленное движение",en:"slow motion, cinematic timing"}]},{key:"quality",labelRu:"Качество видео",default:"high",options:[{key:"high",ru:"Высокое",en:"high quality video, clean details"},{key:"ultra",ru:"Максимальное",en:"ultra high quality video, professional production"}]}],B={order:P,groups:A},D={title:"Спасибо за использование сервиса!",text:"Подписывайся на канал, чтобы не пропустить обновления сервиса или предлагай свои идеи в чате!",button:"Перейти в Telegram",url:"https://t.me/epromt"},v={modal:D},j=60*60*1e3,C="last_ad_shown";function R(){if(document.querySelector(".modal-backdrop"))return;const n=Number(localStorage.getItem(C)||0);if(Date.now()-n<j)return;const i=document.createElement("div");i.className="modal-backdrop",i.innerHTML=`
    <div class="modal">
      <h3>${v.modal.title}</h3>
      <p>${v.modal.text}</p>

      <button class="btn green full" id="ad-action">
        ${v.modal.button}
      </button>

      <button class="btn gray full" id="ad-skip">
        Уже подписан
      </button>
    </div>
  `;const t=()=>{localStorage.setItem(C,String(Date.now())),i.remove()};i.addEventListener("click",e=>{e.target===i&&t()}),i.querySelector("#ad-action").addEventListener("click",()=>{window.open(v.modal.url,"_blank"),t()}),i.querySelector("#ad-skip").addEventListener("click",()=>{t()}),document.body.appendChild(i)}function K(n,a,i,t){n.innerHTML="",n.appendChild(g(t==="photo"?"Собрать промпт — Фото":"Собрать промпт — Видео",i));const e=document.createElement("main");e.className="screen build";const o=document.createElement("section");o.className="card ad",o.textContent="Рекламный блок";const r=q(t==="photo"?I:B),l=document.createElement("section");l.className="card result";const s=document.createElement("p");s.textContent=r.getRuResult(),l.appendChild(s),e.addEventListener("change",()=>{s.textContent=r.getRuResult()});const c=document.createElement("button");c.className="btn green full",c.textContent="Скопировать",c.addEventListener("click",async()=>{const d=r.getEnPrompt(),u=r.getRuResult();await navigator.clipboard.writeText(d),N({source:"build",ru:u,en:d,date:Date.now()}),R(),c.textContent="Скопировано",setTimeout(()=>{c.textContent="Скопировать"},1500)}),e.appendChild(o),e.appendChild(r.element),e.appendChild(l),e.appendChild(c),n.appendChild(e)}const Y=[{id:"portrait_photo",titleRu:"Портретная фотография",descriptionRu:"Классический портрет с акцентом на лицо, свет и детализацию.",preview:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",promptEn:"photorealistic portrait, soft natural light, 85mm lens, high detail, professional photography"},{id:"cinematic_photo",titleRu:"Кинематографичный кадр",descriptionRu:"Художественный кадр с драматическим светом и атмосферой кино.",preview:"https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",promptEn:"cinematic shot, dramatic lighting, shallow depth of field, film look, high quality"},{id:"lifestyle_photo",titleRu:"Лайфстайл сцена",descriptionRu:"Живой повседневный кадр в естественной обстановке.",preview:"https://images.unsplash.com/photo-1494790108377-be9c29b29330",promptEn:"lifestyle photography, natural environment, candid moment, realistic lighting"}],T={items:Y},G=[{id:"cinematic_video",titleRu:"Кинематографичное видео",descriptionRu:"Драматичный видеокадр с ощущением кино, плавным движением камеры и атмосферным светом.",preview:"https://images.unsplash.com/photo-1517602302552-471fe67acf66",promptEn:"cinematic video scene, dramatic lighting, smooth camera movement, film look, high quality"},{id:"lifestyle_video",titleRu:"Лайфстайл видео",descriptionRu:"Живое видео с естественным движением, повседневной атмосферой и реалистичным светом.",preview:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",promptEn:"lifestyle video, natural movement, realistic environment, candid moment"},{id:"abstract_video",titleRu:"Абстрактное видео",descriptionRu:"Художественное видео с акцентом на форму, цвет и движение.",preview:"https://images.unsplash.com/photo-1492724441997-5dc865305da7",promptEn:"abstract video, artistic motion, creative composition, smooth animation"}],x={items:G};function J(n,a,i,t){n.innerHTML="",n.appendChild(g(t==="photo"?"Шаблоны — Фото":"Шаблоны — Видео",i));const e=document.createElement("main");e.className="screen templates";const o=document.createElement("section");o.className="card ad",o.textContent="Рекламный блок";const r=document.createElement("section");r.className="template-grid",(t==="photo"?T.items:x.items).forEach(s=>{const c=document.createElement("div");c.className="template-card";const d=document.createElement("div");d.className="template-preview",d.style.backgroundImage=`url(${s.preview})`;const u=document.createElement("div");u.className="template-title",u.textContent=s.titleRu,c.appendChild(d),c.appendChild(u),c.addEventListener("click",()=>{a({name:"template",id:s.id,mode:t})}),r.appendChild(c)}),e.appendChild(o),e.appendChild(r),n.appendChild(e)}function W(n,a,i,t,e){n.innerHTML="",n.appendChild(g("Скопировать шаблон",i));const r=(e==="photo"?T.items:x.items).find(f=>f.id===t);if(!r){const f=document.createElement("p");f.textContent="Шаблон не найден",n.appendChild(f);return}const l=document.createElement("main");l.className="screen template";const s=document.createElement("section");s.className="card preview",s.style.backgroundImage=`url(${r.preview})`;const c=document.createElement("section");c.className="template-info";const d=document.createElement("h3");d.textContent=r.titleRu;const u=document.createElement("p");u.textContent=r.descriptionRu,c.appendChild(d),c.appendChild(u);const m=document.createElement("button");m.className="btn green full",m.textContent="Скопировать",m.addEventListener("click",async()=>{await navigator.clipboard.writeText(r.promptEn),N({source:"template",ru:r.titleRu,en:r.promptEn,date:Date.now()}),R(),m.textContent="Скопировано",setTimeout(()=>{m.textContent="Скопировать"},1500)}),l.appendChild(s),l.appendChild(c),l.appendChild(m),n.appendChild(l)}function z(n,a,i){n.innerHTML="",n.appendChild(g("Контакты",i));const t=document.createElement("main");t.className="screen contacts";const e=document.createElement("section");e.className="card block",e.innerHTML=`
    <h3>О проекте</h3>
    <p>E-Prompt — инструмент для сборки и использования промптов.</p>
  `;const o=document.createElement("section");o.className="card block",o.innerHTML=`
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
  `,t.appendChild(e),t.appendChild(o),n.appendChild(t)}function F(n,a,i){n.innerHTML="",n.appendChild(g("Политика конфиденциальности",i));const t=document.createElement("main");t.className="screen privacy";const e=document.createElement("section");e.className="card block",e.innerHTML=`
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
  `,t.appendChild(e),n.appendChild(t)}function U(n,a,i){n.innerHTML="",n.appendChild(g("История копирований",i));const t=document.createElement("main");t.className="screen history";const e=w();let o=20;const r=document.createElement("div");r.className="history-list";function l(){r.innerHTML="",e.slice(0,o).forEach(s=>{const c=document.createElement("div");c.className="history-item";const d=s.source==="build"?"Конструктор":"Шаблон"+(s.title?` · ${s.title}`:"");c.innerHTML=`
        <div class="history-content">
            <div class="history-meta">
            <strong>${d}</strong> · ${new Date(s.date).toLocaleString()}
            </div>
            <div class="history-text">${s.ru}</div>
        </div>
        <button class="history-copy-btn" title="Скопировать">⧉</button>
        `,c.querySelector("button").onclick=async()=>{await navigator.clipboard.writeText(s.en)},r.appendChild(c)})}if(l(),e.length>o){const s=document.createElement("div");s.className="history-more";const c=document.createElement("button");c.textContent="Показать ещё",c.onclick=()=>{o+=20,l(),o>=e.length&&s.remove()},s.appendChild(c),t.appendChild(r),t.appendChild(s)}else t.appendChild(r);e.length===0&&(r.innerHTML='<div class="history-empty">История пуста</div>'),n.appendChild(t)}const p=document.getElementById("app");if(!p)throw new Error("#app not found");let h;const S=[];function y(n){h&&S.push(h),h=n,k()}function b(){const n=S.pop();n&&(h=n,k())}function k(){switch(p.innerHTML="",h.name){case"instruction":H(p,y);break;case"menu":M(p,y);break;case"build":K(p,y,b,h.mode);break;case"templates":J(p,y,b,h.mode);break;case"template":W(p,y,b,h.id,h.mode);break;case"contacts":z(p,y,b);break;case"privacy":F(p,y,b);break;case"history":U(p,y,b);break}}function X(){h=localStorage.getItem("instruction_seen")?{name:"menu"}:{name:"instruction"},k()}X();
