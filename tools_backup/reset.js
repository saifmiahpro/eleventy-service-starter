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
    const defaultSiteConfig = {
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
    
    // Create default input config (sample template)
    const defaultInputConfig = {
      business_name: "Serrurerie Express 31",
      business_type: "serrurier",
      city: "Toulouse",
      phone: "0612345678",
      email: "contact@exemple.fr",
      address: "12 rue de la République, 31000 Toulouse",
      service_areas: "Toulouse, Blagnac, Colomiers",
      availability: "24/7",
      response_time: "20-30 minutes",
      accent_color: "#fd7e14",
      hero_title: "Serrurier 24/7 à Toulouse — Ouverture Sans Casse",
      hero_subtitle: "Intervention rapide en 20-30 minutes",
      description: "Service professionnel de serrurerie à Toulouse. Intervention rapide et tarifs transparents.",
      cta_primary: "Appeler maintenant",
      cta_secondary: "Devis gratuit",
      urgency_banner: "🚨 Intervention rapide 24/7",
      trust_badges: "Professionnel agréé, Devis gratuit, Paiement CB, Disponible 24/7",
      enable_gallery: "false",
      enable_reviews: "false",
      enable_pricing: "false",
      enable_emergency_banner: "true",
      enable_section_descriptions: "false",
      enable_about_extended: "false",
      enable_trust_section: "false",
      enable_certifications: "false"
    };
    
    // Write to site.json
    const siteJsonPath = join(projectRoot, 'src', '_data', 'site.json');
    writeFileSync(siteJsonPath, JSON.stringify(defaultSiteConfig, null, 2));
    
    // Reset input config to sample
    const inputConfigPath = join(projectRoot, 'input', 'site-config.json');
    writeFileSync(inputConfigPath, JSON.stringify(defaultInputConfig, null, 2));
    
    console.log('✅ Configuration restaurée avec succès !');
    console.log('📋 src/_data/site.json → Valeurs par défaut');
    console.log('📋 input/site-config.json → Template exemple');
    console.log('🏢 Entreprise: Mon Entreprise');
    console.log('🏙️ Ville: Toulouse');
    console.log('🎨 Couleur: ' + defaultSiteConfig.ACCENT);
    
    console.log('\n📁 Assets clients préservés (non supprimés)');
    console.log('   → assets/clients/ reste intact');
    
    console.log('\n🚀 Prochaines étapes:');
    console.log('1. Option A: npm run tally:pull -- --id=SUBMISSION_ID [--download]');
    console.log('2. Option B: Modifiez input/site-config.json manuellement');
    console.log('3. Puis: npm run generate');
    console.log('4. Enfin: npm run dev');
    
  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
