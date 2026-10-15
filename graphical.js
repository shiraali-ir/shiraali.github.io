// بخش گرافیکی: ساعت محلی در مرورگر و آب‌وهوا از بک‌اند مستقل.
const GRAPHICAL_API = "https://YOUR-GRAPHICAL-SERVICE.onrender.com";
export function startLocalClock(container) {
  const update = () => { container.textContent = new Intl.DateTimeFormat("fa-IR", { dateStyle: "full", timeStyle: "medium" }).format(new Date()); };
  update();
  const timer = setInterval(update, 1000);
  return () => clearInterval(timer);
}
export async function loadWeatherByCity(city, container) {
  container.textContent = "در حال دریافت آب‌وهوا…";
  try {
    const url = new URL(`${GRAPHICAL_API}/weather`);
    url.searchParams.set("city", String(city || "Tehran").trim());
    url.searchParams.set("lang", "fa");
    const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`خطای HTTP ${response.status}`);
    const data = await response.json(); const c = data.weather?.current;
    if (!c) throw new Error("دادهٔ آب‌وهوا در دسترس نیست.");
    container.replaceChildren();
    const title = document.createElement("strong");
    title.textContent = `${data.place?.name || city}${data.place?.country ? `، ${data.place.country}` : ""}`;
    container.append(title);
    const rows = [["دما", `${c.temperature_2m}°C`], ["دمای محسوس", `${c.apparent_temperature}°C`], ["رطوبت", `${c.relative_humidity_2m}%`], ["باد", `${c.wind_speed_10m} km/h`], ["بارش", `${c.precipitation} mm`], ["زمان محلی", c.time || "—"]];
    for (const [label, value] of rows) { const p = document.createElement("p"); p.textContent = `${label}: ${value}`; container.append(p); }
  } catch (error) { container.textContent = `آب‌وهوا در دسترس نیست: ${error.message}`; }
}
