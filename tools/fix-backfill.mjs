import { readFileSync, writeFileSync } from 'fs';

const content = readFileSync('tools/generate-from-config.js', 'utf8');

// Remplacer la fonction backfill pour utiliser les placeholders
const newContent = content.replace(
  /\/\/ Avis si activés[\s\S]*?site\.REVIEWS = site\.REVIEWS \|\| \[\];/,
  `// Avis si activés
  if (site.ENABLE_REVIEWS) {
    if (!Array.isArray(site.REVIEWS) || site.REVIEWS.length === 0) {
      site.REVIEWS = (ph.REVIEWS || []).slice(0, site._CAPS?.reviews || 99);
    } else {
      site.REVIEWS = site.REVIEWS.slice(0, site._CAPS?.reviews || 99);
    }
  } else {
    site.REVIEWS = site.REVIEWS || [];
  }`
);

writeFileSync('tools/generate-from-config.js', newContent);
console.log('✅ Fonction backfill corrigée pour utiliser ph.REVIEWS');
