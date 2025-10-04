# 🚀 WORKFLOW COMPLET - PROSPECTION & GÉNÉRATION

**Version:** 1.0  
**Date:** 4 octobre 2025  
**Status:** ✅ Production Ready

---

## 📦 CE QUI EST PRÊT

### ✅ **1. GOLDEN TEMPLATES SAUVEGARDÉES**
📁 `.backups/golden-templates-20251004/`
- 3 presets parfaits (dépanneur, électricien, serrurier)
- Templates validés design 2025
- Carousels infinis fonctionnels
- Héros avec glassmorphism

### ✅ **2. SYSTÈME D'OFFRES CONDITIONNELLES**
- `src/_data/pack-features.json` → Mapping offres/features
- `test-integration.njk` → Affiche/cache sections selon pack
- Lite (299€) → Minimal
- Standard (499€) → Complet
- Premium (799€) → Enrichi

### ✅ **3. SCRIPT AUTO-GÉNÉRATION**
```bash
npm run auto
```
**Fait automatiquement :**
1. Liste toutes les soumissions Tally
2. Sélection interactive
3. Import + validation données
4. Génération site complet
5. Build Eleventy

---

## 🎯 TON WORKFLOW IDÉAL

### **ÉTAPE 1 : PROSPECT REMPLIT TALLY** 📝
- Tu envoies ton document Gamma
- Client clique sur lien Tally
- Il remplit le questionnaire (5-10 min)

### **ÉTAPE 2 : TU GÉNÈRES LE SITE** 🔨
```bash
cd /Users/tekna/Documents/tekna-starter
npm run auto
```

**Le script fait :**
- Liste les soumissions
- Tu sélectionnes le bon client
- Import automatique des données
- Validation interactive
- Génération complète

### **ÉTAPE 3 : TU TESTES LES 3 PACKS** 🎨

**Pack LITE (299€) :**
```bash
# Modifier site.json : "PACK": "lite"
npm run build
```
→ Héros + Services (grid) + Contact

**Pack STANDARD (499€) :**
```bash
# Modifier site.json : "PACK": "standard"
npm run build
```
→ Tout Lite + Galerie + Avis + FAQ + Zones

**Pack PREMIUM (799€) :**
```bash
# Modifier site.json : "PACK": "premium"  
npm run build
```
→ Tout Standard + Carousels + Blog

### **ÉTAPE 4 : HÉBERGEMENT PREVIEW** 🌐

**Option A : Netlify (recommandé)**
```bash
# One-time setup
npm install netlify-cli -g
netlify login
netlify init

# Deploy preview
netlify deploy --dir=_site
```
→ URL: `https://[random].netlify.app`

**Option B : Vercel**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Option C : GitHub Pages** (gratuit mais plus lent)

### **ÉTAPE 5 : ENVOYER AU CLIENT** 📧

**Template Email :**
```
Bonjour [Nom],

Voici votre site web personnalisé !

🔗 Page des offres: https://[preview-url]/offres/

Sur cette page, vous pouvez :
✅ Comparer les 3 formules (Lite, Standard, Premium)
✅ Voir un aperçu de chaque site
✅ Choisir celle qui vous convient

Cliquez sur "Voir le site" pour chaque offre.

À très vite !
```

### **ÉTAPE 6 : CLIENT CHOISIT** ✅
- Il visite `/offres/`
- Compare les 3 versions
- Te répond : "Je prends la Standard"

### **ÉTAPE 7 : FINALISATION** 🎉
```bash
# Mettre le bon pack dans site.json
# Exemple: "PACK": "standard"

# Build production
npm run build

# Deploy final
netlify deploy --prod
```

---

## 📊 MAPPING OFFRES → FEATURES

### **LITE - 299€**
- ✅ Héros
- ✅ Services (grid, max 4)
- ✅ Contact
- ❌ Galerie
- ❌ Avis
- ❌ FAQ
- ❌ Zones

### **STANDARD - 499€** ⭐ Recommandé
- ✅ Héros
- ✅ Services (carousel, max 8)
- ✅ Galerie (grid, 6 photos)
- ✅ Avis clients (6 max)
- ✅ FAQ (6 questions)
- ✅ Zones d'intervention
- ✅ Contact + Google Maps
- ❌ Blog

### **PREMIUM - 799€**
- ✅ Tout Standard +
- ✅ Services (carousel, max 12)
- ✅ Galerie (carousel, 12 photos)
- ✅ Avis clients (12 max)
- ✅ FAQ enrichie (10 questions)
- ✅ Blog (à implémenter)
- ✅ Chat widget (à implémenter)

---

## 🛠️ COMMANDES UTILES

### **Génération**
```bash
npm run auto              # Workflow complet (recommandé)
npm run tally:pull        # Import Tally seulement
npm run generate          # Génère depuis input/site-config.json
npm run build             # Build Eleventy
```

### **Tests locaux**
```bash
npm start                 # Lance serveur local
# → http://localhost:8080/test-integration/
# → http://localhost:8080/offres/
```

### **Customisation**
```bash
npm run trade depanneur   # Change métier
npm run color rouge       # Change couleur
npm run variant services carousel  # Change variante
```

### **Changer de pack**
Éditer `src/_data/site.json` :
```json
{
  "PACK": "lite"    // ou "standard" ou "premium"
}
```
Puis : `npm run build`

---

## 📁 FICHIERS CLÉS

### **Configuration client**
- `src/_data/site.json` → Données du site
- `src/_data/identity.json` → Infos business
- `input/site-config.json` → Import Tally

### **Configuration système**
- `src/_data/pack-features.json` → Mapping offres
- `src/_data/trades.json` → Données métiers
- `src/_data/offers.json` → 3 offres

### **Templates**
- `src/test-integration.njk` → Page complète (avec conditionnels)
- `src/offres.njk` → Page des offres
- `src/_includes/sections/*.njk` → Sections modulaires

---

## 🎯 OBJECTIFS BUSINESS

### **Temps de génération**
- ⏱️ **5 minutes** par site (au lieu de 20h manuel)
- 📦 **3 previews** en un seul build
- 🎨 Customisation instantanée

### **Coûts**
- 💰 **0€** par site généré
- 🌐 **0€** hosting preview (Netlify free tier)
- 📈 Marge = Prix de vente - Coût hébergement prod (~5€/mois)

### **Scalabilité**
- 📊 **10 sites/semaine** possible
- 🚀 **40 clients/mois** = 20k€ CA potentiel
- ⚡ Automatisation complète

---

## ⚠️ POINTS D'ATTENTION

### **1. Toujours tester avant d'envoyer**
```bash
npm start
# Vérifier : /test-integration/ et /offres/
```

### **2. Vérifier les données Tally**
- Le script auto affiche un récap
- Valider avant génération

### **3. Sauvegardes régulières**
```bash
cp -r .backups/golden-templates-20251004 .backups/backup-$(date +%Y%m%d)
```

### **4. Nettoyer avant nouveau client**
Le script `npm run auto` fait déjà le nettoyage

---

## 🚀 PROCHAINES AMÉLIORATIONS

### **Court terme (1-2 sem)**
- [ ] Créer vraiment /offers/previews/lite|standard|premium
- [ ] Script deploy Netlify automatique
- [ ] Email template automatique

### **Moyen terme (1 mois)**
- [ ] Page blog pour Premium
- [ ] Chat widget pour Premium
- [ ] Animations scroll avancées

### **Long terme**
- [ ] Dashboard client (modifications)
- [ ] Paiement en ligne intégré
- [ ] Multi-langues

---

## 📞 AIDE RAPIDE

**Problème de build ?**
```bash
rm -rf _site && npm run build
```

**Reset complet ?**
```bash
cp -r .backups/golden-templates-20251004/src/_data/* src/_data/
npm run build
```

**Tally API ne répond pas ?**
→ Vérifier `.env.local` avec API key valide

---

## ✅ CHECKLIST AVANT PROSPECTION

- [ ] `npm run auto` fonctionne
- [ ] Les 3 packs s'affichent différemment
- [ ] `/offres/` affiche les 3 offres
- [ ] Netlify configuré
- [ ] Document Gamma à jour avec lien Tally
- [ ] Template email prêt

---

🎉 **Tu es maintenant prêt à prospecter !**

Pour toute question, consulte `AUDIT-CURRENT-STATE.md` ou les sauvegardes dans `.backups/`
