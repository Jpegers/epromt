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
          const previewUrl = "/" + item.preview.replace("{id}", item.id);


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
