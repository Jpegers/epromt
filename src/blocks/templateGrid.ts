type TemplateItem = {
  id: string;
  titleRu: string;
  descriptionRu: string;
  preview: string;
};

export function renderTemplateGrid(items: TemplateItem[]): string {
  return `
    <div class="template-grid">
      ${items
        .map((item) => {
          // Normalize preview path to ensure the first media file (id_1) is used.
          // If the preview template contains "{id}_" (e.g. "{id}_1.webp"), replace
          // the placeholder with the actual id while preserving the suffix. Otherwise
          // append "_1" after the id to meet the new media contract.
          let previewTemplate = item.preview;
          if (previewTemplate.includes("{id}_")) {
            previewTemplate = previewTemplate.replace("{id}_", item.id + "_");
          } else {
            previewTemplate = previewTemplate.replace("{id}", `${item.id}_1`);
          }
          const previewUrl = "/" + previewTemplate;

          return `
            <div class="template-card">
              <div class="template-card-preview">
                <img
                  src="${previewUrl}"
                  alt="${item.titleRu}"
                  loading="lazy"
                />
              </div>

              <h3>${item.titleRu}</h3>
              <p>${item.descriptionRu}</p>

              <button onclick="location.hash='#template?id=${item.id}'">
                Открыть
              </button>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}
