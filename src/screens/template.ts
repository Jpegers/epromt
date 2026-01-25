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
  cameraMotion?: string;
  sceneMotion?: string;
};

type TemplateItem = {
  id: string;
  titleRu: string;
  descriptionRu: string;
  promptEn: string;
  meta: TemplateMeta;
  video?: string;
};

function getPreviewUrl(mode: "photo" | "video", id: string): string {
  return `previews/${mode}/${id}.webp`;
}

export function renderTemplate(
  root: HTMLElement,
  navigate: (screen: any) => void,
  back: () => void,
  id: string,
  mode: "photo" | "video"
) {
  root.innerHTML = "";

  root.appendChild(renderHeader("Скопировать шаблон", back));

  const items =
    mode === "photo"
      ? (photoTemplates.items as TemplateItem[])
      : (videoTemplates.items as TemplateItem[]);

  const template = items.find((item) => item.id === id);

  if (!template) {
    root.appendChild(document.createTextNode("Шаблон не найден"));
    return;
  }

  const previewUrl = getPreviewUrl(mode, template.id);

  const videoUrl =
    mode === "video" && template.video
      ? template.video.replace("{id}", template.id)
      : undefined;

  const main = document.createElement("main");
  main.className = "screen template";

  const detail = renderTemplateDetail({
    title: template.titleRu,
    description: template.descriptionRu,
    preview: previewUrl,
    meta: template.meta,
    video: videoUrl,
  });

  const copyButton = createCopyButton({
    getEn: () => template.promptEn,
    getRu: () => template.descriptionRu,
    source: "template",
  });

  main.appendChild(detail);
  main.appendChild(copyButton.element);
  root.appendChild(main);
}
