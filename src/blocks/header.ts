export function renderHeader(
  title: string,
  onBack?: () => void
): HTMLElement {
  const header = document.createElement("header");
  header.className = "app-header";

  const inner = document.createElement("div");
  inner.className = "app-header-inner";

  if (onBack) {
    const backBtn = document.createElement("button");
    backBtn.className = "back-button";
    backBtn.innerHTML = "←";
    backBtn.addEventListener("click", onBack);
    inner.appendChild(backBtn);
  }

  const titleEl = document.createElement("div");
  titleEl.className = "header-title";
  titleEl.textContent = title;

  inner.appendChild(titleEl);
  header.appendChild(inner);

  return header;
}
