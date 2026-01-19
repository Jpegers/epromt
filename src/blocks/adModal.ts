import ads from "../data/ads.json";

const ONE_HOUR = 60 * 60 * 1000;
const STORAGE_KEY = "last_ad_shown";

export function showAdModal() {
  if (!ads.modal?.enabled) return;

  // защита от повторного открытия в DOM
  if (document.querySelector(".modal-backdrop")) return;

  // проверка частоты (не чаще 1 раза в час)
  const lastShown = Number(localStorage.getItem(STORAGE_KEY) || 0);
  const now = Date.now();

  if (now - lastShown < ONE_HOUR) return;

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  backdrop.innerHTML = `
    <div class="modal">
      <h3>${ads.modal.title}</h3>
      <p>${ads.modal.text}</p>

      <button class="btn green full" id="ad-action">
        ${ads.modal.button}
      </button>

      <button class="btn gray full" id="ad-skip">
        Уже подписан
      </button>
    </div>
  `;

  const close = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    backdrop.remove();
  };

  // закрытие по фону
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  // основное действие
  backdrop.querySelector("#ad-action")!.addEventListener("click", () => {
    if (ads.modal.url) {
      window.open(ads.modal.url, "_blank");
    }
    close();
  });

  // мягкий отказ
  backdrop.querySelector("#ad-skip")!.addEventListener("click", () => {
    close();
  });

  document.body.appendChild(backdrop);
}
