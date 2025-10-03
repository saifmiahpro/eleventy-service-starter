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
  process.exit(1);
}

async function main() {
  try {
    console.log('�� Récupération des soumissions Tally...\n');
    
    const response = await fetch(`https://api.tally.so/forms/${FORM_ID}/submissions`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!response.ok) {
      console.log(`❌ Erreur API: ${response.status} ${response.statusText}`);
      process.exit(1);
    }

    const data = await response.json();
    const submissions = data.submissions || [];

    if (submissions.length === 0) {
      console.log('📋 Aucune soumission trouvée.');
      process.exit(0);
    }

    // Trier par date décroissante
    submissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    console.log(`📋 ${submissions.length} soumission(s) trouvée(s) :\n`);

    submissions.slice(0, 10).forEach((sub, i) => {
      const date = new Date(sub.submittedAt).toLocaleString('fr-FR');
      const responses = sub.responses || [];
      
      // Chercher business_name (première valeur texte)
      let businessName = 'Client';
      for (const r of responses) {
        if (r.value && typeof r.value === 'string' && r.value.trim().length > 3) {
          businessName = r.value.trim();
          break;
        }
      }
      
      console.log(`${i + 1}. 🆔 ${sub.id.substring(0, 12)}...`);
      console.log(`   👤 ${businessName.substring(0, 50)}`);
      console.log(`   �� ${date}`);
      console.log(`   ✅ ${sub.isCompleted ? 'Complété' : 'Partiel'}`);
      console.log('');
    });

    console.log(`\n💡 Pour importer:\n`);
    console.log(`   npm run tally:pull -- --id=${submissions[0].id} --download\n`);
    console.log(`📦 Ou utilise le workflow automatique:\n`);
    console.log(`   npm run auto\n`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

main();
