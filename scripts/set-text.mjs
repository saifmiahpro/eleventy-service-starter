import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const field = process.argv[2];         // ex: HERO_TEXT
const text = process.argv[3];          // ex: "Mon super titre"

if (!field || !text) {
  console.error("Usage: node scripts/set-text.mjs <champ> <texte>");
  console.error("Champs disponibles:");
  console.error("  HERO_TEXT        - Titre principal du héros");
  console.error("  HERO_SUBTITLE    - Sous-titre du héros");
  console.error("  ABOUT_SNIPPET    - Description courte");
  console.error("  BUSINESS_NAME    - Nom de l'entreprise");
  console.error("  URGENCY_TEXT     - Texte bandeau d'urgence");
  console.error("");
  console.error("Exemples:");
  console.error('  node scripts/set-text.mjs HERO_TEXT "🔧 Dépannage Express 24/7"');
  console.error('  node scripts/set-text.mjs BUSINESS_NAME "AutoSecours Pro"');
  process.exit(1);
}

const validFields = [
  "HERO_TEXT", "HERO_SUBTITLE", "ABOUT_SNIPPET", 
  "BUSINESS_NAME", "URGENCY_TEXT", "CTA_PRIMARY_TEXT", "CTA_SECONDARY_TEXT"
];

if (!validFields.includes(field)) {
  console.error(`❌ Champ invalide: ${field}`);
  console.error(`Champs valides: ${validFields.join(", ")}`);
  process.exit(1);
}

const identityPath = join(__dirname, "../src/_data/identity.json");

try {
  const identity = JSON.parse(fs.readFileSync(identityPath, "utf8"));
  identity[field] = text;
  fs.writeFileSync(identityPath, JSON.stringify(identity, null, 2));
  
  console.log(`✅ ${field} mis à jour`);
  console.log(`📝 Nouveau texte: "${text}"`);
  console.log(`🔄 Rechargez la page pour voir le changement`);
} catch (error) {
  console.error("❌ Erreur:", error.message);
  process.exit(1);
}
