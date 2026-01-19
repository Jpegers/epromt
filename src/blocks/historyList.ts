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
    row.innerHTML = `
      <div class="history-text">
        <small>${new Date(i.date).toLocaleString()}</small>
        <p>${i.ru}</p>
      </div>
      <button class="icon-btn">⧉</button>
    `;
    row.querySelector("button")!.onclick = async () => {
      await navigator.clipboard.writeText(i.en);
    };
    wrap.appendChild(row);
  });

  root.appendChild(wrap);
}
