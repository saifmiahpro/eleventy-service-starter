#!/usr/bin/env node

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import { readFileSync, rmSync, existsSync } from 'fs';
import { createInterface } from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const API_KEY = process.env.TALLY_API_KEY;
const FORM_ID = process.env.TALLY_FORM_ID;

if (!API_KEY || !FORM_ID) {
  console.log('❌ TALLY_API_KEY ou TALLY_FORM_ID manquant dans .env.local');
  process.exit(1);
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Fonction de nettoyage des anciennes données
function cleanupOldData() {
  console.log('🧹 Nettoyage des anciennes données...');
  
  const projectRoot = join(__dirname, '..');
  
  // Nettoyer les dossiers clients précédents
  const clientsDir = join(projectRoot, 'assets', 'clients');
  if (existsSync(clientsDir)) {
    try {
      rmSync(clientsDir, { recursive: true, force: true });
      console.log('✅ Dossiers clients supprimés');
    } catch (error) {
      console.log('⚠️ Erreur nettoyage clients:', error.message);
    }
  }
  
  // Nettoyer les offres précédentes
  const offersDir = join(projectRoot, 'offers');
  const filesToClean = [
    'lite-site.json',
    'standard-site.json', 
    'premium-site.json',
    'comparatif.html'
  ];
  
  filesToClean.forEach(file => {
    const filePath = join(offersDir, file);
    if (existsSync(filePath)) {
      try {
        rmSync(filePath);
        console.log(`✅ ${file} supprimé`);
      } catch (error) {
        console.log(`⚠️ Erreur suppression ${file}:`, error.message);
      }
    }
  });
  
  // Nettoyer le dossier previews
  const previewsDir = join(offersDir, 'previews');
  if (existsSync(previewsDir)) {
    try {
      rmSync(previewsDir, { recursive: true, force: true });
      console.log('✅ Previews supprimés');
    } catch (error) {
      console.log('⚠️ Erreur nettoyage previews:', error.message);
    }
  }
  
  // Nettoyer _site
  const siteDir = join(projectRoot, '_site');
  if (existsSync(siteDir)) {
    try {
      rmSync(siteDir, { recursive: true, force: true });
      console.log('✅ Cache _site supprimé');
    } catch (error) {
      console.log('⚠️ Erreur nettoyage _site:', error.message);
    }
  }
  
  console.log('');
}

async function main() {
  try {
    console.log('🚀 Workflow automatique : Tally → Offres → Previews\n');
    
    // Nettoyage des anciennes données
    cleanupOldData();
    
    console.log('📡 Récupération des soumissions Tally...\n');
    
    const response = await fetch(`https://api.tally.so/forms/${FORM_ID}/submissions`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!response.ok) {
      console.log(`❌ Erreur API Tally: ${response.status} ${response.statusText}`);
      rl.close();
      process.exit(1);
    }

    const data = await response.json();
    const submissions = data.submissions || [];

    if (submissions.length === 0) {
      console.log('📋 Aucune soumission trouvée.');
      rl.close();
      process.exit(0);
    }

    // Trier par date décroissante
    submissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    console.log(`📋 ${submissions.length} soumission(s) disponible(s) :\n`);

    submissions.slice(0, 10).forEach((sub, i) => {
      const date = new Date(sub.submittedAt).toLocaleString('fr-FR');
      const responses = sub.responses || [];
      
      // Chercher business_name dans les responses (prendre la première valeur texte)
      let businessName = 'Client';
      for (const r of responses) {
        if (r.value && typeof r.value === 'string' && r.value.trim().length > 3) {
          businessName = r.value.trim();
          break;
        }
      }
      
      console.log(`${i + 1}. ${businessName.substring(0, 40)}`);
      console.log(`   📅 ${date}`);
      console.log(`   🆔 ${sub.id.substring(0, 12)}...`);
      console.log('');
    });

    const answer = await question(`\n🎯 Quelle soumission traiter ? (1-${Math.min(submissions.length, 10)} ou Entrée pour la plus récente) : `);
    
    rl.close();
    
    const index = answer.trim() === '' ? 0 : parseInt(answer) - 1;
    
    if (index < 0 || index >= submissions.length) {
      console.log('❌ Choix invalide');
      process.exit(1);
    }

    const selected = submissions[index];
    const responses = selected.responses || [];
    let businessName = 'Client';
    for (const r of responses) {
      if (r.value && typeof r.value === 'string' && r.value.trim().length > 3) {
        businessName = r.value.trim();
        break;
      }
    }
    
    console.log(`\n✅ Soumission sélectionnée: ${businessName}`);
    console.log(`   ID: ${selected.id}\n`);
    
    // Import soumission
    console.log('📥 Étape 1/2 : Import + téléchargement images...');
    execSync(`npm run tally:pull -- --id=${selected.id} --download`, { 
      stdio: 'inherit',
      cwd: join(__dirname, '..')
    });
    
    // Afficher les données importées pour validation
    console.log('\n📊 DONNÉES IMPORTÉES :');
    console.log('=' .repeat(50));
    
    const configPath = join(__dirname, '..', 'input', 'site-config.json');
    let config;
    try {
      config = JSON.parse(readFileSync(configPath, 'utf8'));
    } catch (error) {
      console.log('❌ Erreur lecture config:', error.message);
      process.exit(1);
    }
    
    console.log(`🏢 Entreprise: ${config.business_name}`);
    console.log(`🎯 Métier: ${config.business_type}`);
    console.log(`🏙️ Ville: ${config.city}`);
    console.log(`📞 Téléphone: ${config.phone}`);
    console.log(`✉️ Email: ${config.email}`);
    console.log(`🎨 Couleur: ${config.accent_color}`);
    console.log(`📍 Adresse: ${config.address}`);
    console.log(`🖼️ Logo: ${config.logo_url ? '✅ Fourni' : '❌ Pas de logo'}`);
    console.log(`🎨 Image hero: ${config.hero_image ? '✅ Fournie' : '❌ Image par défaut'}`);
    
    console.log('\n' + '=' .repeat(50));
    
    // Demander validation
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const validateAnswer = await new Promise(resolve => {
      readline.question('\n✅ Ces données sont-elles correctes ? (o/N) : ', resolve);
    });
    
    readline.close();
    
    if (validateAnswer.toLowerCase() !== 'o' && validateAnswer.toLowerCase() !== 'oui') {
      console.log('\n❌ Génération annulée. Vérifiez les données Tally et relancez.');
      process.exit(0);
    }
    
    // Génération site
    console.log('\n🔨 Étape 2/2 : Génération du site...');
    execSync(`npm run generate`, { 
      stdio: 'inherit',
      cwd: join(__dirname, '..')
    });
    
    // Génération offres (optionnel)
    console.log('\n📦 Génération des 3 offres...');
    execSync(`npm run generate:offers`, { 
      stdio: 'inherit',
      cwd: join(__dirname, '..')
    });
    
    console.log('\n✅ Workflow terminé !');
    console.log(`\n📊 Site généré pour: ${businessName}`);
    console.log(`🔗 Page offres: http://localhost:8080/offres/`);
    console.log(`\n📱 Envoie ce lien au client par SMS !\n`);
    
  } catch (error) {
    rl.close();
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

main();
