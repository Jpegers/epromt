import { renderHeader } from "../blocks/header";
import { renderTemplateDetail } from "../blocks/templateDetail";
import { createCopyButton } from "../blocks/copyButton";

import photoTemplates from "../data/templates.photo.json";
import videoTemplates from "../data/templates.video.json";

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

  // --- Template detail block ---
  const detail = renderTemplateDetail({
    title: template.titleRu,
    description: template.descriptionRu,
    preview: template.preview,
  });

  // --- Copy button block ---
  const copyButton = createCopyButton({
    getEn: () => template.promptEn,
    getRu: () => template.titleRu,
    source: "template",
  });

  // ===== Append =====
  main.appendChild(detail);
  main.appendChild(copyButton);
  root.appendChild(main);
}
