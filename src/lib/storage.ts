export function loadSaved<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem("ala-demo-" + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
