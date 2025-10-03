import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colorName = process.argv[2];         // ex: "bleu"

// Mapping couleurs texte → hex (comme Tally)
const colorMap = {
  "rouge": "#e74c3c",
  "bleu": "#3498db", 
  "vert": "#27ae60",
  "orange": "#f39c12",
  "violet": "#9b59b6",
  "gris": "#2c3e50",
  "noir": "#2c3e50",
  "rose": "#e91e63",
  "jaune": "#f1c40f",
  "turquoise": "#1abc9c"
};

if (!colorName || !colorMap[colorName.toLowerCase()]) {
  console.error("Usage: node scripts/set-color-name.mjs <couleur>");
  console.error("Couleurs disponibles:");
  Object.keys(colorMap).forEach(color => {
    console.error(`  ${color.padEnd(10)} → ${colorMap[color]}`);
  });
  process.exit(1);
}

const color = colorMap[colorName.toLowerCase()];
const identityPath = join(__dirname, "../src/_data/identity.json");

try {
  const identity = JSON.parse(fs.readFileSync(identityPath, "utf8"));
  identity.ACCENT_COLOR = color;
  fs.writeFileSync(identityPath, JSON.stringify(identity, null, 2));
  
  console.log(`✅ Couleur "${colorName}" appliquée → ${color}`);
  console.log(`🎨 Rechargez la page pour voir le changement`);
} catch (error) {
  console.error("❌ Erreur:", error.message);
  process.exit(1);
}
