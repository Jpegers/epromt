type Listener = () => void;

const STORAGE_KEY = "copyCooldownUntil";

let cooldownUntil = readFromStorage();
let timerId: number | null = null;
const listeners = new Set<Listener>();

function readFromStorage(): number {
  const raw = localStorage.getItem(STORAGE_KEY);
  const value = raw ? Number(raw) : 0;
  return Number.isFinite(value) ? value : 0;
}

function writeToStorage(ts: number) {
  if (ts > 0) {
    localStorage.setItem(STORAGE_KEY, String(ts));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function notify() {
  listeners.forEach((cb) => cb());
}

function ensureTimer() {
  if (timerId !== null) return;

  const tick = () => {
    if (Date.now() >= cooldownUntil) {
      cooldownUntil = 0;
      writeToStorage(0);
      clearTimer();
      notify();
      return;
    }

    notify();
    timerId = window.setTimeout(tick, 250);
  };

  timerId = window.setTimeout(tick, 250);
}

function clearTimer() {
  if (timerId !== null) {
    window.clearTimeout(timerId);
    timerId = null;
  }
}

/* ✅ ВАЖНО: восстановление таймера после reload */
if (Date.now() < cooldownUntil) {
  ensureTimer();
}

// ===== Public API =====

export function isCopyLocked(): boolean {
  return Date.now() < cooldownUntil;
}

export function getCopyRemainingMs(): number {
  if (!isCopyLocked()) return 0;
  return Math.max(0, cooldownUntil - Date.now());
}

export function startCopyCooldown(durationMs: number) {
  if (durationMs <= 0) return;

  const until = Date.now() + durationMs;

  if (until > cooldownUntil) {
    cooldownUntil = until;
    writeToStorage(cooldownUntil);
    ensureTimer();
    notify();
  }
}

export function subscribeCopyCooldown(cb: Listener): () => void {
  listeners.add(cb);
  cb();

  return () => {
    listeners.delete(cb);
  };
}
