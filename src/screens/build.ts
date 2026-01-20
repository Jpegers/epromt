import { renderHeader } from "../blocks/header";
import { createPromptBuilder } from "../blocks/promptBuilder";
import { renderPromptResult } from "../blocks/promptResult";
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
  const resultRoot = document.createElement("div");
  resultRoot.className = "block";

  function updateResult() {
    resultRoot.innerHTML = renderPromptResult({
      title: "Описание промта",
      description: builder.getRuResult(),
    });
  }

  // первый рендер
  updateResult();

  // live update при изменении селектов
  builder.element.addEventListener("change", updateResult);

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

    showAdModal();

    copyBtn.textContent = "Скопировано";
    setTimeout(() => {
      copyBtn.textContent = "Скопировать";
    }, 1500);
  });

  // ===== Append =====
  main.appendChild(ad);
  main.appendChild(builder.element);
  main.appendChild(resultRoot);
  main.appendChild(copyBtn);

  root.appendChild(main);
}
