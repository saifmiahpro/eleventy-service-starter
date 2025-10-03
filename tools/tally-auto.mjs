#!/usr/bin/env node

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const API_KEY = process.env.TALLY_API_KEY;
const FORM_ID = process.env.TALLY_FORM_ID;

if (!API_KEY || !FORM_ID) {
  console.log('❌ TALLY_API_KEY ou TALLY_FORM_ID manquant dans .env.local');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

try {
  console.log('🚀 Workflow automatique : Tally → Offres → Previews\n');
  console.log('📡 Récupération des soumissions Tally...\n');
  
  const response = await fetch(`https://api.tally.so/forms/${FORM_ID}/responses`, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });

  if (!response.ok) {
    console.log(`❌ Erreur API Tally: ${response.status}`);
    rl.close();
    process.exit(1);
  }

  const data = await response.json();
  const submissions = data.data || [];

  if (submissions.length === 0) {
    console.log('📋 Aucune soumission trouvée.');
    rl.close();
    process.exit(0);
  }

  console.log(`📋 ${submissions.length} soumission(s) disponible(s) :\n`);

  submissions.slice(0, 10).forEach((sub, i) => {
    const date = new Date(sub.createdAt).toLocaleString('fr-FR');
    const fields = sub.fields || [];
    const businessName = fields.find(f => f.key === 'business_name')?.value || 'N/A';
    const city = fields.find(f => f.key === 'city')?.value || 'N/A';
    
    console.log(`${i + 1}. ${businessName} - ${city}`);
    console.log(`   📅 ${date}`);
    console.log('');
  });

  const answer = await question(`\n🎯 Quelle soumission traiter ? (1-${Math.min(submissions.length, 10)} ou Entrée pour la dernière) : `);
  
  rl.close();
  
  const index = answer.trim() === '' ? 0 : parseInt(answer) - 1;
  
  if (index < 0 || index >= submissions.length) {
    console.log('❌ Choix invalide');
    process.exit(1);
  }

  const selected = submissions[index];
  const fields = selected.fields || [];
  const businessName = fields.find(f => f.key === 'business_name')?.value || 'Client';
  
  console.log(`\n✅ Soumission sélectionnée: ${businessName}`);
  console.log(`   ID: ${selected.responseId}\n`);
  
  // Import soumission
  console.log('📥 Étape 1/3 : Import + téléchargement images...');
  execSync(`npm run tally:pull -- --id=${selected.responseId} --download`, { 
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });
  
  // Génération site
  console.log('\n🔨 Étape 2/3 : Génération du site...');
  execSync(`npm run generate`, { 
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });
  
  // Génération offres
  console.log('\n📦 Étape 3/3 : Génération des 3 offres...');
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
