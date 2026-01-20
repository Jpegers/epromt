/**
 * Типы под текущий JSON
 */
type Option = {
  key: string;
  ru: string;
  en: string;
};

type Group = {
  key: string;
  labelRu: string;
  default: string;
  options: Option[];
};

type BuildConfig = {
  order: string[];
  groups: Group[];
};

/**
 * PromptBuilder
 * - рендерит UI по JSON
 * - хранит выбранные значения
 * - отдаёт RU и EN результат
 * - умеет рандомизировать все параметры
 */
export function createPromptBuilder(config: BuildConfig) {
  const cfg = config as BuildConfig;

  // state: { [groupKey]: optionKey }
  const state: Record<string, string> = {};
  const selects: Record<string, HTMLSelectElement> = {};

  // инициализация дефолтов
  cfg.groups.forEach((group) => {
    state[group.key] = group.default;
  });

  const root = document.createElement("section");
  root.className = "card block constructor";

  // ===== Header =====
  const header = document.createElement("div");
  header.className = "builder-header";

  const title = document.createElement("h3");
  title.textContent = "Параметры";

  const randomBtn = document.createElement("button");
  randomBtn.type = "button";
  randomBtn.className = "menu-action history-btn";
  randomBtn.textContent = "🎲 Случайно";


  header.appendChild(title);
  header.appendChild(randomBtn);
  root.appendChild(header);

  // ===== UI =====
  cfg.order.forEach((groupKey) => {
    const group = cfg.groups.find((g) => g.key === groupKey);
    if (!group) return;

    const field = document.createElement("div");
    field.className = "field";

    const label = document.createElement("label");
    label.textContent = group.labelRu;

    const select = document.createElement("select");
    selects[group.key] = select;

    group.options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.key;
      option.textContent = opt.ru;
      if (opt.key === group.default) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    select.addEventListener("change", () => {
      state[group.key] = select.value;
    });

    field.appendChild(label);
    field.appendChild(select);
    root.appendChild(field);
  });

  // ===== RANDOM ALL =====
  randomBtn.addEventListener("click", () => {
    cfg.order.forEach((groupKey) => {
      const group = cfg.groups.find((g) => g.key === groupKey);
      if (!group) return;

      const realOptions = group.options.filter(
        (o) => o.key !== "__none"
      );
      if (realOptions.length === 0) return;

      const randomOpt =
        realOptions[Math.floor(Math.random() * realOptions.length)];

      state[group.key] = randomOpt.key;
      selects[group.key].value = randomOpt.key;
    });

    // триггерим обновление RU/EN
    root.dispatchEvent(new Event("change", { bubbles: true }));
  });

  /**
   * RU описание (для пользователя)
   */
  function getRuResult(): string {
    const parts: string[] = [];

    cfg.order.forEach((groupKey) => {
      const group = cfg.groups.find((g) => g.key === groupKey);
      if (!group) return;

      const key = state[group.key];
      if (!key || key === "__none") return;

      const opt = group.options.find((o) => o.key === key);
      if (!opt) return;

      parts.push(
        `${group.labelRu.toLowerCase()} «${opt.ru.toLowerCase()}»`
      );
    });

    if (parts.length === 0) {
      return "Выберите параметры сцены. Их можно использовать с текстовым описанием или с вашим изображением.";
    }

    return `Параметры промта: ${parts.join(", ")}.`;
  }

  /**
   * EN prompt (итоговый)
   */
  function getEnPrompt(): string {
    return cfg.order
      .map((groupKey) => {
        const group = cfg.groups.find((g) => g.key === groupKey);
        if (!group) return "";

        const key = state[group.key];
        if (!key || key === "__none") return "";

        const opt = group.options.find((o) => o.key === key);
        return opt?.en ?? "";
      })
      .filter(Boolean)
      .join(", ");
  }

  return {
    element: root,
    getRuResult,
    getEnPrompt,
  };
}
