import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const section = process.argv[2];         // ex: services
const variant = process.argv[3];         // ex: carousel

if (!section || !variant) {
  console.error("Usage: node scripts/set-variant.mjs <section> <variant>");
  console.error("Sections: services, reviews, gallery, pricing, certifications, faq, contact");
  console.error("Variantes: grid, carousel, list, cards, mosaic, badges, accordion, left-form");
  process.exit(1);
}

const sitePath = join(__dirname, "../src/_data/site.json");

try {
  const site = JSON.parse(fs.readFileSync(sitePath, "utf8"));
  site.variants = site.variants || {};
  site.variants[section] = variant;
  fs.writeFileSync(sitePath, JSON.stringify(site, null, 2));
  console.log(`✅ ${section} → ${variant}`);
} catch (error) {
  console.error("❌ Erreur:", error.message);
  process.exit(1);
}
