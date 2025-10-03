#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync, createWriteStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Configuration
const TALLY_API_KEY = process.env.TALLY_API_KEY;
const TALLY_FORM_ID = process.env.TALLY_FORM_ID;

// Utility: Parse CLI args
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { id: null, download: false };
  
  for (const arg of args) {
    if (arg.startsWith('--id=')) {
      parsed.id = arg.split('=')[1];
    } else if (arg === '--download') {
      parsed.download = true;
    }
  }
  
  return parsed;
}

// Utility: Slugify text for folder names
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Utility: Normalize phone to +33 format
function normalizePhone(phone) {
  if (!phone) return '+33612345678';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('33')) return '+' + cleaned;
  if (cleaned.startsWith('0')) return '+33' + cleaned.substring(1);
  return '+33' + cleaned;
}

// Utility: Format phone pretty (06 12 34 56 78)
function prettifyPhone(phone) {
  const normalized = normalizePhone(phone);
  const cleaned = normalized.replace(/^\+33/, '0').replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  return phone;
}

// Utility: Parse boolean from Tally
function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'oui' || lower === 'yes' || lower === 'true' || lower === '1';
  }
  return false;
}

// Utility: Normalize business type
function normalizeNiche(value) {
  if (!value) return 'serrurier';
  const lower = value.toLowerCase().trim();
  if (lower.includes('dépanneur') || lower.includes('depanneur') || lower.includes('remorquage')) {
    return 'depanneur';
  }
  if (lower.includes('serrurier') || lower.includes('serrure')) {
    return 'serrurier';
  }
  if (lower.includes('électricien') || lower.includes('electricien') || lower.includes('electrique')) {
    return 'electricien';
  }
  return 'serrurier';
}

// Utility: Get default color by niche
function getDefaultColor(niche) {
  const colors = {
    depanneur: '#e74c3c',
    serrurier: '#f39c12',
    electricien: '#3498db'
  };
  return colors[niche] || '#f39c12';
}

// Utility: Download file from URL
async function downloadFile(url, destPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const dir = dirname(destPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    const stream = createWriteStream(destPath);
    await pipeline(Readable.fromWeb(response.body), stream);
    
    return true;
  } catch (error) {
    console.error(`❌ Erreur téléchargement ${url}:`, error.message);
    return false;
  }
}

// Fetch Tally submission by ID
async function fetchTallySubmission(submissionId) {
  if (!TALLY_API_KEY || !TALLY_FORM_ID) {
    throw new Error('TALLY_API_KEY et TALLY_FORM_ID requis dans .env.local');
  }
  
  // Correct endpoint: directly fetch specific submission
  const url = `https://api.tally.so/forms/${TALLY_FORM_ID}/submissions/${submissionId}`;
  
  console.log(`🔍 Recherche de la soumission ${submissionId}...`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${TALLY_API_KEY}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Tally error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    
    console.log(`✅ Soumission trouvée !`);
    return data;
  } catch (error) {
    throw new Error(`Erreur API Tally: ${error.message}`);
  }
}

// Map Tally answers to flat object
function flattenTallyAnswers(data) {
  const flat = {};
  
  // Tally API returns { questions: [], submission: { responses: [] } }
  if (!data.questions || !data.submission || !data.submission.responses) {
    return flat;
  }
  
  // Create a map of questionId -> question title
  const questionMap = {};
  for (const question of data.questions) {
    questionMap[question.id] = question.title || question.id;
  }
  
  // Map responses to flat object using question titles as keys
  for (const response of data.submission.responses) {
    const questionTitle = questionMap[response.questionId] || response.questionId;
    const key = slugify(questionTitle);
    const value = response.value;
    
    // Handle different field types
    if (Array.isArray(value)) {
      flat[key] = value;
    } else if (value && typeof value === 'object' && value.url) {
      // File upload
      flat[key] = value;
    } else {
      flat[key] = value;
    }
  }
  
  return flat;
}

// Map Tally data to site config schema
async function mapToSiteConfig(tallyData, options = {}) {
  const { download = false, submissionId = 'unknown' } = options;
  
  // Extract basic fields with fallbacks
  const businessName = tallyData['nom-de-l-entreprise'] || tallyData['business-name'] || tallyData['nom-entreprise'] || 'Mon Entreprise';
  const businessType = normalizeNiche(tallyData['type-d-activite'] || tallyData['business-type'] || tallyData['secteur']);
  const city = tallyData['ville'] || tallyData['city'] || 'Toulouse';
  const phone = tallyData['telephone'] || tallyData['phone'] || '0612345678';
  const email = tallyData['email'] || tallyData['e-mail'] || 'contact@exemple.fr';
  const address = tallyData['adresse'] || tallyData['address'] || `${city}, France`;
  
  // Parse service areas
  const areasRaw = tallyData['zones-d-intervention'] || tallyData['service-areas'] || tallyData['zones'] || city;
  const areas = areasRaw
    .split(/[,\n]/)
    .map(a => a.trim())
    .filter(a => a.length > 0);
  
  // Availability
  const availability = tallyData['disponibilite'] || tallyData['availability'] || '24/7';
  const is24_7 = availability.includes('24') || parseBoolean(tallyData['service-24-7']);
  
  // Response time
  const responseTime = tallyData['temps-de-reponse'] || tallyData['response-time'] || '30-45 minutes';
  
  // Color
  const accentColor = tallyData['couleur'] || tallyData['accent-color'] || getDefaultColor(businessType);
  
  // Hero content
  const heroTitle = tallyData['titre-principal'] || tallyData['hero-title'] || `Service ${businessType} 24/7 à ${city}`;
  const heroSubtitle = tallyData['sous-titre'] || tallyData['hero-subtitle'] || `Intervention en ${responseTime}`;
  const description = tallyData['description'] || tallyData['about'] || `Service professionnel à ${city}. Intervention rapide et tarifs transparents.`;
  
  // CTAs
  const ctaPrimary = tallyData['bouton-principal'] || tallyData['cta-primary'] || 'Appeler maintenant';
  const ctaSecondary = tallyData['bouton-secondaire'] || tallyData['cta-secondary'] || 'Devis gratuit';
  const urgencyBanner = tallyData['bandeau-urgence'] || tallyData['urgency-banner'] || '🚨 Intervention rapide 24/7';
  
  // Trust badges
  const trustBadgesRaw = tallyData['badges-de-confiance'] || tallyData['trust-badges'] || 'Professionnel agréé, Devis gratuit, Paiement CB';
  const trustBadges = trustBadgesRaw
    .split(',')
    .map(b => b.trim())
    .filter(b => b.length > 0);
  
  // Module toggles
  const enableGallery = parseBoolean(tallyData['activer-galerie'] || tallyData['enable-gallery']);
  const enableReviews = parseBoolean(tallyData['activer-avis'] || tallyData['enable-reviews']);
  const enablePricing = parseBoolean(tallyData['activer-tarifs'] || tallyData['enable-pricing']);
  const enableEmergencyBanner = parseBoolean(tallyData['activer-bandeau-urgence'] || tallyData['enable-emergency-banner'] || 'true');
  const enableSectionDescriptions = parseBoolean(tallyData['activer-descriptions'] || tallyData['enable-section-descriptions']);
  const enableAboutExtended = parseBoolean(tallyData['activer-a-propos-etendu'] || tallyData['enable-about-extended']);
  const enableTrustSection = parseBoolean(tallyData['activer-garanties'] || tallyData['enable-trust-section']);
  const enableCertifications = parseBoolean(tallyData['activer-certifications'] || tallyData['enable-certifications']);
  
  // Reviews (parse from numbered fields or array)
  const reviews = [];
  if (enableReviews) {
    for (let i = 1; i <= 3; i++) {
      const name = tallyData[`avis-${i}-nom`] || tallyData[`review-${i}-name`];
      const text = tallyData[`avis-${i}-texte`] || tallyData[`review-${i}-text`];
      const rating = tallyData[`avis-${i}-note`] || tallyData[`review-${i}-rating`] || '5';
      
      if (name && text) {
        reviews.push({ name, text, rating: rating.toString() });
      }
    }
  }
  
  // Pricing (parse from numbered fields)
  const pricing = [];
  if (enablePricing) {
    for (let i = 1; i <= 5; i++) {
      const service = tallyData[`tarif-${i}-service`] || tallyData[`price-${i}-service`];
      const price = tallyData[`tarif-${i}-prix`] || tallyData[`price-${i}-price`];
      const note = tallyData[`tarif-${i}-note`] || tallyData[`price-${i}-note`] || '';
      
      if (service && price) {
        pricing.push({ service, price: price.toString(), note });
      }
    }
  }
  
  // Handle images
  let logoUrl = null;
  let heroImage = null;
  
  const logoField = tallyData['logo'] || tallyData['logo-file'];
  const heroField = tallyData['image-hero'] || tallyData['hero-image'] || tallyData['hero-background'];
  
  if (download && submissionId) {
    const slug = slugify(businessName);
    const shortId = submissionId.substring(0, 6);
    const clientDir = join(projectRoot, 'assets', 'clients', `${slug}-${shortId}`);
    
    // Download logo
    if (logoField && logoField.url) {
      const ext = logoField.name?.split('.').pop() || 'png';
      const logoPath = join(clientDir, `logo.${ext}`);
      const success = await downloadFile(logoField.url, logoPath);
      if (success) {
        logoUrl = `/assets/clients/${slug}-${shortId}/logo.${ext}`;
        console.log(`✅ Logo téléchargé: ${logoUrl}`);
      }
    }
    
    // Download hero
    if (heroField && heroField.url) {
      const ext = heroField.name?.split('.').pop() || 'jpg';
      const heroPath = join(clientDir, `hero.${ext}`);
      const success = await downloadFile(heroField.url, heroPath);
      if (success) {
        heroImage = `/assets/clients/${slug}-${shortId}/hero.${ext}`;
        console.log(`✅ Hero téléchargé: ${heroImage}`);
      }
    }
  } else {
    // Use remote URLs if not downloading
    if (logoField && logoField.url) {
      logoUrl = logoField.url;
    }
    if (heroField && heroField.url) {
      heroImage = heroField.url;
    }
  }
  
  // Build final config
  const config = {
    business_name: businessName,
    business_type: businessType,
    city: city,
    phone: phone,
    email: email,
    address: address,
    service_areas: areas.join(', '),
    availability: is24_7 ? '24/7' : 'heures ouvrables',
    response_time: responseTime,
    accent_color: accentColor,
    hero_title: heroTitle,
    hero_subtitle: heroSubtitle,
    description: description,
    cta_primary: ctaPrimary,
    cta_secondary: ctaSecondary,
    urgency_banner: urgencyBanner,
    trust_badges: trustBadges.join(', '),
    enable_gallery: enableGallery.toString(),
    enable_reviews: enableReviews.toString(),
    enable_pricing: enablePricing.toString(),
    enable_emergency_banner: enableEmergencyBanner.toString(),
    enable_section_descriptions: enableSectionDescriptions.toString(),
    enable_about_extended: enableAboutExtended.toString(),
    enable_trust_section: enableTrustSection.toString(),
    enable_certifications: enableCertifications.toString(),
    reviews: reviews,
    pricing: pricing
  };
  
  // Add logo/hero if available
  if (logoUrl) config.logo_url = logoUrl;
  if (heroImage) config.hero_image = heroImage;
  
  return config;
}

// Main function
async function main() {
  console.log('🚀 Import Tally → Site Config\n');
  
  try {
    const args = parseArgs();
    
    if (!args.id) {
      console.error('❌ Usage: npm run tally:pull -- --id=<SUBMISSION_ID> [--download]');
      process.exit(1);
    }
    
    // Fetch submission
    const submission = await fetchTallySubmission(args.id);
    
    // Flatten answers
    const tallyData = flattenTallyAnswers(submission);
    
    // Map to site config
    const siteConfig = await mapToSiteConfig(tallyData, {
      download: args.download,
      submissionId: args.id
    });
    
    // Write to input/site-config.json
    const configPath = join(projectRoot, 'input', 'site-config.json');
    writeFileSync(configPath, JSON.stringify(siteConfig, null, 2));
    
    console.log('\n✅ Configuration importée avec succès !');
    console.log(`📄 Fichier: input/site-config.json`);
    console.log(`🏢 Entreprise: ${siteConfig.business_name}`);
    console.log(`🏙️ Ville: ${siteConfig.city}`);
    console.log(`🎨 Type: ${siteConfig.business_type}`);
    console.log(`📞 Téléphone: ${prettifyPhone(siteConfig.phone)}`);
    
    if (args.download) {
      if (siteConfig.logo_url) console.log(`🎨 Logo: ${siteConfig.logo_url}`);
      if (siteConfig.hero_image) console.log(`🖼️ Hero: ${siteConfig.hero_image}`);
    }
    
    console.log('\n🚀 Prochaines étapes:');
    console.log('  npm run generate  # Générer le site');
    console.log('  npm run dev       # Prévisualiser');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
