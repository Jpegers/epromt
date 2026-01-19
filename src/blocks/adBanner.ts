import ads from "../data/ads.json";

export function renderAdBanner(root: HTMLElement) {
  if (!ads.banner?.enabled) return;

  const el = document.createElement("section");
  el.className = "card ad";
  el.innerHTML = `<p>${ads.banner.text}</p>`;
  root.appendChild(el);
}
