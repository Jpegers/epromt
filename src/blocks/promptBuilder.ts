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
 */
export function createPromptBuilder(config: BuildConfig) {
  const cfg = config as BuildConfig;

  // state: { [groupKey]: optionKey }
  const state: Record<string, string> = {};

  // инициализация дефолтов
  cfg.groups.forEach((group) => {
    state[group.key] = group.default;
  });

  const root = document.createElement("section");
  root.className = "card block constructor";

  const title = document.createElement("h3");
  title.textContent = "Параметры";
  root.appendChild(title);

  // ===== UI =====
  cfg.order.forEach((groupKey) => {
    const group = cfg.groups.find((g) => g.key === groupKey);
    if (!group) return;

    const field = document.createElement("div");
    field.className = "field";

    const label = document.createElement("label");
    label.textContent = group.labelRu;

    const select = document.createElement("select");

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
