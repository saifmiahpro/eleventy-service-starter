#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Offer configurations
const OFFERS = {
  lite: {
    name: 'LITE',
    price: 299,
    features: {
      ENABLE_EMERGENCY_BANNER: false,
      ENABLE_GALLERY: false,
      ENABLE_REVIEWS: false,
      ENABLE_PRICING: false,
      ENABLE_SECTION_DESCRIPTIONS: false,
      ENABLE_ABOUT_EXTENDED: false,
      ENABLE_TRUST_SECTION: false,
      ENABLE_CERTIFICATIONS: false
    },
    description: 'Site essentiel - Hero, Services, Zones, FAQ, Contact'
  },
  standard: {
    name: 'STANDARD',
    price: 499,
    features: {
      ENABLE_EMERGENCY_BANNER: true,
      ENABLE_GALLERY: true,
      ENABLE_REVIEWS: true,
      ENABLE_PRICING: false,
      ENABLE_SECTION_DESCRIPTIONS: true,
      ENABLE_ABOUT_EXTENDED: false,
      ENABLE_TRUST_SECTION: false,
      ENABLE_CERTIFICATIONS: false
    },
    description: 'Site professionnel - LITE + Galerie, Avis, Bandeau urgence, Descriptions'
  },
  premium: {
    name: 'PREMIUM',
    price: 799,
    features: {
      ENABLE_EMERGENCY_BANNER: true,
      ENABLE_GALLERY: true,
      ENABLE_REVIEWS: true,
      ENABLE_PRICING: true,
      ENABLE_SECTION_DESCRIPTIONS: true,
      ENABLE_ABOUT_EXTENDED: true,
      ENABLE_TRUST_SECTION: true,
      ENABLE_CERTIFICATIONS: true
    },
    description: 'Site complet - STANDARD + Tarifs, Garanties, À propos étendu, Certifications'
  }
};

function applyOfferToConfig(baseConfig, offerKey) {
  const offer = OFFERS[offerKey];
  const config = JSON.parse(JSON.stringify(baseConfig)); // Deep copy
  
  // Apply offer features
  for (const [key, value] of Object.entries(offer.features)) {
    config[key] = value;
  }
  
  // Clear data for disabled modules
  if (!offer.features.ENABLE_REVIEWS) {
    config.REVIEWS = [];
  }
  if (!offer.features.ENABLE_PRICING) {
    config.PRICING = [];
  }
  if (!offer.features.ENABLE_GALLERY) {
    config.GALLERY = [];
  }
  
  return config;
}

async function main() {
  console.log('🎯 Génération des 3 offres commerciales\n');
  
  try {
    // Check if input config exists
    const inputConfigPath = join(projectRoot, 'input', 'site-config.json');
    if (!existsSync(inputConfigPath)) {
      console.error('❌ Aucune configuration trouvée dans input/site-config.json');
      console.log('💡 Exécutez d\'abord: npm run tally:pull -- --id=SUBMISSION_ID');
      process.exit(1);
    }
    
    // Read input config
    const inputConfig = JSON.parse(readFileSync(inputConfigPath, 'utf8'));
    console.log(`📄 Configuration chargée: ${inputConfig.business_name || 'Client'}\n`);
    
    // Generate site config from input (using generate-from-config.js logic)
    console.log('🔧 Génération de la configuration de base...');
    execSync('npm run generate', { 
      cwd: projectRoot, 
      stdio: 'inherit' 
    });
    
    // Read generated site.json as base
    const siteJsonPath = join(projectRoot, 'src', '_data', 'site.json');
    const baseConfig = JSON.parse(readFileSync(siteJsonPath, 'utf8'));
    
    // Create offers directory
    const offersDir = join(projectRoot, 'offers');
    if (!existsSync(offersDir)) {
      mkdirSync(offersDir, { recursive: true });
    }
    
    // Generate each offer
    const results = [];
    for (const [key, offer] of Object.entries(OFFERS)) {
      console.log(`\n📦 Génération offre ${offer.name} (${offer.price}€)`);
      console.log(`   ${offer.description}`);
      
      // Apply offer configuration
      const offerConfig = applyOfferToConfig(baseConfig, key);
      
      // Save to offers directory
      const offerPath = join(offersDir, `${key}-site.json`);
      writeFileSync(offerPath, JSON.stringify(offerConfig, null, 2));
      
      // Count enabled features
      const enabledFeatures = Object.values(offer.features).filter(v => v === true).length;
      
      results.push({
        key,
        name: offer.name,
        price: offer.price,
        file: offerPath,
        features: enabledFeatures
      });
      
      console.log(`   ✅ Sauvegardé: offers/${key}-site.json`);
      console.log(`   🎯 Modules activés: ${enabledFeatures}/8`);
    }
    
    // Generate comparison summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 RÉCAPITULATIF DES OFFRES');
    console.log('='.repeat(70));
    
    for (const result of results) {
      console.log(`\n${result.name.padEnd(10)} | ${result.price}€`.padEnd(20) + `| ${result.features}/8 modules`);
      console.log(`   📁 ${result.file.replace(projectRoot + '/', '')}`);
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('\n🎯 UTILISATION:\n');
    console.log('Pour tester une offre:');
    console.log('  cp offers/lite-site.json src/_data/site.json && npm run dev');
    console.log('  cp offers/standard-site.json src/_data/site.json && npm run dev');
    console.log('  cp offers/premium-site.json src/_data/site.json && npm run dev');
    
    console.log('\n📧 Envoyez les 3 previews au client pour qu\'il choisisse son offre !');
    
    // Create comparison HTML for client
    createComparisonHTML(results, baseConfig.BUSINESS_NAME || 'Client');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    process.exit(1);
  }
}

function createComparisonHTML(results, businessName) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comparatif Offres - ${businessName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      min-height: 100vh;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { 
      color: white; 
      text-align: center; 
      margin-bottom: 40px;
      font-size: 2.5rem;
    }
    .offers { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }
    .offer {
      background: white;
      border-radius: 20px;
      padding: 40px 30px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .offer:hover {
      transform: translateY(-10px);
      box-shadow: 0 30px 80px rgba(0,0,0,0.4);
    }
    .offer.recommended {
      border: 3px solid #f39c12;
      transform: scale(1.05);
    }
    .badge {
      background: #f39c12;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
      display: inline-block;
      margin-bottom: 20px;
    }
    .offer-name {
      font-size: 1.8rem;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 10px;
    }
    .offer-price {
      font-size: 3rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 20px;
    }
    .offer-price span {
      font-size: 1.2rem;
      color: #7f8c8d;
    }
    .offer-desc {
      color: #7f8c8d;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    .features {
      list-style: none;
      margin-bottom: 30px;
    }
    .features li {
      padding: 10px 0;
      border-bottom: 1px solid #ecf0f1;
      color: #2c3e50;
    }
    .features li:before {
      content: "✓ ";
      color: #27ae60;
      font-weight: bold;
      margin-right: 10px;
    }
    .features li.disabled {
      color: #bdc3c7;
      text-decoration: line-through;
    }
    .features li.disabled:before {
      content: "✗ ";
      color: #e74c3c;
    }
    .cta {
      display: block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 15px 30px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: bold;
      transition: transform 0.2s;
    }
    .cta:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎯 Choisissez votre offre - ${businessName}</h1>
    <div class="offers">
      ${results.map((offer, index) => `
        <div class="offer ${index === 1 ? 'recommended' : ''}">
          ${index === 1 ? '<div class="badge">RECOMMANDÉ</div>' : ''}
          <div class="offer-name">${offer.name}</div>
          <div class="offer-price">${offer.price}€ <span>TTC</span></div>
          <div class="offer-desc">${OFFERS[offer.key].description}</div>
          <ul class="features">
            <li>✓ Hero Section</li>
            <li>✓ Services</li>
            <li>✓ Zones d'intervention</li>
            <li>✓ FAQ</li>
            <li>✓ Contact</li>
            <li ${OFFERS[offer.key].features.ENABLE_EMERGENCY_BANNER ? '' : 'class="disabled"'}>Bandeau urgence animé</li>
            <li ${OFFERS[offer.key].features.ENABLE_GALLERY ? '' : 'class="disabled"'}>Galerie photos</li>
            <li ${OFFERS[offer.key].features.ENABLE_REVIEWS ? '' : 'class="disabled"'}>Avis clients</li>
            <li ${OFFERS[offer.key].features.ENABLE_SECTION_DESCRIPTIONS ? '' : 'class="disabled"'}>Descriptions sections</li>
            <li ${OFFERS[offer.key].features.ENABLE_PRICING ? '' : 'class="disabled"'}>Grille tarifaire</li>
            <li ${OFFERS[offer.key].features.ENABLE_TRUST_SECTION ? '' : 'class="disabled"'}>Section garanties</li>
            <li ${OFFERS[offer.key].features.ENABLE_ABOUT_EXTENDED ? '' : 'class="disabled"'}>À propos étendu</li>
            <li ${OFFERS[offer.key].features.ENABLE_CERTIFICATIONS ? '' : 'class="disabled"'}>Certifications</li>
          </ul>
          <a href="#" class="cta">Choisir ${offer.name}</a>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;

  const htmlPath = join(projectRoot, 'offers', 'comparatif.html');
  writeFileSync(htmlPath, html);
  console.log(`\n📄 Comparatif HTML créé: offers/comparatif.html`);
  console.log(`   Ouvrez ce fichier dans un navigateur pour voir les 3 offres !`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
