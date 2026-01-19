import { renderHeader } from "../blocks/header";

export function renderPrivacy(
  root: HTMLElement,
  navigate: (screen: any) => void,
  back: () => void
) {
  root.innerHTML = "";

  // 1) Header — кнопка «назад» должна жить здесь
  root.appendChild(renderHeader("Политика конфиденциальности", back));

  // 2) Контент (ВАЖНО: без root.innerHTML +=)
  const main = document.createElement("main");
  main.className = "screen privacy";

  const card = document.createElement("section");
  card.className = "card block";

  card.innerHTML = `
    <p>
      Данное приложение не собирает и не обрабатывает персональные данные
      пользователей.
    </p>
    <p>
      Все действия выполняются локально в браузере пользователя.
      История промптов хранится в localStorage и не передаётся третьим лицам.
    </p>
    <p>
      Использование сервиса означает согласие с настоящей
      политикой конфиденциальности.
    </p>
  `;

  main.appendChild(card);
  root.appendChild(main);
}
