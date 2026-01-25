import { renderHeader } from "../blocks/header";
import { renderTemplateDetail } from "../blocks/templateDetail";
import { createCopyButton } from "../blocks/copyButton";

import photoTemplates from "../data/templates.photo.json";
import videoTemplates from "../data/templates.video.json";

// ===== Types =====

type TemplateMeta = {
  input: string;
  format: string;
  difficulty: string;
  sourceHint?: string;

  // видео-поля, на будущее
  cameraMotion?: string;
  sceneMotion?: string;
};

type TemplateItem = {
  id: string;
  titleRu: string;
  descriptionRu: string;
  preview: string;
  promptEn: string;
  meta: TemplateMeta;
  video?: string; // ← ВАЖНО
};

function resolvePreviewUrl(
  mode: "photo" | "video",
  item: TemplateItem
): string {
  const byId = `previews/${mode}/${item.id}.webp`;

  if (mode === "photo") return byId;

  if (item.preview && typeof item.preview === "string") return item.preview;
  return byId;
}

// ===== Screen =====

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

const previewUrl = template.preview.replace(
  "{id}",
  template.id
);

const videoUrl =
  mode === "video" && template.video
    ? template.video.replace("{id}", template.id)
    : undefined;


  // ===== Main =====
  const main = document.createElement("main");
  main.className = "screen template";

  // ===== Template detail =====
  const detail = renderTemplateDetail({
    title: template.titleRu,
    description: template.descriptionRu,
    preview: previewUrl,
    meta: template.meta,
    video: videoUrl
  });


  // ===== Copy button =====
  const copyButton = createCopyButton({
    getEn: () => template.promptEn,
    getRu: () => template.titleRu,
    source: "template"
  });

  // ===== Append =====
  main.appendChild(detail);
  main.appendChild(copyButton);
  root.appendChild(main);
}
