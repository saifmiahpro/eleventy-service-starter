import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const layout = process.argv[2]; // grid, carousel, list
const availableLayouts = ["grid", "carousel", "list"];

if (!layout || !availableLayouts.includes(layout)) {
  console.error("Usage: node scripts/set-services-layout.mjs <layout>");
  console.error("Layouts disponibles:", availableLayouts.join(", "));
  console.error("");
  console.error("📋 Descriptions des layouts:");
  console.error("  • grid     - Grille de cartes (défaut, responsive)");
  console.error("  • carousel - Défilement horizontal (mobile-friendly)");
  console.error("  • list     - Liste verticale simple");
  process.exit(1);
}

const sitePath = join(__dirname, "../src/_data/site.json");

try {
  const site = JSON.parse(fs.readFileSync(sitePath, "utf8"));
  
  // Initialiser variants si inexistant
  if (!site.variants) {
    site.variants = {};
  }
  
  // Mettre à jour le layout services
  site.variants.services = layout;
  
  fs.writeFileSync(sitePath, JSON.stringify(site, null, 2));
  
  console.log(`✅ Layout services changé → ${layout}`);
  console.log(`🎨 Rechargez la page pour voir le changement`);
  
  // Afficher la description du layout choisi
  const descriptions = {
    grid: "Grille de cartes responsive - idéal pour 2-6 services",
    carousel: "Défilement horizontal - parfait pour mobile",
    list: "Liste verticale simple - pour beaucoup de services"
  };
  
  console.log(`📋 ${descriptions[layout]}`);
  
} catch (error) {
  console.error("❌ Erreur:", error.message);
  process.exit(1);
}
