import { addHistory } from "./historyStore";
import { showAdModal } from "./adModal";

type CopyButtonOptions = {
  getEn: () => string;
  getRu: () => string;
  source: "build" | "template";
};

export function createCopyButton(options: CopyButtonOptions): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = "btn green full";
  button.textContent = "Скопировать";

  let locked = false;

  button.addEventListener("click", async () => {
    if (locked) return;
    locked = true;

    const en = options.getEn();
    const ru = options.getRu();

    if (!en) {
      locked = false;
      return;
    }

    try {
      await navigator.clipboard.writeText(en);

      addHistory({
        source: options.source,
        ru,
        en,
        date: Date.now(),
      });

      showAdModal();

      button.textContent = "Скопировано";
      setTimeout(() => {
        button.textContent = "Скопировать";
        locked = false;
      }, 1500);
    } catch {
      locked = false;
    }
  });

  return button;
}
