// نسخهٔ کمکی مخصوص بخش ویژه؛ مستقل از سایر بخش‌ها
export const SPECIAL_API = "https://YOUR-SPECIAL-SERVICE.onrender.com/search";
export const SPECIAL_ENGINES = ["bing", "yandex"];
export const SPECIAL_SITES = ["wikipedia.org", "zoomit.ir", "iranintl.com", "radiofarda.com"];
export const SPECIAL_LIMIT = 11;

export async function specialSearch(query) {
  const q = String(query || "").trim();
  if (!q) return [];
  const batches = await Promise.all(SPECIAL_SITES.map(async domain => {
    const url = new URL(SPECIAL_API);
    url.searchParams.set("q", `site:${domain} ${q}`);
    url.searchParams.set("format", "json");
    url.searchParams.set("engines", SPECIAL_ENGINES.join(","));
    const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`بخش ویژه (${domain}): خطای HTTP ${response.status}`);
    const data = await response.json();
    return (Array.isArray(data.results) ? data.results : []).map(item => ({ ...item, sectionSource: domain }));
  }));
  // تکراری‌ها فقط داخل همین بخش حذف می‌شوند؛ با بخش‌های دیگر مقایسه نمی‌شوند.
  const seen = new Set();
  return batches.flat().filter(item => {
    const key = item.url || item.title;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, SPECIAL_LIMIT);
}
