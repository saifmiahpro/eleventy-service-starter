#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

function getChoices() {
  const choicesPath = join(projectRoot, 'choices.json');
  
  if (!existsSync(choicesPath)) {
    console.log('📋 Aucun choix client enregistré pour le moment.');
    return [];
  }
  
  try {
    const choices = JSON.parse(readFileSync(choicesPath, 'utf8'));
    
    if (choices.length === 0) {
      console.log('📋 Aucun choix client enregistré pour le moment.');
      return [];
    }
    
    console.log(`\n📊 ${choices.length} choix client(s) enregistré(s) :\n`);
    
    choices.forEach((choice, index) => {
      const date = new Date(choice.timestamp).toLocaleString('fr-FR');
      console.log(`${index + 1}. 👤 ${choice.client || 'Client'}`);
      console.log(`   📦 Pack: ${choice.pack.toUpperCase()}`);
      console.log(`   📅 Date: ${date}`);
      console.log(`   🔗 URL: ${choice.url || 'N/A'}`);
      console.log('');
    });
    
    return choices;
    
  } catch (error) {
    console.error('❌ Erreur lecture choices.json:', error.message);
    return [];
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  getChoices();
}

export { getChoices };
