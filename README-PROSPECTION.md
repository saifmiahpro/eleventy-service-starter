# 🎯 STRATÉGIE DE PROSPECTION - RÉSUMÉ EXÉCUTIF

**Date:** 4 octobre 2025  
**Status:** ✅ PRÊT À PROSPECTER

---

## 💡 TA NOUVELLE APPROCHE (LA MEILLEURE)

### **AVANT (complexe) :**
Prospect → Tally → Génération → Preview → Espérer qu'il aime

### **MAINTENANT (smart) :**
**DÉMOS LIVE** → Prospect voit immédiatement → "J'aime le Standard" → **ENSUITE** Tally pour personnaliser

---

## 🚀 CE QUI EST PRÊT

### **1. PAGES DÉMO GÉNÉRIQUES (9 au total)**
```bash
npm run generate:demos
```

**Crée :**
- 3 métiers (dépanneur, électricien, serrurier)
- × 3 packs (Lite 299€, Standard 499€, Premium 799€)
- = 9 pages complètes avec placeholders Paris/Île-de-France

### **2. PAGE D'ACCUEIL DES DÉMOS**
`/demos/` → Navigation entre toutes les démos

### **3. SYSTÈME DE PACKS CONDITIONNELS**
- Lite → Minimal (Héros + Services + Contact)
- Standard → Complet (+ Galerie + Avis + FAQ + Zones)
- Premium → Enrichi (+ Carousels partout)

---

## 📧 WORKFLOW DE PROSPECTION

### **ÉTAPE 1 : ENVOYER LES DÉMOS**

**Email/LinkedIn :**
```
Bonjour [Nom],

Sites web modernes pour [métier] :

👉 Lite (299€) : [URL]
👉 Standard (499€) : [URL]  
👉 Premium (799€) : [URL]

Cliquez pour comparer !
```

### **ÉTAPE 2 : PROSPECT VISITE**
Il voit les 3 versions, compare, se projette.

### **ÉTAPE 3 : IL CHOISIT**
"J'aime bien le Standard !"

### **ÉTAPE 4 : PERSONNALISATION**
```bash
# Il remplit ton formulaire Tally
npm run auto
# → Sélectionne sa soumission
# → Site personnalisé généré avec ses infos
```

### **ÉTAPE 5 : LIVRAISON**
Deploy sur son domaine → Facture → $$$ 💰

---

## 🌐 DÉPLOIEMENT

### **Option 1 : Netlify (Recommandé - Gratuit)**
```bash
npm install netlify-cli -g
netlify login
netlify init
netlify deploy --prod
```

→ URL publique : `https://tekna-demos.netlify.app/demos/`

### **Option 2 : Vercel (Alternative)**
```bash
npm install -g vercel
vercel --prod
```

### **Option 3 : GitHub Pages**
Plus lent mais gratuit aussi.

---

## 💰 BUSINESS MODEL CLARIFIÉ

### **PROSPECTION AVEC DÉMOS**
- Coût : **0€** (Netlify gratuit)
- Temps : **0 min** (déjà fait)
- Impact : **Maximum** (client voit le résultat avant de payer)

### **VENTE**
- Client choisit pack → Tu factures
- Lite 299€ → Marge ~290€
- Standard 499€ → Marge ~490€
- Premium 799€ → Marge ~790€

### **PERSONNALISATION**
- Client remplit Tally (5-10 min)
- Tu génères avec `npm run auto` (5 min)
- Deploy final (~10 min)
- **Total : 15-20 min de travail**

### **REVENUS RÉCURRENTS (Optionnel)**
- Hébergement : 15€/mois
- Maintenance : 29€/mois
- Mises à jour : 50€/h

---

## 📊 CALCULS RÉALISTES

### **Scénario Conservateur**
- 2 ventes/mois × 499€ = **~1000€/mois**
- Temps total : ~1h/client = 2h/mois
- **500€/heure**

### **Scénario Réaliste**
- 5 ventes/mois × 499€ = **~2500€/mois**
- Temps total : ~5h/mois
- **500€/heure**

### **Scénario Ambitieux**
- 10 ventes/mois × 499€ = **~5000€/mois**
- + 5 maintenances × 29€ = 145€/mois
- **Total : ~5200€/mois**

---

## 🎯 AVANTAGES DE CETTE APPROCHE

### **Pour toi :**
✅ Pas besoin de créer un site pour chaque prospect
✅ Démos toujours à jour et modernes
✅ Scalable (10 prospects = même effort que 1)
✅ Closing plus rapide (ils voient avant d'acheter)

### **Pour le client :**
✅ Voit immédiatement le résultat
✅ Compare les 3 formules facilement
✅ Pas d'engagement avant d'être convaincu
✅ Rassuré sur la qualité

---

## 📋 FICHIERS CLÉS

### **Presets démo (génériques)**
- `presets/demo-depanneur.json` → Paris, infos génériques
- `presets/demo-electricien.json` → Paris, infos génériques
- `presets/demo-serrurier.json` → Paris, infos génériques

### **Script de génération**
- `scripts/generate-demos.mjs` → Crée les 9 pages
- `npm run generate:demos` → Commande

### **Pages générées**
- `_site/demos/[metier]/[pack]/index.html`
- `_site/demos/index.html` → Page d'accueil

---

## 🔄 MISES À JOUR

### **Modifier une démo**
```bash
# 1. Éditer le preset
nano presets/demo-depanneur.json

# 2. Régénérer
npm run generate:demos

# 3. Déployer
git push  # (si Netlify auto-deploy)
# ou
netlify deploy --prod
```

### **Ajouter un nouveau métier**
1. Créer `presets/demo-plombier.json`
2. Ajouter données dans `src/_data/trades.json`
3. Modifier `scripts/generate-demos.mjs` (ajouter 'plombier')
4. Régénérer

---

## ✅ CHECKLIST AVANT PROSPECTION

- [ ] `npm run generate:demos` fonctionne
- [ ] Les 9 pages s'affichent correctement en local
- [ ] Page `/demos/` accessible
- [ ] Site déployé sur Netlify/Vercel
- [ ] Toutes les URLs publiques testées
- [ ] Template email/LinkedIn prêt
- [ ] Formulaire Tally configuré
- [ ] `npm run auto` testé

---

## 🎓 TU PEUX MAINTENANT :

1. ✅ **Prospecter avec des démos live** (pas besoin de créer site custom d'abord)
2. ✅ **Closer plus vite** (client voit le résultat immédiatement)
3. ✅ **Scaler facilement** (même démos pour tous les prospects)
4. ✅ **Personnaliser ensuite** (une fois qu'il a payé)

---

## 📞 PROCHAINES ACTIONS

### **Aujourd'hui**
1. Déployer sur Netlify
2. Tester toutes les URLs
3. Préparer ton pitch

### **Cette semaine**
1. Prospecter 10 artisans
2. Envoyer les liens démo
3. Closer les premiers clients

### **Ce mois-ci**
1. 5 ventes minimum
2. Affiner les démos selon feedback
3. Ajouter témoignages réels

---

🎉 **Tu as maintenant une machine de prospection automatisée !**

**Questions ? Consulte :**
- `WORKFLOW-COMPLET.md` → Guide détaillé
- `DEPLOIEMENT-NETLIFY.md` → Setup hosting
- `AUDIT-CURRENT-STATE.md` → État technique
- `.backups/golden-templates-20251004/` → Sauvegarde
