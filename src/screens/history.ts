import { renderHeader } from "../blocks/header";
import { getHistory } from "../blocks/historyStore";
import {
  isCopyLocked,
  getCopyRemainingMs,
  startCopyCooldown,
  subscribeCopyCooldown,
} from "../blocks/copyCooldown";

const COPY_DURATION_MS = 15_000;

export function renderHistory(
  root: HTMLElement,
  navigate: (screen: any) => void,
  back: () => void
) {
  root.innerHTML = "";

  root.appendChild(renderHeader("История копирований", back));

  const main = document.createElement("main");
  main.className = "screen history";

  const history = getHistory();
  let visibleCount = 20;

  const listWrap = document.createElement("div");
  listWrap.className = "history-list";

  function renderList() {
    listWrap.innerHTML = "";

    history.slice(0, visibleCount).forEach((item) => {
      const row = document.createElement("div");
      row.className = "history-item";

      const sourceLabel =
        item.source === "build"
          ? "Конструктор"
          : "Шаблон" + (item.title ? ` · ${item.title}` : "");

      const content = document.createElement("div");
      content.className = "history-content";
      content.innerHTML = `
        <div class="history-meta">
          <strong>${sourceLabel}</strong> · ${new Date(item.date).toLocaleString()}
        </div>
        <div class="history-text">${item.ru}</div>
      `;

      const btn = document.createElement("button");
      btn.className = "history-copy-btn copy";
      btn.textContent = "📋";

      function renderBtn() {
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
        try {
          await navigator.clipboard.writeText(item.en);
          startCopyCooldown(COPY_DURATION_MS);
        } catch {}
      };

      const unsub = subscribeCopyCooldown(renderBtn);
      renderBtn();

      const observer = new MutationObserver(() => {
        if (!btn.isConnected) {
          unsub();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      row.appendChild(content);
      row.appendChild(btn);
      listWrap.appendChild(row);
    });
  }

  renderList();

  if (history.length > visibleCount) {
    const moreWrap = document.createElement("div");
    moreWrap.className = "history-more";

    const moreBtn = document.createElement("button");
    moreBtn.textContent = "Показать ещё";

    moreBtn.onclick = () => {
      visibleCount += 20;
      renderList();
      if (visibleCount >= history.length) {
        moreWrap.remove();
      }
    };

    moreWrap.appendChild(moreBtn);
    main.appendChild(listWrap);
    main.appendChild(moreWrap);
  } else {
    main.appendChild(listWrap);
  }

  if (history.length === 0) {
    listWrap.innerHTML = `<div class="history-empty">История пуста</div>`;
  }

  root.appendChild(main);
}
