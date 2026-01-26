import { ONBOARDING_SLIDES } from "../data/onboarding";

let currentIndex = 0;

function setSeen() {
  localStorage.setItem("onboarding_seen", "true");
}

/* ===== Navigation ===== */

function next() {
  if (currentIndex < ONBOARDING_SLIDES.length - 1) {
    animate("left", () => {
      currentIndex++;
      render();
    });
    return;
  }

  setSeen();
  window.location.reload();
}

function back() {
  if (currentIndex === 0) return;

  animate("right", () => {
    currentIndex--;
    render();
  });
}

function skip() {
  setSeen();
  window.location.reload();
}

/* ===== Animation ===== */

function animate(direction: "left" | "right", cb: () => void) {
  const content = document.querySelector(".onboarding-content");
  if (!content) {
    cb();
    return;
  }

  content.classList.add(direction === "left" ? "exit-left" : "exit-right");
  setTimeout(cb, 180);
}

/* ===== Dots ===== */

function renderDots() {
  return `
    <div class="onboarding-dots">
      ${ONBOARDING_SLIDES.map(
        (_, i) =>
          `<span class="dot ${i === currentIndex ? "active" : ""}"></span>`
      ).join("")}
    </div>
  `;
}

/* ===== Entry ===== */

export function renderInstruction() {
  currentIndex = 0;
  render();
}

/* ===== Render ===== */

function render() {
  const slide = ONBOARDING_SLIDES[currentIndex];
  const root = document.getElementById("app");
  if (!root) return;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === ONBOARDING_SLIDES.length - 1;

  root.className = "instruction";

  root.innerHTML = `
    <div class="instruction-inner">
      <div class="onboarding">

        <div class="onboarding-content enter">
          <!-- зоны клика как сторис (ТОЛЬКО в контенте, не в футере) -->
          <div class="onboarding-tap left" id="tapLeft" aria-hidden="true"></div>
          <div class="onboarding-tap right" id="tapRight" aria-hidden="true"></div>

          <div class="onboarding-image">
            <img src="${slide.image}" alt="${slide.title}" />
          </div>

          <div class="onboarding-text">
            <h2>${slide.title}</h2>
            <p>${slide.text.replace(/\n/g, "<br />")}</p>
          </div>
        </div>

        <div class="onboarding-footer">
          ${renderDots()}

          <div class="onboarding-actions two">
            <button class="ghost btn" id="leftBtn">
              ${isFirst ? "Пропустить" : "Назад"}
            </button>

            <button class="primary btn" id="rightBtn">
              ${isLast ? "Начать" : "Далее"}
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  /* ===== Buttons ===== */

  document
    .getElementById("leftBtn")
    ?.addEventListener("click", isFirst ? skip : back);

  document
    .getElementById("rightBtn")
    ?.addEventListener("click", next);

  /* ===== Story-style tap zones ===== */

  document.getElementById("tapLeft")?.addEventListener("click", () => {
    if (isFirst) {
      skip(); // на 1-м слева = "пропустить"
      return;
    }
    back();
  });

  document.getElementById("tapRight")?.addEventListener("click", () => {
    next();
  });
}
