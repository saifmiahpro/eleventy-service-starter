#!/usr/bin/env node

/**
 * GÉNÉRATION DES PAGES DÉMO
 * ==========================
 * Crée les 9 pages démo (3 métiers × 3 packs)
 * Pour la prospection commerciale
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const TRADES = ['depanneur', 'electricien', 'serrurier'];
const PACKS = ['lite', 'standard', 'premium'];

console.log('\n🎨 GÉNÉRATION DES PAGES DÉMO COMMERCIALES\n');
console.log('=' . repeat(50));

// Charger pack-features
const packFeaturesPath = path.join(rootDir, 'src/_data/pack-features.json');
const packFeatures = JSON.parse(fs.readFileSync(packFeaturesPath, 'utf8'));

// Pour chaque métier
TRADES.forEach(trade => {
  console.log(`\n📦 Métier: ${trade.toUpperCase()}`);
  
  // Charger le preset démo
  const presetPath = path.join(rootDir, 'presets', `demo-${trade}.json`);
  
  if (!fs.existsSync(presetPath)) {
    console.log(`   ⚠️  Preset demo-${trade}.json introuvable, skip`);
    return;
  }
  
  const baseConfig = JSON.parse(fs.readFileSync(presetPath, 'utf8'));
  
  // Pour chaque pack
  PACKS.forEach(pack => {
    console.log(`   🎯 Pack: ${pack}`);
    
    // Créer config avec le bon pack
    const config = {
      ...baseConfig,
      PACK: pack,
      trade: trade
    };
    
    // Sauvegarder dans site.json
    const siteJsonPath = path.join(rootDir, 'src/_data/site.json');
    fs.writeFileSync(siteJsonPath, JSON.stringify(config, null, 2));
    
    // Copier aussi dans identity.json
    const identityJsonPath = path.join(rootDir, 'src/_data/identity.json');
    fs.writeFileSync(identityJsonPath, JSON.stringify(config, null, 2));
    
    // Créer une page démo temporaire
    const demoPagePath = path.join(rootDir, 'src', `demo-${trade}-${pack}.njk`);
    const demoPageContent = `---
layout: demo-site.njk
title: ${baseConfig.BUSINESS_NAME}
permalink: /demos/${trade}/${pack}/
---`;
    
    fs.writeFileSync(demoPagePath, demoPageContent);
    
    // Build
    try {
      execSync('npx @11ty/eleventy --quiet', { cwd: rootDir });
      console.log(`      ✅ ${trade}/${pack}/index.html créé`);
      
      // Supprimer la page temporaire
      fs.unlinkSync(demoPagePath);
      
    } catch (error) {
      console.log(`      ❌ Erreur build: ${error.message}`);
      // Supprimer la page temporaire même en cas d'erreur
      if (fs.existsSync(demoPagePath)) {
        fs.unlinkSync(demoPagePath);
      }
    }
  });
});

console.log('\n' + '='.repeat(50));
console.log('\n✅ Génération terminée !\n');
console.log('📁 Pages créées dans : _site/demos/\n');
console.log('🌐 URLs de démo :');
TRADES.forEach(trade => {
  console.log(`\n${trade.toUpperCase()} :`);
  PACKS.forEach(pack => {
    const packInfo = packFeatures[pack];
    console.log(`  ${pack.padEnd(10)} (${packInfo.price}€) → /demos/${trade}/${pack}/`);
  });
});

console.log('\n💡 Déploie sur Netlify pour avoir les URLs publiques !\n');
console.log('=' . repeat(50) + '\n');
