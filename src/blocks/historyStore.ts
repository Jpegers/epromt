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

/**
 * Прочитать историю из localStorage
 */
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

/**
 * Сохранить историю в localStorage
 */
function saveHistory(list: HistoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/**
 * Добавить запись в историю
 * - не добавляет дубликат подряд (по en)
 * - хранит не более MAX_HISTORY записей
 */
export function addHistory(item: HistoryItem) {
  const history = getHistory();
  const last = history[0];

  // ❌ не добавляем одинаковый промпт подряд
  if (last && last.en === item.en) {
    return;
  }

  // добавляем в начало
  history.unshift(item);

  // ✂ ограничиваем размер
  if (history.length > MAX_HISTORY) {
    history.length = MAX_HISTORY;
  }

  saveHistory(history);
}

/**
 * Очистить историю (на будущее / настройки)
 */
export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
