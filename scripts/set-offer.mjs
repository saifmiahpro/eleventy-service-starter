import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const offer = process.argv[2];         // ex: premium

if (!offer || !["lite", "standard", "premium"].includes(offer)) {
  console.error("Usage: node scripts/set-offer.mjs <offer>");
  console.error("Offres: lite, standard, premium");
  process.exit(1);
}

const sitePath = join(__dirname, "../src/_data/site.json");

try {
  const site = JSON.parse(fs.readFileSync(sitePath, "utf8"));
  site.offer = offer;
  fs.writeFileSync(sitePath, JSON.stringify(site, null, 2));
  console.log(`✅ Offre changée → ${offer}`);
  
  const sections = site.sections[offer];
  console.log(`📋 Sections activées: ${sections.join(", ")}`);
} catch (error) {
  console.error("❌ Erreur:", error.message);
  process.exit(1);
}
