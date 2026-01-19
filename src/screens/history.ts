import { renderHeader } from "../blocks/header";
import { getHistory } from "../blocks/historyStore";

export function renderHistory(
  root: HTMLElement,
  navigate: (screen: any) => void,
  back: () => void
) {
  root.innerHTML = "";

  // ===== Header =====
  root.appendChild(renderHeader("История копирований", back));

  // ===== Main =====
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

     row.innerHTML = `
        <div class="history-content">
            <div class="history-meta">
            <strong>${sourceLabel}</strong> · ${new Date(item.date).toLocaleString()}
            </div>
            <div class="history-text">${item.ru}</div>
        </div>
        <button class="history-copy-btn" title="Скопировать">⧉</button>
        `;



      row.querySelector("button")!.onclick = async () => {
        await navigator.clipboard.writeText(item.en);
      };

      listWrap.appendChild(row);
    });
  }

  renderList();

  // ===== Load more =====


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
