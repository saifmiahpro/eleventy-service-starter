#!/usr/bin/env node

import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

try {
  console.log('🚀 Workflow automatique : Tally → Offres → Previews\n');
  console.log('💡 Va sur https://tally.so et copie l\'ID de la soumission\n');
  
  const submissionId = await question('🆔 Colle l\'ID de la soumission (ou Entrée pour skip Tally) : ');
  
  rl.close();
  
  if (submissionId.trim()) {
    // Import soumission Tally
    console.log('\n📥 Import soumission + téléchargement images...');
    execSync(`npm run tally:pull -- --id=${submissionId.trim()} --download`, { 
      stdio: 'inherit',
      cwd: join(__dirname, '..')
    });
  } else {
    console.log('\n⏭️  Skip Tally - Utilise input/site-config.json existant');
  }
  
  // Génération site
  console.log('\n🔨 Génération du site...');
  execSync(`npm run generate`, { 
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });
  
  // Génération offres
  console.log('\n📦 Génération des 3 offres...');
  execSync(`npm run generate:offers`, { 
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });
  
  console.log('\n✅ Workflow terminé !');
  console.log(`🔗 Page offres: http://localhost:8080/offres/`);
  console.log(`📱 Envoie ce lien au client par SMS !\n`);
  
} catch (error) {
  rl.close();
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}
