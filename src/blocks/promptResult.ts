type RuResult = {
  title: string;
  items: string[];
  description: string;
};

export function renderPromptResult(ru: RuResult): string {
  return `
    <section class="prompt-result">
      <h2>${ru.title}</h2>
      <ul>
        ${ru.items.map(i => `<li>${i}</li>`).join('')}
      </ul>
      <p>${ru.description}</p>
    </section>
  `;
}
