import ads from "../data/ads.json";

const ONE_HOUR = 60 * 60 * 1000;
const ONE_MINUTE = 1 * 1000;
const AD_COOLDOWN_MS = ONE_MINUTE;
const AD_SKIP_DELAY_MS = 6_000; // 6 секунд
const STORAGE_KEY = "last_ad_shown";

export function showAdModal() {
  if (!ads.modal?.enabled) return;

  // защита от повторного открытия в DOM
  if (document.querySelector(".modal-backdrop")) return;

  const lastShown = Number(localStorage.getItem(STORAGE_KEY) || 0);
  const now = Date.now();

  if (now - lastShown < AD_COOLDOWN_MS) return;

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  backdrop.innerHTML = `
    <div class="modal">
      <h3>${ads.modal.title}</h3>
      <p>${ads.modal.text}</p>

      <button class="btn green full" id="ad-action">
        ${ads.modal.button}
      </button>

      <button class="btn gray full" id="ad-skip" disabled>
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
  backdrop.querySelector<HTMLButtonElement>("#ad-action")!
    .addEventListener("click", () => {
      if (ads.modal.url) {
        window.open(ads.modal.url, "_blank");
      }
      close();
    });

  const skipButton =
    backdrop.querySelector<HTMLButtonElement>("#ad-skip")!;

  // ===== визуальный таймер, как у "Скопировано" =====
  const start = performance.now();
skipButton.style.setProperty("--progress", "0");

const animate = (now: number) => {
    const progress = Math.min((now - start) / AD_SKIP_DELAY_MS, 1);

    skipButton.style.setProperty("--progress", String(progress));

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      skipButton.disabled = false;
    }
  };

  requestAnimationFrame(animate);


  skipButton.addEventListener("click", close);

  document.body.appendChild(backdrop);
}
