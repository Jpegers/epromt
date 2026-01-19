import { renderHeader } from "../blocks/header";
import { createPromptBuilder } from "../blocks/promptBuilder";
import { addHistory } from "../blocks/historyStore";

import photoConfig from "../data/build.photo.json";
import videoConfig from "../data/build.video.json";

import { showAdModal } from "../blocks/adModal";


export function renderBuild(
  root: HTMLElement,
  navigate: (screen: any) => void,
  back: () => void,
  mode: "photo" | "video"
) {
  root.innerHTML = "";

  // ===== Header =====
  root.appendChild(
    renderHeader(
      mode === "photo"
        ? "Собрать промпт — Фото"
        : "Собрать промпт — Видео",
      back
    )
  );

  // ===== Main =====
  const main = document.createElement("main");
  main.className = "screen build";

  // --- Ad banner (заглушка) ---
  const ad = document.createElement("section");
  ad.className = "card ad";
  ad.textContent = "Рекламный блок";

  // --- Prompt Builder ---
  const builder = createPromptBuilder(
    mode === "photo" ? photoConfig : videoConfig
  );

  // --- Result ---
  const result = document.createElement("section");
  result.className = "card result";

  const resultText = document.createElement("p");
  resultText.textContent = builder.getRuResult();
  result.appendChild(resultText);

  // --- Live update RU result ---
  main.addEventListener("change", () => {
    resultText.textContent = builder.getRuResult();
  });

  // --- Copy button ---
  const copyBtn = document.createElement("button");
  copyBtn.className = "btn green full";
  copyBtn.textContent = "Скопировать";

  copyBtn.addEventListener("click", async () => {
    const en = builder.getEnPrompt();
    const ru = builder.getRuResult();

    await navigator.clipboard.writeText(en);

    addHistory({
      source: "build",
      ru,
      en,
      date: Date.now(),
    });

    showAdModal(); // ← реклама после копирования

    copyBtn.textContent = "Скопировано";
    setTimeout(() => {
      copyBtn.textContent = "Скопировать";
    }, 1500);
  });

  // ===== Append =====
  main.appendChild(ad);
  main.appendChild(builder.element);
  main.appendChild(result);
  main.appendChild(copyBtn);

  root.appendChild(main);

}
