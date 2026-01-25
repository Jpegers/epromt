/**
 * Типы под текущий JSON
 */

type Option = {
  key: string;
  ru: string;
  en: string;
};

// Group supports arbitrary string "type" from JSON,
// but special logic applies ONLY for "checkbox"
type Group = {
  key: string;
  labelRu: string;
  default?: string;
  type?: "checkbox" | string;
  options: Option[];
};

type ValidationConfig = {
  requireAtLeastOne?: boolean;
  errorRu?: string;
};

export type BuildConfig = {
  order: string[];
  groups: Group[];
  validation?: ValidationConfig;
};

export function createPromptBuilder(config: BuildConfig) {
  const cfg = config;

  const state: Record<string, string | string[]> = {};
  const selects: Record<string, HTMLSelectElement> = {};
  const checkboxes: Record<string, HTMLInputElement[]> = {};

  // Init defaults
  cfg.groups.forEach((group) => {
    if (group.type === "checkbox") {
      state[group.key] = [];
    } else {
      state[group.key] = group.default ?? "__none";
    }
  });

  const root = document.createElement("section");
  root.className = "card block constructor";

  // ===== Header =====
  const header = document.createElement("div");
  header.className = "builder-header";

  const title = document.createElement("h3");
  title.textContent = "Параметры";

  const actions = document.createElement("div");
  actions.className = "actions";

  const randomBtn = document.createElement("button");
  randomBtn.type = "button";
  randomBtn.className = "btn secondary";
  randomBtn.textContent = "🎲 Случайно";

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "btn secondary";
  resetBtn.textContent = "✖ Очистить";

  actions.appendChild(randomBtn);
  actions.appendChild(resetBtn);
  header.appendChild(title);
  header.appendChild(actions);
  root.appendChild(header);

  // ===== UI =====
  cfg.order.forEach((groupKey) => {
    const group = cfg.groups.find((g) => g.key === groupKey);
    if (!group) return;

    const field = document.createElement("div");
    field.className = "field";

    const label = document.createElement("label");
    label.textContent = group.labelRu;
    field.appendChild(label);

    if (group.type === "checkbox") {
      checkboxes[group.key] = [];

      group.options.forEach((opt) => {
        const item = document.createElement("div");
        item.className = "checkbox-item";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = opt.key;
        input.id = `${group.key}-${opt.key}`;

        const lbl = document.createElement("label");
        lbl.htmlFor = input.id;
        lbl.textContent = opt.ru;

        input.addEventListener("change", () => {
          const list = state[group.key] as string[];
          if (input.checked) {
            if (!list.includes(opt.key)) list.push(opt.key);
          } else {
            const idx = list.indexOf(opt.key);
            if (idx >= 0) list.splice(idx, 1);
          }
          state[group.key] = list;
          root.dispatchEvent(new Event("change", { bubbles: true }));
        });

        item.appendChild(input);
        item.appendChild(lbl);
        field.appendChild(item);
        checkboxes[group.key].push(input);
      });
    } else {
      const select = document.createElement("select");
      selects[group.key] = select;

      group.options.forEach((opt) => {
        const option = document.createElement("option");
        option.value = opt.key;
        option.textContent = opt.ru;
        if (opt.key === (group.default ?? "__none")) {
          option.selected = true;
        }
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        state[group.key] = select.value;
        root.dispatchEvent(new Event("change", { bubbles: true }));
      });

      field.appendChild(select);
    }

    root.appendChild(field);
  });

  // ===== RANDOM =====
  randomBtn.addEventListener("click", () => {
    cfg.order.forEach((groupKey) => {
      const group = cfg.groups.find((g) => g.key === groupKey);
      if (!group || group.type === "checkbox") return;

      const realOptions = group.options.filter((o) => o.key !== "__none");
      if (!realOptions.length) return;

      const randomOpt =
        realOptions[Math.floor(Math.random() * realOptions.length)];

      state[group.key] = randomOpt.key;
      selects[group.key].value = randomOpt.key;
    });

    root.dispatchEvent(new Event("change", { bubbles: true }));
  });

  // ===== RESET =====
  resetBtn.addEventListener("click", () => {
    cfg.order.forEach((groupKey) => {
      const group = cfg.groups.find((g) => g.key === groupKey);
      if (!group) return;

      if (group.type === "checkbox") {
        state[group.key] = [];
        (checkboxes[group.key] || []).forEach((i) => (i.checked = false));
      } else {
        state[group.key] = "__none";
        selects[group.key].value = "__none";
      }
    });

    root.dispatchEvent(new Event("change", { bubbles: true }));
  });

  function getRuResult(): string {
    const parts: string[] = [];

    cfg.order.forEach((groupKey) => {
      const group = cfg.groups.find((g) => g.key === groupKey);
      if (!group) return;

      const value = state[group.key];

      if (group.type === "checkbox") {
        const selected = value as string[];
        if (!selected.length) return;

        const texts = selected
          .map((k) => group.options.find((o) => o.key === k)?.ru)
          .filter(Boolean)
          .map((t) => t!.toLowerCase());

        if (texts.length) {
          parts.push(`${group.labelRu.toLowerCase()}: ${texts.join(", ")}`);
        }
      } else {
        const key = value as string;
        if (!key || key === "__none") return;

        const opt = group.options.find((o) => o.key === key);
        if (!opt) return;

        parts.push(`${group.labelRu.toLowerCase()} «${opt.ru.toLowerCase()}»`);
      }
    });

    if (!parts.length) {
      return "Выберите параметры сцены. Их можно использовать с текстовым описанием или с вашим изображением.";
    }

    return `Параметры промта: ${parts.join(", ")}.`;
  }

  function getEnPrompt(): string {
    const parts: string[] = [];

    cfg.order.forEach((groupKey) => {
      const group = cfg.groups.find((g) => g.key === groupKey);
      if (!group) return;

      const value = state[group.key];

      if (group.type === "checkbox") {
        (value as string[]).forEach((k) => {
          const opt = group.options.find((o) => o.key === k);
          if (opt?.en) parts.push(opt.en);
        });
      } else {
        const key = value as string;
        if (!key || key === "__none") return;

        const opt = group.options.find((o) => o.key === key);
        if (opt?.en) parts.push(opt.en);
      }
    });

    return parts.join(", ");
  }

  return {
    element: root,
    getRuResult,
    getEnPrompt,
    validation: cfg.validation,
  };
}