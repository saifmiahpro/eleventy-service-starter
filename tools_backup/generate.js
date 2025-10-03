#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

function prettifyPhone(phone) {
  // Convert +33 to 0 format for display
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('33') && cleaned.length === 11) {
    cleaned = '0' + cleaned.substring(2);
  }
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  return phone;
}

function ensureDirectories() {
  const assetsDir = join(projectRoot, 'assets', 'images');
  const heroDir = join(assetsDir, 'hero');
  const galleryDir = join(assetsDir, 'gallery');
  
  if (!existsSync(assetsDir)) mkdirSync(assetsDir, { recursive: true });
  if (!existsSync(heroDir)) mkdirSync(heroDir, { recursive: true });
  if (!existsSync(galleryDir)) mkdirSync(galleryDir, { recursive: true });
  
  return { assetsDir, heroDir, galleryDir };
}

function detectLogo() {
  const { assetsDir } = ensureDirectories();
  
  if (existsSync(assetsDir)) {
    const logoFiles = readdirSync(assetsDir).filter(file => {
      try {
        const stats = statSync(join(assetsDir, file));
        return stats.isFile() && stats.size > 0 && 
               /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(file) && 
               (file.toLowerCase().includes('logo') || file.toLowerCase().startsWith('logo'));
      } catch (e) {
        return false;
      }
    });
    if (logoFiles.length > 0) {
      return `/assets/images/${logoFiles[0]}`;
    }
  }
  return null;
}

function detectGalleryImages() {
  const { galleryDir } = ensureDirectories();
  
  if (existsSync(galleryDir)) {
    const galleryFiles = readdirSync(galleryDir).filter(file => {
      try {
        const stats = statSync(join(galleryDir, file));
        return stats.isFile() && stats.size > 0 && 
               /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(file);
      } catch (e) {
        return false;
      }
    }).sort();
    return galleryFiles.map(file => `/assets/images/gallery/${file}`);
  }
  return [];
}

function detectHeroImage() {
  const { heroDir } = ensureDirectories();
  
  if (existsSync(heroDir)) {
    const heroFiles = readdirSync(heroDir).filter(file => {
      try {
        const stats = statSync(join(heroDir, file));
        return stats.isFile() && stats.size > 0 && 
               /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(file);
      } catch (e) {
        return false;
      }
    });
    if (heroFiles.length > 0) {
      return `/assets/images/hero/${heroFiles[0]}`;
    }
  }
  return null;
}

async function collectCompleteData(preset, niche, city) {
  const data = {};
  
  // Business info
  console.log('\n📋 INFORMATIONS ENTREPRISE:');
  
  // Business name with validation
  while (true) {
    data.BUSINESS_NAME = await question('Nom de l\'entreprise (ex: "Serrurerie Rapide 31"): ');
    if (data.BUSINESS_NAME.length > 0) break;
    console.log('❌ Le nom de l\'entreprise est obligatoire');
  }
  
  data.CITY = city;
  
  // Phone with validation
  while (true) {
    data.PHONE_TEL = await question('Téléphone (ex: +33612345678 ou 0612345678): ');
    if (data.PHONE_TEL.match(/^\+33[0-9]{9}$/) || data.PHONE_TEL.match(/^0[0-9]{9}$/)) {
      // Convert 0X to +33X format for storage
      if (data.PHONE_TEL.startsWith('0')) {
        data.PHONE_TEL = '+33' + data.PHONE_TEL.substring(1);
      }
      break;
    }
    console.log('❌ Format invalide. Exemples: +33612345678 ou 0612345678');
  }
  data.PHONE_PRETTY = prettifyPhone(data.PHONE_TEL);
  
  // Email with validation
  while (true) {
    data.EMAIL = await question('Email (ex: contact@monentreprise.fr): ');
    if (data.EMAIL.includes('@') && data.EMAIL.includes('.')) break;
    console.log('❌ Email invalide. Exemple: contact@monentreprise.fr');
  }
  
  data.ADDRESS = await question(`Adresse complète (ex: "12 rue de la Paix, ${city}"): `) || `${city}, France`;
  
  const areasInput = await question(`Zones d\'intervention (ex: "${city}, Blagnac, Colomiers"): `) || city;
  data.AREAS = areasInput.split(',').map(area => area.trim()).filter(Boolean);
  
  // Availability with clear options
  console.log('\n⏰ DISPONIBILITÉ:');
  console.log('1. Service 24h/24 et 7j/7');
  console.log('2. Heures ouvrables uniquement');
  const availChoice = await question('Choisir (1 ou 2): ');
  data.IS_24_7 = availChoice === '1';
  
  data.RESPONSE_TIME = await question('Temps de réponse moyen (défaut: 30-45 minutes): ') || '30-45 minutes';
  
  // Hero content with smart defaults
  console.log('\n🎯 CONTENU HERO:');
  const defaultHeroText = preset.HERO_TEXT.replace('{{CITY}}', city);
  data.HERO_TEXT = await question(`Titre principal (ex: "${defaultHeroText}"): `) || defaultHeroText;
  data.HERO_SUBTITLE = await question(`Sous-titre (ex: "Intervention en ${data.RESPONSE_TIME}"): `) || `Intervention en ${data.RESPONSE_TIME}`;
  data.ABOUT_SNIPPET = await question(`Description courte (ex: "Service professionnel à ${city}. Intervention rapide et tarifs transparents."): `) || `Service professionnel à ${city}. Intervention rapide et tarifs transparents.`;
  
  // CTA texts
  data.CTA_PRIMARY_TEXT = await question('Texte bouton principal (ex: "Appeler maintenant", "Intervention urgente"): ') || 'Appeler maintenant';
  data.CTA_SECONDARY_TEXT = await question('Texte bouton secondaire (ex: "Devis gratuit", "Demander un devis"): ') || 'Devis gratuit';
  
  // Emergency banner
  const defaultUrgency = data.IS_24_7 ? '🚨 Intervention rapide 24/7' : '🚨 Service rapide et professionnel';
  data.URGENCY_TEXT = await question(`Texte bandeau urgence (ex: "${defaultUrgency}"): `) || defaultUrgency;
  
  // Trust badges
  console.log('\n🏆 BADGES DE CONFIANCE:');
  const defaultBadges = ['Professionnel agréé', 'Devis gratuit', 'Paiement CB', data.IS_24_7 ? 'Disponible 24/7' : 'Service rapide'];
  console.log(`Badges suggérés: ${defaultBadges.join(', ')}`);
  const badgesInput = await question('Badges personnalisés (ou Entrée pour utiliser les suggérés): ');
  data.TRUST_BADGES = badgesInput ? badgesInput.split(',').map(b => b.trim()) : defaultBadges;
  
  return data;
}

async function collectServices(preset) {
  console.log('\n🔧 SERVICES:');
  
  console.log('Services suggérés pour votre secteur:');
  preset.SERVICES.forEach((service, i) => {
    console.log(`${i + 1}. ${service.title}: ${service.desc}`);
  });
  
  console.log('\nOptions:');
  console.log('1. Utiliser les services suggérés');
  console.log('2. Modifier les services suggérés');
  console.log('3. Créer mes propres services');
  
  const choice = await question('Choisir (1, 2 ou 3): ');
  
  if (choice === '1') {
    return preset.SERVICES;
  }
  
  if (choice === '2') {
    const services = [...preset.SERVICES];
    console.log('\nModification des services (Entrée pour garder, nouveau texte pour modifier):');
    
    for (let i = 0; i < services.length; i++) {
      const newTitle = await question(`Titre "${services[i].title}" → `);
      if (newTitle) services[i].title = newTitle;
      
      const newDesc = await question(`Description "${services[i].desc}" → `);
      if (newDesc) services[i].desc = newDesc;
    }
    
    return services;
  }
  
  // Choice 3: Create custom services
  const services = [];
  console.log('\nAjoutez vos services (tapez "fin" pour terminer):');
  let i = 1;
  while (true) {
    const title = await question(`Service ${i} - Titre (ou "fin"): `);
    if (title.toLowerCase() === 'fin') break;
    
    const desc = await question(`Service ${i} - Description: `);
    if (title && desc) {
      services.push({ title, desc });
      i++;
    }
  }
  
  return services.length > 0 ? services : preset.SERVICES;
}

async function collectFAQ(preset) {
  console.log('\n❓ FAQ:');
  
  console.log('FAQ suggérée:');
  preset.FAQ.forEach((item, i) => {
    console.log(`${i + 1}. Q: ${item.q}`);
    console.log(`   R: ${item.a}`);
  });
  
  const usePreset = (await question('Utiliser la FAQ suggérée ? (y/n, défaut: y): ') || 'y').toLowerCase() === 'y';
  
  if (usePreset) {
    return preset.FAQ;
  }
  
  console.log('\nAjoutez vos questions (tapez "fin" pour terminer):');
  const faq = [];
  let i = 1;
  while (true) {
    const q = await question(`Question ${i} (ou "fin"): `);
    if (q.toLowerCase() === 'fin') break;
    
    const a = await question(`Réponse ${i}: `);
    if (q && a) {
      faq.push({ q, a });
      i++;
    }
  }
  
  return faq.length > 0 ? faq : preset.FAQ;
}

async function collectReviews() {
  console.log('\n⭐ AVIS CLIENTS:');
  const reviews = [];
  
  console.log('Ajoutez des avis clients (tapez "fin" pour terminer):');
  console.log('💡 Exemples: "Service rapide et professionnel", "Très satisfait de l\'intervention"');
  let i = 1;
  while (true) {
    const name = await question(`Avis ${i} - Nom du client (ex: "Marie D.", "Pierre L." ou "fin"): `);
    if (name.toLowerCase() === 'fin') break;
    
    const text = await question(`Avis ${i} - Commentaire (ex: "Intervention rapide et efficace. Je recommande!"): `);
    const rating = parseInt(await question(`Avis ${i} - Note (1-5, défaut: 5): `) || '5');
    
    if (name && text) {
      reviews.push({ name, text, rating: Math.min(5, Math.max(1, rating)) });
      i++;
    }
  }
  
  return reviews;
}

async function collectPricing() {
  console.log('\n💰 TARIFS:');
  const pricing = [];
  
  console.log('Ajoutez vos tarifs (tapez "fin" pour terminer):');
  console.log('💡 Exemples: "Ouverture de porte" → "80" → "Sans casse dans 90% des cas"');
  let i = 1;
  while (true) {
    const label = await question(`Tarif ${i} - Service (ex: "Ouverture de porte", "Changement serrure" ou "fin"): `);
    if (label.toLowerCase() === 'fin') break;
    
    const price = await question(`Tarif ${i} - Prix en € (ex: "80", "120"): `);
    const note = await question(`Tarif ${i} - Note explicative (ex: "Déplacement inclus", "Garantie 2 ans"): `);
    
    if (label && price) {
      pricing.push({ 
        label, 
        price, 
        ...(note && { note })
      });
      i++;
    }
  }
  
  return pricing;
}

function replaceTokens(obj, replacements) {
  const jsonStr = JSON.stringify(obj);
  let result = jsonStr;
  
  for (const [token, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{{${token}}}`, 'g');
    result = result.replace(regex, value);
  }
  
  return JSON.parse(result);
}

async function main() {
  console.log('🚀 Générateur de site Eleventy COMPLET pour services locaux\n');

  try {
    // Ensure directories exist
    ensureDirectories();
    
    // Quick setup mode
    console.log('🚀 MODES DE GÉNÉRATION:');
    console.log('1. Mode rapide (utilise les presets, 2 minutes)');
    console.log('2. Mode complet (personnalisation totale, 10 minutes)');
    const setupMode = await question('Choisir le mode (1 ou 2, défaut: 1): ') || '1';
    const isQuickMode = setupMode === '1';
    
    if (isQuickMode) {
      console.log('\n⚡ MODE RAPIDE ACTIVÉ - Seules les infos essentielles seront demandées\n');
    }
    
    // Get niche with better validation
    let niche;
    while (true) {
      niche = await question('Secteur d\'activité (depanneur/serrurier/electricien): ');
      if (['depanneur', 'serrurier', 'electricien'].includes(niche.toLowerCase())) {
        niche = niche.toLowerCase();
        break;
      }
      console.log('❌ Secteur non supporté. Tapez exactement: depanneur, serrurier ou electricien');
    }

    // Load preset
    const presetPath = join(projectRoot, 'presets', niche, 'preset.json');
    const preset = JSON.parse(readFileSync(presetPath, 'utf8'));

    // Get city first (needed for other functions)
    const city = await question('Ville principale: ');

    // Color selection
    console.log('\n🎨 COULEURS DISPONIBLES:');
    console.log('1. Bleu professionnel (#2c7be5) - Défaut');
    console.log('2. Rouge urgence (#dc3545)');
    console.log('3. Vert confiance (#28a745)');
    console.log('4. Orange énergie (#fd7e14)');
    console.log('5. Violet premium (#6f42c1)');
    console.log('6. Couleur personnalisée (hex)');
    
    const colorChoice = await question(`Choisir une couleur (1-6, défaut: ${preset.ACCENT}): `);
    let accent = preset.ACCENT;
    
    switch(colorChoice.trim()) {
      case '1': accent = '#2c7be5'; break;
      case '2': accent = '#dc3545'; break;
      case '3': accent = '#28a745'; break;
      case '4': accent = '#fd7e14'; break;
      case '5': accent = '#6f42c1'; break;
      case '6': 
        const customColor = await question('Couleur personnalisée (hex, ex: #ff5733): ');
        accent = customColor.trim() || preset.ACCENT;
        break;
      default: accent = preset.ACCENT;
    }

    // Collect business data
    const businessData = await collectCompleteData(preset, niche, city);
    
    // Collect content based on mode
    let services, faq, reviews = [], pricing = [];
    let enableReviews = false, enablePricing = false;
    
    if (isQuickMode) {
      // Quick mode: use presets with minimal questions
      services = preset.SERVICES;
      faq = preset.FAQ;
      
      enableReviews = (await question('Ajouter des avis clients ? (y/n, défaut: n): ') || 'n').toLowerCase() === 'y';
      if (enableReviews) {
        reviews = await collectReviews();
      }
      
      enablePricing = (await question('Ajouter une grille tarifaire ? (y/n, défaut: n): ') || 'n').toLowerCase() === 'y';
      if (enablePricing) {
        pricing = await collectPricing();
      }
    } else {
      // Complete mode: full customization
      services = await collectServices(preset);
      faq = await collectFAQ(preset);
      
      enableReviews = (await question('⭐ Avis clients ? (y/n): ')).toLowerCase() === 'y';
      if (enableReviews) {
        reviews = await collectReviews();
      }

      enablePricing = (await question('💰 Grille tarifaire ? (y/n): ')).toLowerCase() === 'y';
      if (enablePricing) {
        pricing = await collectPricing();
      }
    }

    // Premium features selection
    console.log('\n🎯 FONCTIONNALITÉS PREMIUM (facturation supplémentaire):');
    const enableSectionDescriptions = (await question('📝 Descriptions de sections (+100€) ? (y/n, défaut: y): ') || 'y').toLowerCase() === 'y';
    const enableAboutExtended = (await question('📖 Section "À propos" étendue (+150€) ? (y/n, défaut: n): ') || 'n').toLowerCase() === 'y';
    const enableTrustSection = (await question('🛡️ Section garanties/confiance (+150€) ? (y/n, défaut: n): ') || 'n').toLowerCase() === 'y';
    const enableCertifications = (await question('🏆 Section certifications (+250€) ? (y/n, défaut: n): ') || 'n').toLowerCase() === 'y';
    
    // Standard modules
    console.log('\n📱 MODULES STANDARDS:');
    const enableEmergencyBanner = (await question('🚨 Bandeau d\'urgence animé ? (y/n, défaut: y): ') || 'y').toLowerCase() === 'y';
    
    // Ask about logo first
    const wantLogo = (await question('🎨 Ajouter un logo ? (y/n): ')).toLowerCase() === 'y';
    let logoUrl = null;
    if (wantLogo) {
      logoUrl = detectLogo();
      if (logoUrl) {
        console.log(`✅ Logo détecté: ${logoUrl}`);
      } else {
        console.log('❌ Aucun logo trouvé dans assets/images/ (nom doit contenir "logo")');
        console.log('➡️ Le nom de l\'entreprise sera affiché à la place');
      }
    }
    
    // Ask about gallery first
    const wantGallery = (await question('🖼️ Ajouter une galerie photos ? (y/n): ')).toLowerCase() === 'y';
    let galleryImages = [];
    let enableGallery = false;
    if (wantGallery) {
      galleryImages = detectGalleryImages();
      if (galleryImages.length > 0) {
        console.log(`✅ ${galleryImages.length} images détectées dans la galerie`);
        enableGallery = true;
      } else {
        console.log('❌ Aucune image trouvée dans assets/images/gallery/');
        console.log('➡️ La galerie ne sera pas affichée');
        enableGallery = false;
      }
    }
    
    // Ask about hero background
    const wantHeroImage = (await question('🖼️ Image de fond pour le hero ? (y/n): ')).toLowerCase() === 'y';
    let heroImage = null;
    if (wantHeroImage) {
      heroImage = detectHeroImage();
      if (heroImage) {
        console.log(`✅ Image hero détectée: ${heroImage}`);
      } else {
        console.log('❌ Aucune image trouvée dans assets/images/hero/');
      }
    }

    // Build final configuration
    const config = {
      ...preset,
      ...businessData,
      ACCENT: accent,
      SERVICES: services,
      FAQ: faq,
      REVIEWS: reviews,
      PRICING: pricing,
      GALLERY: galleryImages,
      LOGO_URL: logoUrl,
      HERO_BACKGROUND_IMAGE: heroImage,
      ENABLE_EMERGENCY_BANNER: enableEmergencyBanner,
      ENABLE_SECTION_DESCRIPTIONS: enableSectionDescriptions,
      ENABLE_ABOUT_EXTENDED: enableAboutExtended,
      ENABLE_TRUST_SECTION: enableTrustSection,
      ENABLE_CERTIFICATIONS: enableCertifications,
      ENABLE_GALLERY: enableGallery,
      ENABLE_REVIEWS: enableReviews,
      ENABLE_PRICING: enablePricing,
      CURRENCY: '€',
      MAPS_URL: `https://maps.google.com/?q=${encodeURIComponent(businessData.BUSINESS_NAME + ' ' + businessData.ADDRESS)}`
    };

    // Add section descriptions if enabled
    if (enableSectionDescriptions) {
      config.SECTION_DESCRIPTIONS = {
        services: `Découvrez nos services de ${niche === 'depanneur' ? 'dépannage automobile' : niche === 'serrurier' ? 'serrurerie' : 'électricité'} disponibles ${businessData.IS_24_7 ? '24h/24' : 'rapidement'} dans toute la région ${city.toLowerCase()}aine.`,
        zones: `Nous intervenons rapidement dans toutes ces zones avec un délai moyen de ${businessData.RESPONSE_TIME}.`,
        reviews: 'Découvrez les témoignages de nos clients satisfaits de nos interventions rapides et professionnelles.',
        faq: 'Retrouvez les réponses aux questions les plus fréquemment posées par nos clients.',
        contact: 'Contactez-nous dès maintenant pour une intervention rapide ou pour obtenir un devis gratuit.',
        pricing: 'Nos tarifs transparents et compétitifs pour tous vos besoins.',
        gallery: 'Découvrez quelques photos de nos interventions et de notre matériel professionnel.',
        about_extended: 'En savoir plus sur notre entreprise, notre expérience et nos valeurs.',
        certifications: 'Nos agréments et certifications qui garantissent la qualité de nos services.',
        trust: 'Les garanties que nous vous offrons pour votre tranquillité d\'esprit.'
      };
    }

    // Add premium content if enabled
    if (enableAboutExtended) {
      config.ABOUT_EXTENDED = {
        title: "Pourquoi nous choisir ?",
        content: `Avec plus de 10 ans d'expérience dans le ${niche === 'depanneur' ? 'dépannage automobile' : niche === 'serrurier' ? 'domaine de la serrurerie' : 'secteur électrique'}, notre équipe intervient rapidement sur toute la région ${city.toLowerCase()}aine. Nous disposons d'un matériel professionnel de dernière génération et nos techniciens sont formés aux dernières technologies.`,
        highlights: [
          "Plus de 10 ans d'expérience",
          "Matériel professionnel certifié", 
          "Techniciens formés et qualifiés",
          `Intervention en ${businessData.RESPONSE_TIME}`
        ]
      };
    }

    if (enableTrustSection) {
      config.TRUST_SECTION = {
        title: "Nos Garanties",
        items: [
          {
            icon: "⚡",
            title: "Intervention Rapide", 
            desc: `Arrivée sur site en ${businessData.RESPONSE_TIME}`
          },
          {
            icon: "💰",
            title: "Prix Transparent",
            desc: "Devis gratuit et détaillé avant intervention"
          },
          {
            icon: "🔧", 
            title: "Matériel Pro",
            desc: "Équipement professionnel de dernière génération"
          },
          {
            icon: "📞",
            title: businessData.IS_24_7 ? "Disponible 24/7" : "Service Rapide",
            desc: businessData.IS_24_7 ? "Service d'urgence jour et nuit, week-end inclus" : "Intervention rapide aux heures ouvrables"
          }
        ]
      };
    }

    if (enableCertifications) {
      const certifications = {
        depanneur: [
          { name: "Agrément Préfecture", icon: "🏛️", desc: "Agréé par la préfecture pour le dépannage" },
          { name: "Assurance Pro", icon: "🛡️", desc: "Responsabilité civile professionnelle" },
          { name: "Formation Continue", icon: "🎓", desc: "Techniciens certifiés automobile" }
        ],
        serrurier: [
          { name: "Certification A2P", icon: "🔒", desc: "Serrures certifiées haute sécurité" },
          { name: "Assurance Décennale", icon: "🛡️", desc: "Garantie décennale sur les installations" },
          { name: "Formation CNPP", icon: "🎓", desc: "Techniciens formés sécurité" }
        ],
        electricien: [
          { name: "Qualification Qualifelec", icon: "⚡", desc: "Qualification électricité professionnelle" },
          { name: "Norme NF C 15-100", icon: "📋", desc: "Installations aux normes en vigueur" },
          { name: "Habilitation BR", icon: "🎓", desc: "Techniciens habilités basse tension" }
        ]
      };
      config.CERTIFICATIONS = certifications[niche];
    }

    // Replace {{CITY}} tokens in preset data
    const finalConfig = replaceTokens(config, { CITY: city });

    // Calculate pricing
    let totalPrice = 0;
    const features = [];
    
    if (enableSectionDescriptions) {
      totalPrice += 100;
      features.push('📝 Descriptions de sections (+100€)');
    }
    if (enableAboutExtended) {
      totalPrice += 150;
      features.push('📖 Section "À propos" étendue (+150€)');
    }
    if (enableTrustSection) {
      totalPrice += 150;
      features.push('🛡️ Section garanties/confiance (+150€)');
    }
    if (enableCertifications) {
      totalPrice += 250;
      features.push('🏆 Section certifications (+250€)');
    }

    // Write site.json
    const outputPath = join(projectRoot, 'src', '_data', 'site.json');
    writeFileSync(outputPath, JSON.stringify(finalConfig, null, 2));

    console.log('\n✅ Site généré avec TOUTES les données !');
    console.log('\n💰 RÉCAPITULATIF FACTURATION:');
    console.log('📦 Package de base: 300€');
    
    if (features.length > 0) {
      console.log('\n🎯 Fonctionnalités premium:');
      features.forEach(feature => console.log(`   ${feature}`));
      console.log(`\n💵 Total premium: +${totalPrice}€`);
      console.log(`🏆 PRIX TOTAL: ${300 + totalPrice}€`);
    } else {
      console.log('🏆 PRIX TOTAL: 300€ (package de base)');
    }
    
    console.log('\n📊 CONTENU GÉNÉRÉ:');
    console.log(`   📋 ${services.length} services`);
    console.log(`   ❓ ${faq.length} questions FAQ`);
    console.log(`   ⭐ ${reviews.length} avis clients`);
    console.log(`   💰 ${pricing.length} tarifs`);
    console.log(`   🖼️ ${galleryImages.length} images galerie`);
    console.log(`   🎨 Logo: ${logoUrl ? 'Oui' : 'Non'}`);
    console.log(`   🖼️ Hero image: ${heroImage ? 'Oui' : 'Non'}`);
    
    console.log('\n🎉 Configuration terminée !');
    console.log('\nCommandes suivantes :');
    console.log('  npm run dev    # Lancer le serveur de développement');
    console.log('  npm run build  # Construire le site');
    
    console.log('\n📁 Structure des dossiers créée:');
    console.log('  assets/images/hero/     - Placez l\'image hero ici');
    console.log('  assets/images/gallery/  - Placez les images galerie ici');
    console.log('  assets/images/logo.png  - Placez le logo ici');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
