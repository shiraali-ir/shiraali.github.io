// نسخهٔ کمکی مخصوص بخش اجتماعی؛ مستقل از سایر بخش‌ها
export const SOCIAL_API = "https://YOUR-SOCIAL-SERVICE.onrender.com/search";
export const SOCIAL_ENGINES = ["bing", "yandex", "duckduckgo"];
export const SOCIAL_SITES = ["facebook.com", "youtube.com", "linkedin.com", "x.com", "twitter.com", "instagram.com", "t.me", "telegram.me", "tiktok.com", "aparat.com"];
export const SOCIAL_LIMIT = 11;

export async function socialSearch(query) {
  const q = String(query || "").trim();
  if (!q) return [];
  const batches = await Promise.all(SOCIAL_SITES.map(async domain => {
    const url = new URL(SOCIAL_API);
    url.searchParams.set("q", `site:${domain} ${q}`);
    url.searchParams.set("format", "json");
    url.searchParams.set("engines", SOCIAL_ENGINES.join(","));
    const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`بخش اجتماعی (${domain}): خطای HTTP ${response.status}`);
    const data = await response.json();
    return (Array.isArray(data.results) ? data.results : []).map(item => ({ ...item, sectionSource: domain }));
  }));
  const seen = new Set();
  return batches.flat().filter(item => {
    const key = item.url || item.title;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, SOCIAL_LIMIT);
}
