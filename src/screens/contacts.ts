import { renderHeader } from "../blocks/header";

export function renderContacts(
  root: HTMLElement,
  navigate: (screen: any) => void,
  back: () => void
) {
  root.innerHTML = "";

  // 1) Header (кнопка назад должна жить здесь)
  root.appendChild(renderHeader("Контакты", back));

  // 2) Content (ВАЖНО: не используем root.innerHTML +=)
  const main = document.createElement("main");
  main.className = "screen contacts";

  const card1 = document.createElement("section");
  card1.className = "card block";
  card1.innerHTML = `
    <h3>О проекте</h3>
    <p>E-Prompt — инструмент для сборки и использования промптов.</p>
  `;

  const card2 = document.createElement("section");
  card2.className = "card block";
  card2.innerHTML = `
    <h3>Связь</h3>
    <ul class="contact-list">
      <li>
        <span>Telegram</span>
        <a href="https://t.me/your_username" target="_blank" rel="noopener">@your_username</a>
      </li>
      <li>
        <span>Email</span>
        <a href="mailto:you@email.com">you@email.com</a>
      </li>
    </ul>
  `;

  main.appendChild(card1);
  main.appendChild(card2);
  root.appendChild(main);
}
