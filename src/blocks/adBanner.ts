import ads from "../data/ads.json";

export function renderAdBanner(root: HTMLElement) {
  const banner = ads.banner;
  if (!banner?.enabled || !banner.url) return;

  const el = document.createElement("a");
  el.className = "card ad";
  el.href = banner.url;
  el.target = "_blank";
  el.rel = "noopener noreferrer";

  // ===== Media (background) =====
  if (banner.media?.type === "image" && banner.media.src) {
    const media = document.createElement("div");
    media.className = "ad-media";
    media.style.backgroundImage = `url(${banner.media.src})`;
    el.appendChild(media);
  }

  // ===== Overlay text =====
  if (banner.text) {
    const overlay = document.createElement("div");
    overlay.className = "ad-overlay";

    const p = document.createElement("p");
    p.textContent = banner.text;

    overlay.appendChild(p);
    el.appendChild(overlay);
  }

  root.appendChild(el);
}
