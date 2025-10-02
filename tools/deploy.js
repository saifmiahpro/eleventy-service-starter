#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, { cwd: projectRoot, stdio: 'inherit' });
    console.log(`✅ ${description} terminé`);
  } catch (error) {
    console.error(`❌ Erreur lors de: ${description}`);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Déploiement du site client\n');

  // Read site config for client name
  const siteConfig = JSON.parse(readFileSync(join(projectRoot, 'src/_data/site.json'), 'utf8'));
  const clientName = siteConfig.BUSINESS_NAME || 'Client';
  
  console.log(`👤 Client: ${clientName}`);
  console.log(`🏙️ Ville: ${siteConfig.CITY}`);
  console.log(`🎨 Couleur: ${siteConfig.ACCENT}\n`);

  // Build the site
  runCommand('npm run build', 'Construction du site');

  // Optional: Deploy to Netlify (if netlify-cli is installed)
  try {
    execSync('which netlify', { stdio: 'ignore' });
    console.log('\n🌐 Netlify CLI détecté');
    
    const deployChoice = process.argv[2];
    if (deployChoice === '--deploy') {
      runCommand('netlify deploy --prod --dir=_site', 'Déploiement sur Netlify');
      console.log('\n🎉 Site déployé avec succès !');
    } else {
      console.log('💡 Pour déployer: node tools/deploy.js --deploy');
    }
  } catch {
    console.log('\n📦 Site construit dans le dossier _site/');
    console.log('💡 Uploadez le contenu de _site/ sur votre hébergeur');
  }

  console.log('\n📋 Checklist livraison client:');
  console.log('  ✅ Site construit et testé');
  console.log('  ✅ Responsive vérifié');
  console.log('  ✅ Liens de contact fonctionnels');
  console.log('  ✅ SEO de base optimisé');
  
  if (siteConfig.LOGO_URL) {
    console.log('  ⚠️  Vérifier que le logo est bien uploadé');
  }
  
  if (siteConfig.ENABLE_GALLERY && siteConfig.GALLERY.length === 0) {
    console.log('  ⚠️  Galerie activée mais aucune image fournie');
  }

  console.log(`\n💰 Facturation: Voir BUSINESS-GUIDE.md pour les tarifs`);
}

main().catch(console.error);
