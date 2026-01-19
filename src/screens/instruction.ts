export function renderInstruction(
  root: HTMLElement,
  navigate: (screen: any) => void
) {
  root.innerHTML = "";

  const main = document.createElement("main");
  main.className = "screen instruction";

  const title = document.createElement("h1");
  title.textContent = "Инструкция";

  const card = document.createElement("section");
  card.className = "card block";

  card.innerHTML = `
    <p>
      E-Промт — это инструмент для удобной сборки промптов
      для генерации изображений и видео.
    </p>
    <p>
      Вы выбираете параметры, а сервис формирует
      готовый текст промпта, который можно сразу использовать.
    </p>
  `;

  const button = document.createElement("button");
  button.className = "btn green full";
  button.textContent = "Начать";

  button.addEventListener("click", () => {
    localStorage.setItem("instruction_seen", "1");
    navigate({ name: "menu" });
  });

  main.appendChild(title);
  main.appendChild(card);
  main.appendChild(button);

  root.appendChild(main);
}
