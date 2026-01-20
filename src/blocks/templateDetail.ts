type TemplateDetailProps = {
  title: string;
  description: string;
  preview: string;
};

export function renderTemplateDetail(
  props: TemplateDetailProps
): HTMLElement {
  const container = document.createElement("section");
  container.className = "template-detail";

  const preview = document.createElement("div");
  preview.className = "card preview";
  preview.style.backgroundImage = `url(${props.preview})`;

  const info = document.createElement("div");
  info.className = "template-info";

  const title = document.createElement("h3");
  title.textContent = props.title;

  const description = document.createElement("p");
  description.textContent = props.description;

  info.appendChild(title);
  info.appendChild(description);

  container.appendChild(preview);
  container.appendChild(info);

  return container;
}
