#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { getPlaceholders } from '../src/_data/placeholders.js';
import { applyPack } from './apply-pack.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Utility functions
function ensureDirectories() {
  const assetsDir = join(projectRoot, 'assets', 'images');
  const heroDir = join(assetsDir, 'hero');
  const galleryDir = join(assetsDir, 'gallery');
  
  if (!existsSync(assetsDir)) mkdirSync(assetsDir, { recursive: true });
  if (!existsSync(heroDir)) mkdirSync(heroDir, { recursive: true });
  if (!existsSync(galleryDir)) mkdirSync(galleryDir, { recursive: true });
  
  return { assetsDir, heroDir, galleryDir };
}

function prettifyPhone(phone) {
  // Convert +33612345678 to 06 12 34 56 78
  const cleaned = phone.replace(/^\+33/, '0').replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  return phone;
}

function normalizePhone(phone) {
  // Ensure phone is in +33 format
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('33')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    return '+33' + cleaned.substring(1);
  }
  return '+33' + cleaned;
}

function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes';
  }
  return false;
}

function detectImages() {
  const { assetsDir, heroDir, galleryDir } = ensureDirectories();
  
  // Detect logo
  let logoUrl = null;
  if (existsSync(assetsDir)) {
    const logoFiles = readdirSync(assetsDir).filter(file => {
      try {
        const stats = statSync(join(assetsDir, file));
        return stats.isFile() && stats.size > 0 && 
               /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(file) && 
               file.toLowerCase().includes('logo');
      } catch (e) {
        return false;
      }
    });
    if (logoFiles.length > 0) {
      logoUrl = `/assets/images/${logoFiles[0]}`;
    }
  }
  
  // Detect gallery images
  let galleryImages = [];
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
    galleryImages = galleryFiles.map(file => `/assets/images/gallery/${file}`);
  }
  
  // Detect hero image
  let heroImage = null;
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
      heroImage = `/assets/images/hero/${heroFiles[0]}`;
    }
  }
  
  return { logoUrl, galleryImages, heroImage };
}

function loadPreset(businessType) {
  const presetPath = join(projectRoot, 'presets', businessType, 'preset.json');
  if (!existsSync(presetPath)) {
    throw new Error(`Preset not found for business type: ${businessType}`);
  }
  return JSON.parse(readFileSync(presetPath, 'utf8'));
}

function parseConfig(configPath) {
  if (!existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }
  
  const ext = extname(configPath).toLowerCase();
  let config;
  
  if (ext === '.json') {
    config = JSON.parse(readFileSync(configPath, 'utf8'));
  } else if (ext === '.md') {
    // Parse markdown format (for Tally exports)
    const content = readFileSync(configPath, 'utf8');
    config = parseMarkdownConfig(content);
  } else {
    throw new Error(`Unsupported config format: ${ext}`);
  }
  
  return config;
}

function parseMarkdownConfig(content) {
  // Parse Tally markdown export format
  const config = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, '_');
      config[normalizedKey] = value;
    }
  }
  
  return config;
}

function generateSiteConfig(inputConfig) {
  const businessType = inputConfig.business_type || 'serrurier';
  const preset = loadPreset(businessType);
  const { logoUrl, galleryImages, heroImage } = detectImages();
  
  // Parse areas
  const areas = inputConfig.service_areas 
    ? inputConfig.service_areas.split(',').map(area => area.trim())
    : [inputConfig.city || 'Toulouse'];
  
  // Parse trust badges
  const trustBadges = inputConfig.trust_badges
    ? inputConfig.trust_badges.split(',').map(badge => badge.trim())
    : ['Professionnel agréé', 'Devis gratuit', 'Paiement CB'];
  
  // Parse reviews
  let reviews = [];
  if (parseBoolean(inputConfig.enable_reviews) && inputConfig.reviews) {
    reviews = Array.isArray(inputConfig.reviews) ? inputConfig.reviews : [];
  }
  
  // Parse pricing
  let pricing = [];
  if (parseBoolean(inputConfig.enable_pricing) && inputConfig.pricing) {
    pricing = Array.isArray(inputConfig.pricing) ? inputConfig.pricing : [];
  }
  
  // Normalize phone
  const phoneNormalized = normalizePhone(inputConfig.phone || '0612345678');
  
  // Build configuration
  const config = {
    PACK: inputConfig.PACK || inputConfig.pack || "lite",
    MODULES: inputConfig.MODULES || inputConfig.modules || [],
    NICHE: businessType,
    ACCENT: inputConfig.accent_color || preset.ACCENT,
    HERO_TEXT: inputConfig.hero_title || preset.HERO_TEXT.replace('{{CITY}}', inputConfig.city || 'Toulouse'),
    SERVICES: preset.SERVICES,
    FAQ: preset.FAQ,
    IS_24_7: inputConfig.availability === '24/7' || inputConfig.availability === '24h/24',
    ENABLE_REVIEWS: parseBoolean(inputConfig.enable_reviews),
    ENABLE_GALLERY: parseBoolean(inputConfig.enable_gallery) && galleryImages.length > 0,
    ENABLE_PRICING: parseBoolean(inputConfig.enable_pricing),
    PRICING: pricing,
    BUSINESS_NAME: inputConfig.business_name || 'Mon Entreprise',
    CITY: inputConfig.city || 'Toulouse',
    PHONE_TEL: phoneNormalized,
    PHONE_PRETTY: prettifyPhone(phoneNormalized),
    EMAIL: inputConfig.email || 'contact@exemple.fr',
    ADDRESS: inputConfig.address || `${inputConfig.city || 'Toulouse'}, France`,
    AREAS: areas,
    RESPONSE_TIME: inputConfig.response_time || '30-45 minutes',
    HERO_SUBTITLE: inputConfig.hero_subtitle || `Intervention en ${inputConfig.response_time || '30-45 minutes'}`,
    ABOUT_SNIPPET: inputConfig.description || `Service professionnel à ${inputConfig.city || 'Toulouse'}. Intervention rapide et tarifs transparents.`,
    CTA_PRIMARY_TEXT: inputConfig.cta_primary || 'Appeler maintenant',
    CTA_SECONDARY_TEXT: inputConfig.cta_secondary || 'Devis gratuit',
    URGENCY_TEXT: inputConfig.urgency_banner || '🚨 Service rapide et professionnel',
    TRUST_BADGES: trustBadges,
    REVIEWS: reviews,
    GALLERY: parseBoolean(inputConfig.enable_gallery) ? galleryImages : [],
    LOGO_URL: logoUrl,
    HERO_BACKGROUND_IMAGE: heroImage,
    ENABLE_EMERGENCY_BANNER: parseBoolean(inputConfig.enable_emergency_banner),
    ENABLE_SECTION_DESCRIPTIONS: parseBoolean(inputConfig.enable_section_descriptions),
    ENABLE_ABOUT_EXTENDED: parseBoolean(inputConfig.enable_about_extended),
    ENABLE_TRUST_SECTION: parseBoolean(inputConfig.enable_trust_section),
    ENABLE_CERTIFICATIONS: parseBoolean(inputConfig.enable_certifications),
    CURRENCY: '€',
    MAPS_URL: `https://maps.google.com/?q=${encodeURIComponent(inputConfig.business_name || 'Mon Entreprise')} ${encodeURIComponent(inputConfig.address || inputConfig.city || 'Toulouse')}`
  };
  
  // Add conditional sections
  if (parseBoolean(inputConfig.enable_section_descriptions)) {
    config.SECTION_DESCRIPTIONS = {
      services: `Découvrez nos services de ${businessType === 'serrurier' ? 'serrurerie' : businessType === 'electricien' ? 'électricité' : 'dépannage'} disponibles rapidement dans toute la région ${inputConfig.city?.toLowerCase() || 'toulousaine'}.`,
      zones: `Nous intervenons rapidement dans toutes ces zones avec un délai moyen de ${inputConfig.response_time || '30-45 minutes'}.`,
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
  
  if (parseBoolean(inputConfig.enable_about_extended)) {
    config.ABOUT_EXTENDED = {
      title: 'Pourquoi nous choisir ?',
      content: `Avec plus de 10 ans d'expérience dans le domaine ${businessType === 'serrurier' ? 'de la serrurerie' : businessType === 'electricien' ? 'de l\'électricité' : 'du dépannage'}, notre équipe intervient rapidement sur toute la région ${inputConfig.city?.toLowerCase() || 'toulousaine'}. Nous disposons d'un matériel professionnel de dernière génération et nos techniciens sont formés aux dernières technologies.`,
      highlights: [
        'Plus de 10 ans d\'expérience',
        'Matériel professionnel certifié',
        'Techniciens formés et qualifiés',
        `Intervention en ${inputConfig.response_time || '30-45 minutes'}`
      ]
    };
  }
  
  if (parseBoolean(inputConfig.enable_trust_section)) {
    config.TRUST_SECTION = {
      title: 'Nos Garanties',
      items: [
        {
          icon: '⚡',
          title: 'Intervention Rapide',
          desc: `Arrivée sur site en ${inputConfig.response_time || '30-45 minutes'}`
        },
        {
          icon: '💰',
          title: 'Prix Transparent',
          desc: 'Devis gratuit et détaillé avant intervention'
        },
        {
          icon: '🔧',
          title: 'Matériel Pro',
          desc: 'Équipement professionnel de dernière génération'
        },
        {
          icon: '📞',
          title: config.IS_24_7 ? 'Service 24/7' : 'Service Rapide',
          desc: config.IS_24_7 ? 'Disponible 24h/24 et 7j/7' : 'Intervention rapide aux heures ouvrables'
        }
      ]
    };
  }
  
  if (parseBoolean(inputConfig.enable_certifications)) {
    const certifications = businessType === 'serrurier' ? [
      { name: 'Certification A2P', icon: '🔒', desc: 'Serrures certifiées haute sécurité' },
      { name: 'Assurance Décennale', icon: '🛡️', desc: 'Garantie décennale sur les installations' },
      { name: 'Formation CNPP', icon: '🎓', desc: 'Techniciens formés sécurité' }
    ] : businessType === 'electricien' ? [
      { name: 'Qualification Qualifelec', icon: '⚡', desc: 'Électricien qualifié et certifié' },
      { name: 'Assurance Décennale', icon: '🛡️', desc: 'Garantie décennale sur les installations' },
      { name: 'Habilitation Électrique', icon: '🎓', desc: 'Techniciens habilités B1V, B2V' }
    ] : [
      { name: 'Professionnel Agréé', icon: '🔧', desc: 'Dépanneur professionnel agréé' },
      { name: 'Assurance Responsabilité', icon: '🛡️', desc: 'Couverture complète des interventions' },
      { name: 'Formation Continue', icon: '🎓', desc: 'Techniciens formés régulièrement' }
    ];
    
    config.CERTIFICATIONS = certifications;
  }
  
  return config;
}

function backfill(site) {
  const ph = getPlaceholders(site.NICHE || "serrurier", site.CITY || "");
  site.ACCENT      ||= ph.ACCENT;
  site.HERO_TEXT  ||= ph.HERO_TEXT;
  site.ABOUT_SNIPPET ||= ph.ABOUT_SNIPPET;

  // TEXT_MODE
  if ((site.TEXT_MODE || "simple") === "detail" && !site.ABOUT_EXTENDED) {
    site.ABOUT_EXTENDED = {
      title: 'À propos',
      content: ph.ABOUT_EXTENDED,
      highlights: []
    };
  }

  // services
  if (!Array.isArray(site.SERVICES) || site.SERVICES.length === 0) {
    site.SERVICES = ph.SERVICES;
  }

  // FAQ (optionnelle)
  if (!Array.isArray(site.FAQ) || site.FAQ.length === 0) {
    site.FAQ = ph.FAQ;
  }

  // Pricing si activé
  if (site.ENABLE_PRICING) {
    const base = ph.PRICING || [];
    site.PRICING = (site.PRICING || []).slice(0, site._CAPS?.prices || 99);
    if (site.PRICING.length === 0) site.PRICING = base.slice(0, site._CAPS?.prices || 99);
  } else {
    site.PRICING = site.PRICING || [];
  }

  // Galerie si activée
  if (site.ENABLE_GALLERY) {
    site.GALLERY = (site.GALLERY || []).slice(0, site._CAPS?.photos || 99);
  } else {
    site.GALLERY = site.GALLERY || [];
  }

  // Avis si activés
  if (site.ENABLE_REVIEWS) {
    if (!Array.isArray(site.REVIEWS) || site.REVIEWS.length === 0) {
      site.REVIEWS = (ph.REVIEWS || []).slice(0, site._CAPS?.reviews || 99);
    } else {
      site.REVIEWS = site.REVIEWS.slice(0, site._CAPS?.reviews || 99);
    }
  } else {
    site.REVIEWS = site.REVIEWS || [];
  }

  // Garanties / Certifs
  if (site.SHOW_GUARANTEES && (!site.GUARANTEES || site.GUARANTEES.length === 0)) {
    site.GUARANTEES = ph.GUARANTEES;
  }
  if (site.ENABLE_CERTS && (!site.CERTIFICATIONS || site.CERTIFICATIONS.length === 0)) {
    const certs = ph.CERTS_LOGOS.map(logo => ({ icon: '✓', name: 'Certifié', desc: 'Professionnel' }));
    site.CERTIFICATIONS = certs;
  }

  // Images
  if (!site.LOGO_URL) site.LOGO_URL = ph.LOGO_FALLBACK;
  if (!site.HERO_BACKGROUND_IMAGE) site.HERO_BACKGROUND_IMAGE = ph.HERO_BG_URL;

  return site;
}

function finalizeSite(site) {
  applyPack(site);
  backfill(site);
  return site;
}

function main() {
  console.log('🚀 Génération du site depuis la configuration Tally\n');
  
  try {
    // Look for config file
    const configPaths = [
      join(projectRoot, 'input', 'site-config.json'),
      join(projectRoot, 'input', 'site-config.md'),
      join(projectRoot, 'input', 'config.json'),
      join(projectRoot, 'input', 'config.md')
    ];
    
    let configPath = null;
    for (const path of configPaths) {
      if (existsSync(path)) {
        configPath = path;
        break;
      }
    }
    
    if (!configPath) {
      console.error('❌ Aucun fichier de configuration trouvé dans /input/');
      console.log('📋 Fichiers supportés:');
      console.log('   - input/site-config.json');
      console.log('   - input/site-config.md');
      console.log('   - input/config.json');
      console.log('   - input/config.md');
      process.exit(1);
    }
    
    console.log(`📄 Configuration trouvée: ${configPath}`);
    
    // Parse config
    const inputConfig = parseConfig(configPath);
    console.log(`✅ Configuration parsée: ${inputConfig.business_name || 'Entreprise'}`);
    
    // Generate site config
    let siteConfig = generateSiteConfig(inputConfig);
    
    // Apply pack logic and backfill placeholders
    siteConfig = finalizeSite(siteConfig);
    
    // Write site.json
    const siteJsonPath = join(projectRoot, 'src', '_data', 'site.json');
    writeFileSync(siteJsonPath, JSON.stringify(siteConfig, null, 2));
    
    console.log('\n✅ Site généré avec succès !');
    console.log(`📊 Entreprise: ${siteConfig.BUSINESS_NAME}`);
    console.log(`🏙️ Ville: ${siteConfig.CITY}`);
    console.log(`🎨 Couleur: ${siteConfig.ACCENT}`);
    console.log(`📞 Téléphone: ${siteConfig.PHONE_PRETTY}`);
    
    // Show enabled modules
    const modules = [];
    if (siteConfig.ENABLE_GALLERY) modules.push('Galerie');
    if (siteConfig.ENABLE_REVIEWS) modules.push('Avis clients');
    if (siteConfig.ENABLE_PRICING) modules.push('Tarifs');
    if (siteConfig.ENABLE_EMERGENCY_BANNER) modules.push('Bandeau urgence');
    if (siteConfig.ENABLE_SECTION_DESCRIPTIONS) modules.push('Descriptions');
    if (siteConfig.ENABLE_ABOUT_EXTENDED) modules.push('À propos étendu');
    if (siteConfig.ENABLE_TRUST_SECTION) modules.push('Garanties');
    if (siteConfig.ENABLE_CERTIFICATIONS) modules.push('Certifications');
    
    console.log(`🎯 Modules activés: ${modules.join(', ') || 'Aucun'}`);
    
    // Show images status
    if (siteConfig.LOGO_URL) console.log(`🎨 Logo: ${siteConfig.LOGO_URL}`);
    if (siteConfig.HERO_BACKGROUND_IMAGE) console.log(`🖼️ Hero: ${siteConfig.HERO_BACKGROUND_IMAGE}`);
    if (siteConfig.GALLERY.length > 0) console.log(`📸 Galerie: ${siteConfig.GALLERY.length} images`);
    
    console.log('\n🚀 Commandes suivantes:');
    console.log('  npm run dev    # Lancer le serveur de développement');
    console.log('  npm run build  # Construire le site');
    console.log('  npm run reset  # Restaurer la configuration par défaut');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
