// ماژول مستقل بخش شبکه‌های اجتماعی
import { socialSearch } from "./shared-social.js";
export async function loadSocialSection(query, container) {
  container.replaceChildren();
  try {
    const results = await socialSearch(query);
    renderSocialResults(results, container);
    return results;
  } catch (error) {
    container.textContent = error.message || "دریافت نتایج اجتماعی ناموفق بود.";
    return [];
  }
}
function renderSocialResults(results, container) {
  if (!results.length) { container.textContent = "نتیجه‌ای از شبکه‌های اجتماعی پیدا نشد."; return; }
  for (const item of results.slice(0, 11)) {
    const card = document.createElement("article"); card.className = "result";
    const heading = document.createElement("h3"); const link = document.createElement("a");
    link.href = item.url || "#"; link.target = "_blank"; link.rel = "noopener noreferrer";
    link.textContent = item.title || item.url || "نتیجهٔ اجتماعی"; heading.append(link); card.append(heading);
    if (item.content) { const p = document.createElement("p"); p.textContent = item.content; card.append(p); }
    container.append(card);
  }
}
