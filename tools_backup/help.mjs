#!/usr/bin/env node

console.log(`
╔══════════════════════════════════════════════════════════════════════════╗
║                        🚀 tekNa Studio - Commandes                       ║
╚══════════════════════════════════════════════════════════════════════════╝

📱 WORKFLOW CLIENT (Automatique)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  npm run auto
    → Récupère dernière soumission Tally
    → Génère le site avec placeholders
    → Crée les 3 offres (LITE/STANDARD/PREMIUM)
    → Prêt à envoyer au client !

  npm run choices
    → Voir les choix des clients
    → Liste toutes les décisions prises


📥 IMPORT TALLY (Manuel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  npm run tally:list
    → Liste les 5 dernières soumissions
    → Affiche ID + Entreprise + Date

  npm run tally:pull -- --id=SUBMISSION_ID
    → Import soumission spécifique
    → Sans téléchargement images

  npm run tally:pull -- --id=SUBMISSION_ID --download
    → Import + téléchargement images
    → Logo + Hero


🔨 GÉNÉRATION SITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  npm run generate
    → Génère site depuis input/site-config.json
    → Applique pack (LITE/STANDARD/PREMIUM)
    → Backfill avec placeholders par métier

  npm run generate:offers
    → Génère les 3 offres depuis config actuelle
    → Crée previews LITE/STANDARD/PREMIUM
    → Page comparaison /offres/


🚀 DÉVELOPPEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  npm run dev
    → Lance serveur développement
    → Live reload sur http://localhost:8080

  npm run build
    → Build site pour production
    → Génère _site/


🔄 UTILITAIRES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  npm run reset
    → Restaure config par défaut
    → Efface customisations

  npm run help
    → Affiche ce message


💡 WORKFLOW TYPIQUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Nouveau prospect remplit formulaire Tally
  2. npm run auto                    ← Génère tout automatiquement
  3. npm run dev                     ← Vérifie le résultat
  4. Envoie http://localhost:8080/offres/ par SMS
  5. npm run choices                 ← Voir quel pack il a choisi


📚 Documentation complète : README.md

`);
