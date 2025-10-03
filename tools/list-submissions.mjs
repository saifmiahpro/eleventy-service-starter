#!/usr/bin/env node

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const API_KEY = process.env.TALLY_API_KEY;
const FORM_ID = process.env.TALLY_FORM_ID;

if (!API_KEY || !FORM_ID) {
  console.log('❌ TALLY_API_KEY ou TALLY_FORM_ID manquant dans .env.local');
  console.log('API_KEY:', API_KEY ? 'OK' : 'MANQUANT');
  console.log('FORM_ID:', FORM_ID ? 'OK' : 'MANQUANT');
  process.exit(1);
}

try {
  console.log('🔍 Récupération des soumissions Tally...\n');
  
  const response = await fetch(`https://api.tally.so/forms/${FORM_ID}/responses`, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });

  if (!response.ok) {
    console.log(`❌ Erreur API: ${response.status} ${response.statusText}`);
    process.exit(1);
  }

  const data = await response.json();
  const submissions = data.data || [];

  if (submissions.length === 0) {
    console.log('📋 Aucune soumission trouvée.');
    process.exit(0);
  }

  console.log(`📋 ${submissions.length} soumission(s) trouvée(s) :\n`);

  submissions.slice(0, 5).forEach((sub, i) => {
    const date = new Date(sub.createdAt).toLocaleString('fr-FR');
    const fields = sub.fields || [];
    const businessName = fields.find(f => f.key === 'business_name')?.value || 'N/A';
    const city = fields.find(f => f.key === 'city')?.value || 'N/A';
    
    console.log(`${i + 1}. 🆔 ${sub.responseId}`);
    console.log(`   👤 Entreprise: ${businessName}`);
    console.log(`   🏙️  Ville: ${city}`);
    console.log(`   📅 Date: ${date}`);
    console.log('');
  });

  console.log(`\n💡 Pour importer la dernière:\n`);
  console.log(`   npm run tally:pull -- --id=${submissions[0].responseId}\n`);
  console.log(`💾 Avec téléchargement des images:\n`);
  console.log(`   npm run tally:pull -- --id=${submissions[0].responseId} --download\n`);
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}
