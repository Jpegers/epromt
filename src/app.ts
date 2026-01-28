// ===== Types =====

type Screen =
  | { name: "instruction" }
  | { name: "menu" }
  | { name: "build"; mode: "photo" | "video" }
  | { name: "templates"; mode: "photo" | "video" }
  | { name: "template"; id: string; mode: "photo" | "video" }
  | { name: "history" }
  | { name: "contacts" }
  | { name: "privacy" };

// ===== Screens =====

import { renderInstruction } from "./screens/instruction";
import { renderMenu } from "./screens/menu";
import { renderBuild } from "./screens/build";
import { renderTemplates } from "./screens/templates";
import { renderTemplate } from "./screens/template";
import { renderContacts } from "./screens/contacts";
import { renderPrivacy } from "./screens/privacy";
import { renderHistory } from "./screens/history";

// ===== Root =====

const root = document.getElementById("app");
if (!root) {
  throw new Error("#app not found");
}

// ===== Navigation state =====

let current: Screen;
const stack: Screen[] = [];

// ===== Navigation API =====

function navigate(next: Screen) {
  if (current) {
    stack.push(current);
  }
  current = next;
  render();
}

function back() {
  const prev = stack.pop();
  if (!prev) return;
  current = prev;
  render();
}

// ===== Render =====

function render() {
  root!.className = current.name;
  root!.innerHTML = "";

  console.log("RENDER CURRENT:", current);

  switch (current.name) {
    case "instruction":
      renderInstruction();
      break;

    case "menu":
      renderMenu(root!, navigate);
      break;

    case "build":
      renderBuild(root!, navigate, back, current.mode);
      break;

    case "templates":
      renderTemplates(root!, navigate, back, current.mode);
      break;

    case "template":
      renderTemplate(
        root!,
        navigate,
        back,
        current.id,
        current.mode
      );
      break;

    case "contacts":
      renderContacts(root!, navigate, back);
      break;

    case "privacy":
      renderPrivacy(root!, navigate, back);
      break;

    case "history":
      renderHistory(root!, navigate, back);
      break;
  }
}

// ===== App start =====

async function preloadOnboarding() {
  try {
    const mod = await import("./data/onboarding");
    const slides = mod.ONBOARDING_SLIDES || [];
    await Promise.all(slides.map(s => new Promise(res => {
      const img = new Image();
      img.onload = img.onerror = () => res(true);
      img.src = s.image;
    })));
  } catch {}
}

function showGlobalLoader() {
  const el = document.createElement("div");
  el.className = "logo-loader";
  el.id = "global-loader";
  document.body.appendChild(el);
}

function hideGlobalLoader() {
  document.getElementById("global-loader")?.remove();
}

export async function startApp() {
  showGlobalLoader();
  await preloadOnboarding();
  hideGlobalLoader();

  const seen = localStorage.getItem("onboarding_seen");

  current = seen ? { name: "menu" } : { name: "instruction" };

  render();
}
