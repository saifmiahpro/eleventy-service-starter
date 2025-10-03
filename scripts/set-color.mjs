import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const color = process.argv[2];         // ex: #e74c3c

if (!color) {
  console.error("Usage: node scripts/set-color.mjs <couleur>");
  console.error("Exemples:");
  console.error("  node scripts/set-color.mjs #e74c3c    (rouge)");
  console.error("  node scripts/set-color.mjs #f39c12    (orange)");
  console.error("  node scripts/set-color.mjs #1e90ff    (bleu)");
  console.error("  node scripts/set-color.mjs #27ae60    (vert)");
  process.exit(1);
}

// Valider le format couleur
if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
  console.error("❌ Format couleur invalide. Utilisez le format #RRGGBB (ex: #e74c3c)");
  process.exit(1);
}

const identityPath = join(__dirname, "../src/_data/identity.json");

try {
  const identity = JSON.parse(fs.readFileSync(identityPath, "utf8"));
  identity.ACCENT_COLOR = color;
  fs.writeFileSync(identityPath, JSON.stringify(identity, null, 2));
  console.log(`✅ Couleur d'accent changée → ${color}`);
  console.log(`🎨 Rechargez la page pour voir le changement`);
} catch (error) {
  console.error("❌ Erreur:", error.message);
  process.exit(1);
}
