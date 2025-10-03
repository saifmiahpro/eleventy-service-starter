#!/usr/bin/env node

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const API_KEY = process.env.TALLY_API_KEY;
const FORM_ID = process.env.TALLY_FORM_ID;

if (!API_KEY || !FORM_ID) {
  console.log('❌ TALLY_API_KEY ou TALLY_FORM_ID manquant dans .env.local');
  process.exit(1);
}

try {
  console.log('🚀 Workflow automatique : Tally → Offres → Previews\n');
  console.log('📡 Étape 1/4 : Récupération dernière soumission...');
  
  const response = await fetch(`https://api.tally.so/forms/${FORM_ID}/responses`, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });

  if (!response.ok) {
    console.log(`❌ Erreur API Tally: ${response.status}`);
    process.exit(1);
  }

  const data = await response.json();
  const submissions = data.data || [];

  if (submissions.length === 0) {
    console.log('📋 Aucune soumission trouvée.');
    process.exit(0);
  }

  const latest = submissions[0];
  const fields = latest.fields || [];
  const businessName = fields.find(f => f.key === 'business_name')?.value || 'Client';
  
  console.log(`✅ Soumission trouvée: ${businessName}`);
  console.log(`   ID: ${latest.responseId}`);
  console.log('');
  
  // Import soumission
  console.log('📥 Étape 2/4 : Import soumission + téléchargement images...');
  execSync(`npm run tally:pull -- --id=${latest.responseId} --download`, { 
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });
  
  // Génération site
  console.log('\n🔨 Étape 3/4 : Génération du site...');
  execSync(`npm run generate`, { 
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });
  
  // Génération offres
  console.log('\n📦 Étape 4/4 : Génération des 3 offres...');
  execSync(`npm run generate:offers`, { 
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });
  
  console.log('\n✅ Workflow terminé !');
  console.log(`📊 Site généré pour: ${businessName}`);
  console.log(`🔗 Page offres: http://localhost:8080/offres/`);
  console.log(`📱 Envoie ce lien au client par SMS !`);
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}
