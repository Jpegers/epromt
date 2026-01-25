import {
  isCopyLocked,
  getCopyRemainingMs,
  startCopyCooldown,
  subscribeCopyCooldown,
} from "./copyCooldown";
import { addHistory } from "./historyStore";

type Source = "build" | "template" | "history";

type CopyButtonProps = {
  getEn: () => string;
  getRu: () => string;
  source: Source;
  isReady?: () => boolean;
};

const DEFAULT_DURATION_MS = 15_000;

type CopyButtonInstance = {
  element: HTMLButtonElement;
  update: () => void;
};

export function createCopyButton(
  props: CopyButtonProps
): CopyButtonInstance {
  const button = document.createElement("button");
  button.className = "btn copy";

  function isReady(): boolean {
    if (props.isReady) return props.isReady();
    return (
      props.getEn().trim().length > 0 ||
      props.getRu().trim().length > 0
    );
  }

  function getTextToCopy(): { en: string; ru: string } {
    const en = props.getEn().trim();
    const ru = props.getRu().trim();
    return {
      en: en || ru,
      ru: ru || en,
    };
  }

  function render() {
    const locked = isCopyLocked();
    const ready = isReady();

    button.classList.remove("copied");
    button.style.removeProperty("--progress");

    if (props.source === "build" && !ready) {
      button.textContent = "Выберите параметр";
      button.disabled = true;
      return;
    }

    if (locked) {
      const remaining = getCopyRemainingMs();
      const progress = 1 - remaining / DEFAULT_DURATION_MS;

      button.textContent = "Скопировано";
      button.disabled = true;
      button.classList.add("copied");
      button.style.setProperty(
        "--progress",
        `${Math.min(Math.max(progress, 0), 1)}`
      );
      return;
    }

    button.textContent = "Скопировать";
    button.disabled = !ready;
  }

  async function handleClick() {
    if (isCopyLocked()) return;
    if (!isReady()) return;

    const { en, ru } = getTextToCopy();
    if (!en && !ru) return;

    try {
      await navigator.clipboard.writeText(en);

      if (props.source !== "history") {
        addHistory({
          source: props.source,
          en,
          ru,
          date: Date.now(),
        });
      }

      startCopyCooldown(DEFAULT_DURATION_MS);
    } catch {
      /* silent */
    }
  }

  button.addEventListener("click", handleClick);

  const unsubscribe = subscribeCopyCooldown(render);
  render();

  const observer = new MutationObserver(() => {
    if (!button.isConnected) {
      unsubscribe();
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return {
    element: button,
    update: render,
  };
}
