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

  // видео-поля, на будущее (не мешают фото)
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
};

function resolvePreviewUrl(mode: "photo" | "video", item: TemplateItem): string {
  // ✅ Основной источник истины: id → previews/<mode>/<id>.webp
  const byId = `previews/${mode}/${item.id}.webp`;

  // ✅ Если в JSON вдруг уже корректный путь — можно оставить как запасной вариант
  // (но для фото у тебя сейчас есть расхождения, поэтому byId должен быть приоритетом)
  if (mode === "photo") return byId;

  // Для видео (на будущее): пробуем item.preview, иначе byId
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

  // ✅ FIX: превью всегда резолвим по id (как в сетке), чтобы не зависеть от битых путей JSON
  const previewUrl = resolvePreviewUrl(mode, template);

  // ===== Main =====
  const main = document.createElement("main");
  main.className = "screen template";

  // ===== Template detail =====
  const detail = renderTemplateDetail({
    title: template.titleRu,
    description: template.descriptionRu,
    preview: previewUrl,
    meta: template.meta
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
