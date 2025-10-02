#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

function main() {
  console.log('🔄 Restauration de la configuration par défaut\n');
  
  try {
    // Load default preset (serrurier)
    const presetPath = join(projectRoot, 'presets', 'serrurier', 'preset.json');
    if (!existsSync(presetPath)) {
      console.error('❌ Preset par défaut introuvable:', presetPath);
      process.exit(1);
    }
    
    const preset = JSON.parse(readFileSync(presetPath, 'utf8'));
    
    // Create default site.json
    const defaultConfig = {
      ...preset,
      BUSINESS_NAME: 'Mon Entreprise',
      CITY: 'Toulouse',
      PHONE_TEL: '+33612345678',
      PHONE_PRETTY: '06 12 34 56 78',
      EMAIL: 'contact@exemple.fr',
      ADDRESS: 'Toulouse, France',
      AREAS: ['Toulouse'],
      RESPONSE_TIME: '30-45 minutes',
      HERO_SUBTITLE: 'Intervention en 30-45 minutes',
      ABOUT_SNIPPET: 'Service professionnel à Toulouse. Intervention rapide et tarifs transparents.',
      CTA_PRIMARY_TEXT: 'Appeler maintenant',
      CTA_SECONDARY_TEXT: 'Devis gratuit',
      URGENCY_TEXT: '🚨 Service rapide et professionnel',
      TRUST_BADGES: ['Professionnel agréé', 'Devis gratuit', 'Paiement CB'],
      REVIEWS: [],
      GALLERY: [],
      PRICING: [],
      LOGO_URL: null,
      HERO_BACKGROUND_IMAGE: null,
      ENABLE_EMERGENCY_BANNER: true,
      ENABLE_GALLERY: false,
      ENABLE_REVIEWS: false,
      ENABLE_PRICING: false,
      ENABLE_SECTION_DESCRIPTIONS: false,
      ENABLE_ABOUT_EXTENDED: false,
      ENABLE_TRUST_SECTION: false,
      ENABLE_CERTIFICATIONS: false,
      CURRENCY: '€',
      MAPS_URL: 'https://maps.google.com/?q=Mon%20Entreprise%20Toulouse'
    };
    
    // Write to site.json
    const siteJsonPath = join(projectRoot, 'src', '_data', 'site.json');
    writeFileSync(siteJsonPath, JSON.stringify(defaultConfig, null, 2));
    
    console.log('✅ Configuration restaurée avec succès !');
    console.log('📋 Preset utilisé: Serrurier (par défaut)');
    console.log('🏢 Entreprise: Mon Entreprise');
    console.log('🏙️ Ville: Toulouse');
    console.log('🎨 Couleur: ' + defaultConfig.ACCENT);
    
    console.log('\n🚀 Prochaines étapes:');
    console.log('1. Placez votre fichier de configuration Tally dans /input/');
    console.log('2. Exécutez: npm run generate');
    console.log('3. Lancez: npm run dev');
    
  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
