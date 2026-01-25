export type HistorySource = "build" | "template";

export type HistoryItem = {
  source: HistorySource;
  ru: string;
  en: string;
  date: number;
  title?: string;
};

const STORAGE_KEY = "history";
const MAX_HISTORY = 200;

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(list: HistoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addHistory(item: HistoryItem) {
  const history = getHistory();
  const last = history[0];

  if (last && last.en === item.en) {
    return;
  }

  history.unshift(item);

  if (history.length > MAX_HISTORY) {
    history.length = MAX_HISTORY;
  }

  saveHistory(history);
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
