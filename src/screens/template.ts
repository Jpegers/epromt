import { renderHeader } from "../blocks/header";
import { addHistory } from "../blocks/historyStore";

import photoTemplates from "../data/templates.photo.json";
import videoTemplates from "../data/templates.video.json";

import { showAdModal } from "../blocks/adModal";


type TemplateItem = {
  id: string;
  titleRu: string;
  descriptionRu: string;
  preview: string;
  promptEn: string;
};

export function renderTemplate(
  root: HTMLElement,
  navigate: (screen: any) => void, // intentionally unused
  back: () => void,
  id: string,
  mode: "photo" | "video"
) {
  root.innerHTML = "";

  // ===== Header =====
  root.appendChild(renderHeader("Скопировать шаблон", back));

  // ===== Data =====
  const items =
    mode === "photo"
      ? (photoTemplates.items as TemplateItem[])
      : (videoTemplates.items as TemplateItem[]);

  const template = items.find((item) => item.id === id);

  if (!template) {
    const error = document.createElement("p");
    error.textContent = "Шаблон не найден";
    root.appendChild(error);
    return;
  }

  // ===== Main =====
  const main = document.createElement("main");
  main.className = "screen template";

  // --- Preview ---
  const preview = document.createElement("section");
  preview.className = "card preview";
  preview.style.backgroundImage = `url(${template.preview})`;

  // --- Info ---
  const info = document.createElement("section");
  info.className = "template-info";

  const title = document.createElement("h3");
  title.textContent = template.titleRu;

  const description = document.createElement("p");
  description.textContent = template.descriptionRu;

  info.appendChild(title);
  info.appendChild(description);

  // --- Copy button ---
  const copyBtn = document.createElement("button");
  copyBtn.className = "btn green full";
  copyBtn.textContent = "Скопировать";

  copyBtn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(template.promptEn);

    addHistory({
      source: "template",
      ru: template.titleRu,
      en: template.promptEn,
      date: Date.now(),
    });

    showAdModal(); // ← реклама после копирования

    copyBtn.textContent = "Скопировано";
    setTimeout(() => {
      copyBtn.textContent = "Скопировать";
    }, 1500);
  });

  // ===== Append =====
  main.appendChild(preview);
  main.appendChild(info);
  main.appendChild(copyBtn);

  root.appendChild(main);

}
