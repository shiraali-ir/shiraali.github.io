// نسخهٔ کمکی مخصوص بخش عمومی؛ مستقل از سایر بخش‌ها
export const GENERAL_API = "https://YOUR-GENERAL-SERVICE.onrender.com/search";
export const GENERAL_ENGINES = ["bing", "yandex", "duckduckgo", "google", "brave", "startpage"];
export const GENERAL_LIMIT = 11;

export async function generalSearch(query) {
  const q = String(query || "").trim();
  if (!q) return [];
  const url = new URL(GENERAL_API);
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("engines", GENERAL_ENGINES.join(","));
  const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error(`جست‌وجوی عمومی: خطای HTTP ${response.status}`);
  const data = await response.json();
  return (Array.isArray(data.results) ? data.results : []).slice(0, GENERAL_LIMIT);
}
