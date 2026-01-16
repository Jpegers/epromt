/* ==========================================================
   Е‑ПРОМТ — логика (Mini App friendly)
   - Разделено на 3 файла
   - Поддержка Telegram WebApp (theme + expand)
   - Копирование с fallback
   - История хранится в localStorage
   ========================================================== */

(() => {
  "use strict";

  // ------------------------------
  // Telegram integration
  // ------------------------------
  const tg = (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp)
    ? window.Telegram.WebApp
    : null;

  const tgStatusEl = document.getElementById("tgStatus");

  function setStatus(text) {
    if (!tgStatusEl) return;
    tgStatusEl.textContent = text || "";
  }

  function applyTelegramTheme() {
    if (!tg) return;

    const p = tg.themeParams || {};
    const root = document.documentElement;

    // Telegram может отдавать неполный набор параметров — применяем аккуратно
    const map = [
      ["--bg", p.bg_color],
      ["--card", p.secondary_bg_color],
      ["--text", p.text_color],
      ["--muted", p.hint_color],
      ["--primary", p.button_color],
      ["--primaryText", p.button_text_color],
      ["--border", p.hint_color ? hexToRgba(p.hint_color, 0.22) : null]
    ];

    for (const [cssVar, value] of map) {
      if (value) root.style.setProperty(cssVar, value);
    }
  }

  function hexToRgba(hex, alpha) {
    const h = String(hex).replace("#", "").trim();
    if (h.length !== 6) return `rgba(255,255,255,${alpha})`;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function initTelegram() {
    if (!tg) {
      setStatus("WebView: Browser");
      return;
    }

    try {
      tg.ready();
      tg.expand();

      // Подстраховка: некоторые клиенты любят, когда фон совпадает
      if (tg.setHeaderColor) tg.setHeaderColor("secondary_bg_color");
      if (tg.setBackgroundColor) tg.setBackgroundColor(tg.themeParams?.bg_color || "#ffffff");

      applyTelegramTheme();

      tg.onEvent("themeChanged", applyTelegramTheme);
      setStatus(`WebView: Telegram (${tg.platform || "unknown"})`);
    } catch {
      setStatus("WebView: Telegram");
    }
  }

  // ------------------------------
  // Data + random selection
  // ------------------------------
  const randomMap = {
    emotion: [
      { en: "neutral confident expression", ru: "нейтральная уверенность" },
      { en: "relaxed seductive calm", ru: "расслабленная соблазнительность" },
      { en: "playful bold attitude", ru: "игривая дерзость" },
      { en: "tired dreamy look", ru: "томная усталость" },
      { en: "soft sincere smile", ru: "мягкая искренняя улыбка" },
      { en: "focused calm seriousness", ru: "спокойная сосредоточенность" },
      { en: "light playful flirt", ru: "лёгкий флирт" },
      { en: "quiet inner confidence", ru: "внутренняя уверенность" },
      { en: "melancholic calm mood", ru: "спокойная меланхолия" },
      { en: "subtle mysterious look", ru: "лёгкая загадочность" },
      { en: "casual everyday expression", ru: "повседневная естественность" },
      { en: "soft emotional vulnerability", ru: "мягкая эмоциональность" },
      { en: "calm observational mood", ru: "спокойное наблюдение" },
      { en: "slightly ironic expression", ru: "лёгкая ирония" }
    ],

    style: [
      { en: "natural photo style, realistic lighting", ru: "натуральная фотография" },
      { en: "editorial fashion photography", ru: "редакционный fashion-стиль" },
      { en: "high-end fashion photography", ru: "премиальная fashion-съёмка" },
      { en: "cinematic film look", ru: "кинематографичный плёночный стиль" },
      { en: "vibrant cinematic colors, film look", ru: "яркий кинематографичный цвет" },
      { en: "cross-processed film tones", ru: "кросс-процессинг плёнки" },
      { en: "experimental weird film aesthetics", ru: "экспериментальный арт-стиль" },
      { en: "detailed digital illustration style", ru: "детализированная цифровая иллюстрация" },
      { en: "stylized 3D character render look", ru: "стилизованный 3D-персонаж" },
      { en: "soft dreamy anime style", ru: "мягкий аниме-стиль" }
    ],

    scene: [
      { en: "urban winter city, snowy streets", ru: "зимний городской пейзаж" },
      { en: "modern cafe interior", ru: "современное кафе" },
      { en: "minimal studio environment", ru: "минималистичная студия" },
      { en: "night city lights, cinematic atmosphere", ru: "ночной город с огнями" },
      { en: "quiet residential street", ru: "тихая городская улица" },
      { en: "modern apartment interior", ru: "современная квартира" },
      { en: "window light interior scene", ru: "интерьер с оконным светом" },
      { en: "urban balcony view", ru: "городской балкон" },
      { en: "city cafe terrace", ru: "кафе на улице" },
      { en: "public transport interior", ru: "в салоне общественного транспорта" },
      { en: "minimal bedroom interior", ru: "минималистичная спальня" },
      { en: "office interior with daylight", ru: "офис при дневном свете" },
      { en: "urban crosswalk scene", ru: "городской пешеходный переход" },
      { en: "modern shopping mall interior", ru: "современный торговый центр" },
      { en: "city park pathway", ru: "городской парк" },
      { en: "evening street after snowfall", ru: "вечерняя улица после снегопада" }
    ],

    camera: [
      { en: "35mm natural perspective", ru: "натуральная перспектива (35mm)" },
      { en: "50mm portrait lens", ru: "портретная оптика (50mm)" },
      { en: "85mm cinematic compression", ru: "кинематографичная компрессия (85mm)" },
      { en: "24mm wide angle", ru: "широкоугольный объектив" },
      {
        en: "smartphone photo aesthetic, 26mm full-frame equivalent, f/1.8, computational HDR, slight edge sharpening, natural noise reduction, handheld framing, on-axis perspective, quick snapshot feel, no visible device in frame",
        ru: "эстетика камеры смартфона (снимок на ходу)"
      }
    ]
  };

  const nonPhotoStyles = new Set([
    "detailed digital illustration style",
    "stylized 3D character render look",
    "soft dreamy anime style"
  ]);

  function pick(value, key) {
    const list = randomMap[key];
    if (!list) throw new Error(`Missing randomMap for ${key}`);

    if (value === "random") {
      return list[Math.floor(Math.random() * list.length)];
    }

    const found = list.find((i) => i.en === value);
    if (!found) throw new Error(`Value "${value}" not found in ${key}`);
    return found;
  }

  // ------------------------------
  // UI helpers
  // ------------------------------
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove("is-visible"), 1400);
  }

  async function copyText(text) {
    // 1) Modern clipboard
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // continue
    }

    // 2) Fallback: execCommand
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

  // ------------------------------
  // History (persisted)
  // ------------------------------
  const STORAGE_KEY = "epromt_history_v1";
  const MAX_HISTORY = 20;

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function saveHistory(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  let promptHistory = loadHistory();

  function addToHistory(promptText, descriptionText) {
    const exists = promptHistory.some((item) => item.prompt === promptText);
    if (exists) return;

    const now = new Date();
    promptHistory.unshift({
      date: now.toLocaleDateString("ru-RU"),
      time: now.toLocaleTimeString("ru-RU"),
      description: descriptionText,
      prompt: promptText
    });

    if (promptHistory.length > MAX_HISTORY) promptHistory = promptHistory.slice(0, MAX_HISTORY);

    saveHistory(promptHistory);
    renderHistory();
  }

  function clearHistory() {
    promptHistory = [];
    saveHistory(promptHistory);
    renderHistory();
    toast("История очищена");
  }

  async function copyFromHistory(index) {
    const item = promptHistory[index];
    if (!item) return;

    const ok = await copyText(item.prompt);
    toast(ok ? "Промт скопирован" : "Не удалось скопировать");
  }

  function renderHistory() {
    const container = document.getElementById("promptHistory");
    if (!container) return;

    container.innerHTML = "";

    if (!promptHistory.length) {
      const empty = document.createElement("div");
      empty.className = "history__item";
      empty.innerHTML = `<div class="history__desc" style="margin:0;color:var(--muted)">Пока пусто. Нажмите «Скопировать» — и промт появится здесь.</div>`;
      container.appendChild(empty);
      return;
    }

    promptHistory.forEach((item, index) => {
      const block = document.createElement("div");
      block.className = "history__item";

      block.innerHTML = `
        <div class="history__meta">
          <span>${item.date}</span>
          <span>•</span>
          <span>${item.time}</span>
        </div>
        <p class="history__desc">${escapeHtml(item.description)}</p>
        <textarea rows="2" readonly>${item.prompt}</textarea>
        <div class="history__controls">
          <button type="button" class="btn" data-action="copy" data-index="${index}">Повторно скопировать</button>
        </div>
      `;

      container.appendChild(block);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ------------------------------
  // Prompt build
  // ------------------------------
  function buildPrompt() {
    const form = document.getElementById("promptForm");
    if (!form) return;

    const d = new FormData(form);

    const character = String(d.get("character") || "");
    const emotion = pick(String(d.get("emotion") || "random"), "emotion");
    const style = pick(String(d.get("style") || "random"), "style");
    const scene = pick(String(d.get("scene") || "random"), "scene");
    const camera = pick(String(d.get("camera") || "random"), "camera");
    const aspect = String(d.get("aspect") || "auto");

    const parts = [];
    if (character) parts.push(character);

    const isPhoto = !nonPhotoStyles.has(style.en);

    const quality = isPhoto
      ? "photorealistic, crisp realism, minimal post-processing"
      : "high detail, clean shapes, consistent style, sharp focus";

    parts.push(
      emotion.en,
      style.en,
      scene.en,
      camera.en,
      quality,
      "no phone, no camera, no visible device, no smartphone in hand, no screen reflection, no photographing gesture"
    );

    if (aspect !== "auto") parts.push(aspect);

    const promptText = parts.join(", ");

    const resultEl = document.getElementById("result");
    const descEl = document.getElementById("description");

    if (resultEl) resultEl.value = promptText;

    if (descEl) {
      descEl.textContent =
        `${isPhoto ? "Фотореалистичное изображение" : "Стилизованное изображение"}. ` +
        `Эмоция: ${emotion.ru}. ` +
        `Стиль: ${style.ru}. ` +
        `Сцена: ${scene.ru}. ` +
        `Камера: ${camera.ru}.`;
    }
  }

  // ------------------------------
  // Wiring
  // ------------------------------
  function wireUI() {
    const refreshBtn = document.getElementById("refreshBtn");
    const copyBtn = document.getElementById("copyBtn");
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");
    const form = document.getElementById("promptForm");

    refreshBtn?.addEventListener("click", () => {
      buildPrompt();
      toast("Промт обновлён");
    });

    // Авто‑пересборка при смене параметров
    form?.addEventListener("change", () => {
      buildPrompt();
    });

    copyBtn?.addEventListener("click", async () => {
      const promptText = (document.getElementById("result")?.value || "").trim();
      const descriptionText = (document.getElementById("description")?.textContent || "").trim();

      if (!promptText) {
        toast("Промт пустой");
        return;
      }

      const ok = await copyText(promptText);
      addToHistory(promptText, descriptionText);

      toast(ok ? "Промт скопирован" : "Не удалось скопировать: выделите вручную");
    });

    clearHistoryBtn?.addEventListener("click", clearHistory);

    document.getElementById("promptHistory")?.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      const action = target.getAttribute("data-action");
      if (action !== "copy") return;

      const index = Number(target.getAttribute("data-index"));
      if (!Number.isFinite(index)) return;

      copyFromHistory(index);
    });
  }

  // ------------------------------
  // Boot
  // ------------------------------
  initTelegram();
  wireUI();
  renderHistory();
  buildPrompt();
})();
