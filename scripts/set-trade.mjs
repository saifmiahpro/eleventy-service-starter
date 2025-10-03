import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const trade = process.argv[2];         // ex: serrurier

if (!trade || !["depanneur", "serrurier", "electricien"].includes(trade)) {
  console.error("Usage: node scripts/set-trade.mjs <métier>");
  console.error("Métiers disponibles:");
  console.error("  depanneur   - 🚛 Dépannage auto (rouge)");
  console.error("  serrurier   - 🔐 Serrurerie (gris foncé)");
  console.error("  electricien - ⚡ Électricité (bleu)");
  process.exit(1);
}

const identityPath = join(__dirname, "../src/_data/identity.json");
const sitePath = join(__dirname, "../src/_data/site.json");

try {
  // Mettre à jour identity.json
  const identity = JSON.parse(fs.readFileSync(identityPath, "utf8"));
  
  // Réinitialiser les données personnalisées pour utiliser les placeholders
  identity.TRADE = trade;
  identity.HERO_TEXT = null;
  identity.HERO_SUBTITLE = null;
  identity.ABOUT_SNIPPET = null;
  identity.ACCENT_COLOR = null;
  identity.URGENCY_TEXT = null;  // ← IMPORTANT : réinitialiser le texte d'urgence
  
  fs.writeFileSync(identityPath, JSON.stringify(identity, null, 2));
  
  // Mettre à jour site.json
  const site = JSON.parse(fs.readFileSync(sitePath, "utf8"));
  site.trade = trade;
  fs.writeFileSync(sitePath, JSON.stringify(site, null, 2));
  
  console.log(`✅ Métier changé → ${trade}`);
  console.log(`🎨 Placeholders et couleurs automatiquement appliqués`);
  console.log(`🔄 Rechargez la page pour voir les changements`);
  
  // Afficher un aperçu des changements
  const tradesPath = join(__dirname, "../src/_data/trades.json");
  const trades = JSON.parse(fs.readFileSync(tradesPath, "utf8"));
  const tradeData = trades[trade];
  
  console.log(`\n📋 Aperçu des changements:`);
  console.log(`• Titre héros: ${tradeData.HERO_TITLE}`);
  console.log(`• Couleur: ${tradeData.ACCENT}`);
  console.log(`• Services: ${tradeData.services.length} services`);
  console.log(`• Avis: ${tradeData.reviews.length} avis clients`);
  
} catch (error) {
  console.error("❌ Erreur:", error.message);
  process.exit(1);
}
