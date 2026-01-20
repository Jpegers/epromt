import { getHistory } from "./historyStore";

export function renderHistory(root: HTMLElement) {
  const list = getHistory();

  const wrap = document.createElement("section");
  wrap.className = "card history";

  wrap.innerHTML = `
    <h4>История скопированных промптов</h4>
    ${list.length === 0 ? `<p class="muted">История пуста</p>` : ""}
  `;

  list.forEach((i) => {
    const row = document.createElement("div");
    row.className = "history-item";

    const text = document.createElement("div");
    text.className = "history-text";
    text.innerHTML = `
      <small>${new Date(i.date).toLocaleString()}</small>
      <p>${i.ru}</p>
    `;

    const btn = document.createElement("button");
    btn.className = "icon-btn";
    btn.textContent = "📋";
    btn.title = "Скопировать промпт";

    btn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(i.en);

        // UX feedback
        btn.textContent = "✔";
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = "📋";
          btn.disabled = false;
        }, 800);
      } catch {
        // ничего не делаем — тихий фейл
      }
    };

    row.appendChild(text);
    row.appendChild(btn);
    wrap.appendChild(row);
  });

  root.appendChild(wrap);
}
