// ماژول مستقل بخش ویژه
import { specialSearch } from "./shared-special.js";
export async function loadSpecialSection(query, container) {
  container.replaceChildren();
  try {
    const results = await specialSearch(query);
    renderSpecialResults(results, container);
    return results;
  } catch (error) {
    container.textContent = error.message || "دریافت نتایج ویژه ناموفق بود.";
    return [];
  }
}
function renderSpecialResults(results, container) {
  if (!results.length) { container.textContent = "نتیجه‌ای از سایت‌های ویژه پیدا نشد."; return; }
  for (const item of results.slice(0, 11)) {
    const card = document.createElement("article"); card.className = "result";
    const heading = document.createElement("h3"); const link = document.createElement("a");
    link.href = item.url || "#"; link.target = "_blank"; link.rel = "noopener noreferrer";
    link.textContent = item.title || item.url || "نتیجهٔ ویژه"; heading.append(link); card.append(heading);
    if (item.content) { const p = document.createElement("p"); p.textContent = item.content; card.append(p); }
    container.append(card);
  }
}
