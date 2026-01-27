import { renderHeader } from "../blocks/header";
import { renderTemplateDetail } from "../blocks/templateDetail";
import { getMediaList } from "../data/media";
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

// The grid no longer uses this function directly. Preview resolution is
// handled via `getMediaList` for the detail view, and `resolvePreviewUrl`
// in `templates.ts` for the grid.
function getPreviewUrl(mode: "photo" | "video", id: string): string {
  return `previews/${mode}/${id}_1.webp`;
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

  // Gather the list of media for this template. The helper returns
  // entries with a `poster` field for videos and no explicit type. The
  // detail view interprets these entries based on the current mode.
  const media = getMediaList(mode, template.id);

  const main = document.createElement("main");
  main.className = "screen template";

  const detail = renderTemplateDetail({
    id: template.id,
    title: template.titleRu,
    description: template.descriptionRu,
    meta: template.meta,
    media,
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
