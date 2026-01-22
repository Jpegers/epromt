import { TEMPLATE_META_LABELS_RU } from "../data/templateMetaLabels";

// ===== Types =====
type TemplateMeta = {
  input: string;
  format: string;
  difficulty: string;
  sourceHint?: string;
};

// ===== Render =====
export function renderTemplateDetail(props: {
  title: string;
  description: string;
  preview: string;
  meta: TemplateMeta;
}): HTMLElement {
  const container = document.createElement("section");
  container.className = "template-detail";

  // ===== Preview (FIXED) =====
  const preview = document.createElement("div");
  preview.className = "card preview";

  const img = document.createElement("img");
  img.src = props.preview;
  img.alt = props.title;
  img.loading = "lazy";

  preview.appendChild(img);

  // ===== Info =====
  const info = document.createElement("div");
  info.className = "template-info";

  const title = document.createElement("h3");
  title.textContent = props.title;

  // ===== Meta =====
  const metaBlock = document.createElement("div");
  metaBlock.className = "template-meta";

  const inputText =
    TEMPLATE_META_LABELS_RU.input[
      props.meta.input as keyof typeof TEMPLATE_META_LABELS_RU.input
    ];

  const formatText =
    TEMPLATE_META_LABELS_RU.format[
      props.meta.format as keyof typeof TEMPLATE_META_LABELS_RU.format
    ];

  const difficultyText =
    TEMPLATE_META_LABELS_RU.difficulty[
      props.meta.difficulty as keyof typeof TEMPLATE_META_LABELS_RU.difficulty
    ];

  metaBlock.innerHTML = `
    <div class="meta-item">
      <span>Исходные материалы:</span>
      <strong>${inputText}</strong>
    </div>

    <div class="meta-item">
      <span>Формат результата:</span>
      <strong>${formatText}</strong>
    </div>

    <div class="meta-item">
      <span>Условия:</span>
      <strong>${difficultyText}</strong>
    </div>

    ${
      props.meta.sourceHint
        ? `<div class="meta-hint">${props.meta.sourceHint}</div>`
        : ""
    }
  `;

  // ===== Description =====
  const description = document.createElement("p");
  description.className = "template-description";
  description.textContent = props.description;

  // ===== Assemble =====
  info.appendChild(title);
  info.appendChild(metaBlock);
  info.appendChild(description);

  container.appendChild(preview);
  container.appendChild(info);

  return container;
}
