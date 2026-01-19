type TemplateItem = {
  id: string;
  title: string;
  description: string;
  preview: string;
  enPrompt: string;
};

export function renderTemplateGrid(items: TemplateItem[]): string {
  return `
    <div class="template-grid">
      ${items
        .map(
          (item) => `
            <div class="template-card">
              <h3>${item.title}</h3>
              <p>${item.description}</p>
              <button onclick="location.hash='#template?id=${item.id}'">
                Открыть
              </button>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}
