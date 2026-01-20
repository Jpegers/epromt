// src/screens/build.ts

import { renderHeader } from "../blocks/header";
import { createPromptBuilder } from "../blocks/promptBuilder";
import { renderPromptResult } from "../blocks/promptResult";
import { createCopyButton } from "../blocks/copyButton";

import photoConfig from "../data/build.photo.json";
import videoConfig from "../data/build.video.json";

export function renderBuild(
  root: HTMLElement,
  navigate: (screen: any) => void, // intentionally unused
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
      title: "Описание промпта",
      description: builder.getRuResult(),
    });
  }

  // первый рендер
  updateResult();

  // live update
  builder.element.addEventListener("change", updateResult);

  // --- Copy button (block) ---
  const copyButton = createCopyButton({
    getEn: () => builder.getEnPrompt(),
    getRu: () => builder.getRuResult(),
    source: "build",
  });

  // ===== Append =====
  main.appendChild(ad);
  main.appendChild(builder.element);
  main.appendChild(resultRoot);
  main.appendChild(copyButton);

  root.appendChild(main);
}
