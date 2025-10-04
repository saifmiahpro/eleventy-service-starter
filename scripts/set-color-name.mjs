import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colorName = process.argv[2];         // ex: rouge

// Charger les couleurs depuis colors.json
const colorsPath = join(__dirname, "../src/_data/colors.json");
const COLORS = JSON.parse(fs.readFileSync(colorsPath, "utf8"));

if (!colorName || !COLORS[colorName]) {
  console.error("Usage: node scripts/set-color-name.mjs <couleur>");
  console.error("Couleurs disponibles:", Object.keys(COLORS).join(", "));
  process.exit(1);
}

const colorData = COLORS[colorName];
const identityPath = join(__dirname, "../src/_data/identity.json");

try {
  const identity = JSON.parse(fs.readFileSync(identityPath, "utf8"));
  identity.ACCENT_COLOR = colorData.primary;
  identity.ACCENT_GRADIENT = colorData.gradient;
  fs.writeFileSync(identityPath, JSON.stringify(identity, null, 2));
  
  console.log(`✅ Couleur "${colorName}" appliquée → ${colorData.primary}`);
  console.log(`🎨 Gradient: ${colorData.gradient}`);
  console.log(`🔄 Rechargez la page pour voir le changement`);
} catch (error) {
  console.error("❌ Erreur:", error.message);
  process.exit(1);
}
