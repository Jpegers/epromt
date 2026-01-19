import { renderHeader } from "../blocks/header";

export function renderMenu(
  root: HTMLElement,
  navigate: (screen: any) => void
) {
  root.innerHTML = "";

  // ===== Header (без back) =====
  const header = renderHeader("E-Промт");
  header.classList.add("menu-header");
  root.appendChild(header);

  // ===== Main =====
  const main = document.createElement("main");
  main.className = "screen menu";

  main.innerHTML = `
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
  `;

  root.appendChild(main);

  // ===== Navigation =====
  main.querySelector("#build-photo")?.addEventListener("click", () =>
    navigate({ name: "build", mode: "photo" })
  );

  main.querySelector("#build-video")?.addEventListener("click", () =>
    navigate({ name: "build", mode: "video" })
  );

  main.querySelector("#templates-photo")?.addEventListener("click", () =>
    navigate({ name: "templates", mode: "photo" })
  );

  main.querySelector("#templates-video")?.addEventListener("click", () =>
    navigate({ name: "templates", mode: "video" })
  );

  main.querySelector("#history")?.addEventListener("click", () =>
    navigate({ name: "history" })
  );

  main.querySelector("#instruction")?.addEventListener("click", () =>
    navigate({ name: "instruction" })
  );

  main.querySelector("#contacts")?.addEventListener("click", () =>
    navigate({ name: "contacts" })
  );

  main.querySelector("#privacy")?.addEventListener("click", () =>
    navigate({ name: "privacy" })
  );
}
