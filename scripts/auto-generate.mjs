#!/usr/bin/env node

/**
 * AUTO-GENERATE WORKFLOW
 * ======================
 * 1. Liste les soumissions Tally
 * 2. User sélectionne
 * 3. Génère le site complet
 * 4. Build + preview URL
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

console.log('\n🚀 AUTO-GENERATE - Workflow complet\n');
console.log('=' .repeat(50));

// Charger les soumissions Tally
const tallyDataPath = path.join(rootDir, 'tally-data.json');

if (!fs.existsSync(tallyDataPath)) {
  console.log('\n❌ Aucune donnée Tally trouvée.');
  console.log('📥 Récupération des données...\n');
  
  try {
    execSync('node scripts/tally-pull.mjs', { stdio: 'inherit', cwd: rootDir });
  } catch (error) {
    console.error('\n❌ Erreur lors de la récupération des données Tally');
    process.exit(1);
  }
}

// Lire les soumissions
let tallyData;
try {
  const rawData = fs.readFileSync(tallyDataPath, 'utf8');
  tallyData = JSON.parse(rawData);
} catch (error) {
  console.error('❌ Erreur lecture tally-data.json:', error.message);
  process.exit(1);
}

if (!tallyData.data || tallyData.data.length === 0) {
  console.log('\n⚠️  Aucune soumission trouvée dans Tally');
  process.exit(1);
}

// Afficher la liste
console.log('\n📋 Soumissions Tally disponibles:\n');
tallyData.data.forEach((submission, index) => {
  const responses = submission.fields || [];
  const businessName = responses.find(r => r.key === 'question_mPkZqp')?.value || 'Sans nom';
  const trade = responses.find(r => r.key === 'question_wZYRGV')?.value || 'Non spécifié';
  const date = new Date(submission.createdAt).toLocaleDateString('fr-FR');
  
  console.log(`  [${index + 1}] ${businessName} - ${trade} - ${date}`);
});

console.log('\n' + '='.repeat(50));

// Sélection
const answer = await question('\n👉 Sélectionnez une soumission (numéro): ');
const selectedIndex = parseInt(answer) - 1;

if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= tallyData.data.length) {
  console.log('\n❌ Sélection invalide');
  rl.close();
  process.exit(1);
}

const selectedSubmission = tallyData.data[selectedIndex];
console.log(`\n✅ Sélection: ${selectedSubmission.fields.find(r => r.key === 'question_mPkZqp')?.value || 'Client'}\n`);

// Sauvegarder la soumission sélectionnée
fs.writeFileSync(
  path.join(rootDir, 'current-submission.json'),
  JSON.stringify(selectedSubmission, null, 2)
);

console.log('🔄 Génération du site...\n');

// Exécuter generate-from-config
try {
  execSync('node scripts/generate-from-config.js', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  console.error('\n❌ Erreur lors de la génération');
  rl.close();
  process.exit(1);
}

console.log('\n🏗️  Build du site...\n');

// Build Eleventy
try {
  execSync('npx @11ty/eleventy', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  console.error('\n❌ Erreur lors du build');
  rl.close();
  process.exit(1);
}

console.log('\n' + '='.repeat(50));
console.log('\n✅ Site généré avec succès!\n');
console.log('📁 Fichiers dans: _site/');
console.log('🌐 Page principale: _site/test-integration/index.html');
console.log('💰 Page offres: _site/offres/index.html');
console.log('\n💡 Pour prévisualiser:');
console.log('   npm start\n');
console.log('=' . repeat(50) + '\n');

rl.close();
