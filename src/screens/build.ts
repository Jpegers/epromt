import { renderHeader } from "../blocks/header";
import { createPromptBuilder } from "../blocks/promptBuilder";
import { renderPromptResult } from "../blocks/promptResult";
import { createCopyButton } from "../blocks/copyButton";
import { renderAdBanner } from "../blocks/adBanner";

import type { BuildConfig } from "../blocks/promptBuilder";

import photoConfig from "../data/build.photo.json";
import videoConfig from "../data/build.video.json";

export function renderBuild(
  root: HTMLElement,
  navigate: (screen: any) => void,
  back: () => void,
  mode: "photo" | "video"
) {
  root.innerHTML = "";

  root.appendChild(
    renderHeader(
      mode === "photo"
        ? "Собрать промпт — Фото"
        : "Собрать промпт — Видео",
      back
    )
  );

  const main = document.createElement("main");
  main.className = "screen build";

  const config: BuildConfig =
    mode === "photo"
      ? (photoConfig as BuildConfig)
      : (videoConfig as BuildConfig);

  const builder = createPromptBuilder(config);

  const resultRoot = document.createElement("div");
  resultRoot.className = "block";

  const errorEl = document.createElement("p");
  errorEl.className = "validation-error";

  function updateResult() {
    resultRoot.innerHTML = renderPromptResult({
      title: "Описание промпта",
      description: builder.getRuResult(),
    });

    const validation = config.validation;

    if (validation?.requireAtLeastOne && !builder.hasSelection()) {
      errorEl.textContent = validation.errorRu || "";
    } else {
      errorEl.textContent = "";
    }
  }

  updateResult();
  builder.element.addEventListener("change", updateResult);

  const copyButton = createCopyButton({
    getEn: () => builder.getEnPrompt(),
    getRu: () => builder.getRuResult(),
    isReady: () => builder.hasSelection(),
    source: "build",
  });

  builder.element.addEventListener("change", copyButton.update);

  renderAdBanner(main);
  main.appendChild(builder.element);
  main.appendChild(resultRoot);
  main.appendChild(errorEl);
  main.appendChild(copyButton.element);

  root.appendChild(main);
}
