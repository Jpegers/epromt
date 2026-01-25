// src/screens/build.ts

import { renderHeader } from "../blocks/header";
import { createPromptBuilder } from "../blocks/promptBuilder";
import { renderPromptResult } from "../blocks/promptResult";
import { createCopyButton } from "../blocks/copyButton";
import { renderAdBanner } from "../blocks/adBanner";

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

  // --- Ad banner (use config) ---
  // Will insert a banner only if enabled in ads.json

  // --- Prompt Builder ---
  const config = mode === "photo" ? photoConfig : videoConfig;
  const builder = createPromptBuilder(config);

  // --- Result ---
  const resultRoot = document.createElement("div");
  resultRoot.className = "block";

  // Validation / error display
  const errorEl = document.createElement("p");
  errorEl.className = "validation-error";

  function updateResult() {
    resultRoot.innerHTML = renderPromptResult({
      title: "Описание промпта",
      description: builder.getRuResult(),
    });
    // show validation error if no parameters selected and validation config requires at least one
    const hasPrompt = builder.getEnPrompt().trim().length > 0;
    const validation = (config as any).validation;
    if (validation && validation.requireAtLeastOne && !hasPrompt) {
      errorEl.textContent = validation.errorRu || "";
    } else {
      errorEl.textContent = "";
    }
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
  // insert ad banner (if enabled)
  renderAdBanner(main);
  main.appendChild(builder.element);
  main.appendChild(resultRoot);
  main.appendChild(errorEl);
  main.appendChild(copyButton);

  root.appendChild(main);
}
