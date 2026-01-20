  type RuResult = {
    title: string;
    description: string;
  };


  export function renderPromptResult(ru: RuResult): string {
    return `
      <section class="prompt-result">
        <h2>${ru.title}</h2>
        <p>${ru.description}</p>
      </section>
    `;
  }

