// گالری مستقل تصاویر؛ نتایج از بک‌اند اختصاصی تصاویر دریافت می‌شوند.
const IMAGE_API = "https://YOUR-IMAGES-SERVICE.onrender.com/search";
const IMAGE_LIMIT = 11;
export async function loadImageSection(query, image, previousButton, nextButton, status) {
  status.textContent = "در حال دریافت تصاویر…";
  image.removeAttribute("src"); image.alt = "";
  previousButton.hidden = true; nextButton.hidden = true;
  try {
    const url = new URL(IMAGE_API);
    url.searchParams.set("q", String(query).trim());
    url.searchParams.set("format", "json");
    url.searchParams.set("categories", "images");
    const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`خطای HTTP ${response.status}`);
    const data = await response.json();
    const images = (Array.isArray(data.results) ? data.results : []).map(item => ({
      title: item.title || item.content || item.url || "تصویر مرتبط",
      src: item.img_src || item.thumbnail || item.thumbnail_src || "",
      url: item.url || ""
    })).filter(item => item.src).slice(0, IMAGE_LIMIT);
    if (!images.length) { status.textContent = "تصویر قابل‌نمایشی پیدا نشد."; return []; }
    let index = 0;
    const show = () => {
      image.src = images[index].src;
      image.alt = images[index].title;
      if (images[index].url) image.onclick = () => window.open(images[index].url, "_blank", "noopener,noreferrer");
      previousButton.hidden = images.length < 2; nextButton.hidden = images.length < 2;
      status.textContent = `تصویر ${index + 1} از ${images.length}`;
    };
    previousButton.onclick = () => { index = (index - 1 + images.length) % images.length; show(); };
    nextButton.onclick = () => { index = (index + 1) % images.length; show(); };
    show();
    return images;
  } catch (error) { status.textContent = `گرفتن تصاویر ناموفق بود: ${error.message}`; return []; }
}
