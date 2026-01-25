import { getHistory } from "./historyStore";
import {
  isCopyLocked,
  getCopyRemainingMs,
  startCopyCooldown,
  subscribeCopyCooldown,
} from "./copyCooldown";

const COPY_DURATION_MS = 15_000;

export function renderHistory(root: HTMLElement) {
  const list = getHistory();

  const wrap = document.createElement("section");
  wrap.className = "card history";

  wrap.innerHTML = `
    <h4>История скопированных промптов</h4>
    ${list.length === 0 ? `<p class="muted">История пуста</p>` : ""}
  `;

  list.forEach((item) => {
    const row = document.createElement("div");
    row.className = "history-item";

    const text = document.createElement("div");
    text.className = "history-text";
    text.innerHTML = `
      <small>${new Date(item.date).toLocaleString()}</small>
      <p>${item.ru}</p>
    `;

    const btn = document.createElement("button");
    btn.className = "icon-btn copy";
    btn.textContent = "📋";

    function render() {
      if (isCopyLocked()) {
        const remaining = getCopyRemainingMs();
        const progress = 1 - remaining / COPY_DURATION_MS;

        btn.textContent = "✔";
        btn.disabled = true;
        btn.classList.add("copied");
        btn.style.setProperty("--progress", String(progress));
      } else {
        btn.textContent = "📋";
        btn.disabled = false;
        btn.classList.remove("copied");
        btn.style.removeProperty("--progress");
      }
    }

    btn.onclick = async () => {
      if (isCopyLocked()) return;

      const value = item.en?.trim() || item.ru?.trim();
      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);
        startCopyCooldown(COPY_DURATION_MS);
      } catch {}
    };

    const unsub = subscribeCopyCooldown(render);
    render();

    row.appendChild(text);
    row.appendChild(btn);
    wrap.appendChild(row);

    const observer = new MutationObserver(() => {
      if (!btn.isConnected) {
        unsub();
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });

  root.appendChild(wrap);
}
