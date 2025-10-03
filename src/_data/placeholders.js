import fs from "fs";
import path from "path";

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function injectCity(str, city) {
  return (str || "").replaceAll("{{CITY}}", city || "");
}

export function getPlaceholders(niche = "serrurier", city = "") {
  const base = path.join(process.cwd(), "presets");
  const file = {
    serrurier: path.join(base, "serrurier.json"),
    depanneur: path.join(base, "depanneur.json"),
    electricien: path.join(base, "electricien.json")
  }[niche] || path.join(base, "serrurier.json");

  const preset = readJSON(file);

  // Inject CITY in hero
  preset.HERO_TITLE = injectCity(preset.HERO_TITLE, city);

  // Default placeholder hero per niche (if none provided later)
  preset.HERO_BG_URL = {
    serrurier: "/assets/placeholders/hero-serrurier.jpg",
    depanneur: "/assets/placeholders/hero-depanneur.jpg",
    electricien: "/assets/placeholders/hero-electricien.jpg"
  }[niche];

  // Logo placeholder
  preset.LOGO_FALLBACK = "/assets/placeholders/logo-placeholder.svg";

  return preset;
}
