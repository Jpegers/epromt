import { renderHeader } from "../blocks/header";
import { renderAdBanner } from "../blocks/adBanner";

import photoTemplates from "../data/templates.photo.json";
import videoTemplates from "../data/templates.video.json";

type TemplateItem = {
  id: string;
  titleRu: string;
  descriptionRu: string;
  preview: string;
  promptEn: string;
};

function resolvePreviewUrl(
  mode: "photo" | "video",
  item: TemplateItem
): string {
  // Источник истины — id шаблона
  // Файлы лежат в public/previews/photo/<id>.webp
  return `previews/${mode}/${item.id}.webp`;
}

export function renderTemplates(
  root: HTMLElement,
  navigate: (screen: any) => void,
  back: () => void,
  mode: "photo" | "video"
) {
  root.innerHTML = "";

  // ===== Header =====
  root.appendChild(
    renderHeader(
      mode === "photo" ? "Шаблоны — Фото" : "Шаблоны — Видео",
      back
    )
  );

  // ===== Main =====
  const main = document.createElement("main");
  main.className = "screen templates";

  // --- Grid ---
  const grid = document.createElement("section");
  grid.className = "template-grid";

  const data =
    mode === "photo"
      ? (photoTemplates.items as TemplateItem[])
      : (videoTemplates.items as TemplateItem[]);

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "template-card";

    const preview = document.createElement("div");
    preview.className = "template-preview";
    preview.style.backgroundImage = `url(${resolvePreviewUrl(
      mode,
      item
    )})`;

    const title = document.createElement("div");
    title.className = "template-title";
    title.textContent = item.titleRu;

    card.appendChild(preview);
    card.appendChild(title);

    card.addEventListener("click", () => {
      navigate({
        name: "template",
        id: item.id,
        mode
      });
    });

    grid.appendChild(card);
  });

  // ===== Append =====
  // insert ad banner if enabled
  renderAdBanner(main);
  main.appendChild(grid);
  root.appendChild(main);
}
